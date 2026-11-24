package com.ftydownloader.pro;

import android.Manifest;
import android.app.Activity;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.ContentValues;
import android.content.Intent;
import android.content.UriPermission;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.media.MediaCodec;
import android.media.MediaExtractor;
import android.media.MediaFormat;
import android.media.MediaMetadataRetriever;
import android.media.MediaMuxer;
import android.media.MediaScannerConnection;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.DocumentsContract;
import android.provider.MediaStore;
import android.provider.OpenableColumns;
import android.provider.Settings;
import android.util.Base64;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import androidx.activity.result.ActivityResult;
import androidx.core.content.ContextCompat;
import androidx.core.content.FileProvider;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.json.JSONArray;
import org.json.JSONObject;

public class WhatsAppStatusBasePlugin extends Plugin {

    private final ConcurrentHashMap<String, String> thumbnailCache = new ConcurrentHashMap<>();
    private String lastRequestedAppType = null;

    private static final String EXTERNAL_STORAGE_AUTHORITY = "com.android.externalstorage.documents";

    private boolean isPackageInstalled(String packageName) {
        try {
            getContext().getPackageManager().getPackageInfo(packageName, PackageManager.GET_ACTIVITIES);
            return true;
        } catch (Exception ignored) {
            return false;
        }
    }

    private String resolveTargetAppType(String requestedAppType) {
        if ("whatsapp".equals(requestedAppType) || "business".equals(requestedAppType)) {
            return requestedAppType;
        }
        if (lastRequestedAppType != null && !lastRequestedAppType.isEmpty() && !"all".equals(lastRequestedAppType)) {
            return lastRequestedAppType;
        }
        boolean wa = isPackageInstalled("com.whatsapp");
        boolean wb = isPackageInstalled("com.whatsapp.w4b");
        if (wb && !wa) return "business";
        if (wa && !wb) return "whatsapp";
        return requestedAppType != null && !requestedAppType.isEmpty() ? requestedAppType : "all";
    }

    private boolean treeCoversAppType(String treeDocId, String appType) {
        if (treeDocId == null) return false;
        boolean coversBoth = "primary:".equals(treeDocId)
                || "primary:Android".equals(treeDocId)
                || "primary:Android/media".equals(treeDocId);
        boolean isBusinessTree = treeDocId.contains("com.whatsapp.w4b") || treeDocId.contains("WhatsApp Business");
        boolean isNormalWaTree = (treeDocId.contains("com.whatsapp") && !treeDocId.contains("com.whatsapp.w4b"))
                || (treeDocId.contains("WhatsApp") && !treeDocId.contains("WhatsApp Business"));

        if ("business".equals(appType)) {
            return coversBoth || isBusinessTree;
        }
        if ("whatsapp".equals(appType)) {
            return coversBoth || isNormalWaTree;
        }
        return coversBoth || isBusinessTree || isNormalWaTree;
    }

    private boolean hasSafPermission(String appType) {
        try {
            List<UriPermission> perms = getContext().getContentResolver().getPersistedUriPermissions();
            if (perms == null) return false;
            for (UriPermission perm : perms) {
                if (!perm.isReadPermission()) continue;
                try {
                    String treeDocId = DocumentsContract.getTreeDocumentId(perm.getUri());
                    if (treeCoversAppType(treeDocId, appType)) {
                        return true;
                    }
                } catch (Exception ignored) {}
            }
        } catch (Exception ignored) {}
        return false;
    }

    private List<File> getLegacyDirectoriesToScan(String appType) {
        List<File> directoriesToScan = new ArrayList<>();
        File extStorage = Environment.getExternalStorageDirectory();

        if ("all".equals(appType) || "whatsapp".equals(appType)) {
            directoriesToScan.add(new File(extStorage, "Android/media/com.whatsapp/WhatsApp/Media/.Statuses"));
            directoriesToScan.add(new File(extStorage, "WhatsApp/Media/.Statuses"));
            directoriesToScan.add(new File("/storage/emulated/0/Android/media/com.whatsapp/WhatsApp/Media/.Statuses"));
            directoriesToScan.add(new File("/storage/emulated/0/WhatsApp/Media/.Statuses"));
            directoriesToScan.add(new File("/storage/emulated/999/Android/media/com.whatsapp/WhatsApp/Media/.Statuses"));
        }

        if ("all".equals(appType) || "business".equals(appType)) {
            directoriesToScan.add(new File(extStorage, "Android/media/com.whatsapp.w4b/WhatsApp Business/Media/.Statuses"));
            directoriesToScan.add(new File(extStorage, "WhatsApp Business/Media/.Statuses"));
            directoriesToScan.add(new File("/storage/emulated/0/Android/media/com.whatsapp.w4b/WhatsApp Business/Media/.Statuses"));
            directoriesToScan.add(new File("/storage/emulated/0/WhatsApp Business/Media/.Statuses"));
            directoriesToScan.add(new File("/storage/emulated/999/Android/media/com.whatsapp.w4b/WhatsApp Business/Media/.Statuses"));
        }
        return directoriesToScan;
    }

    private boolean canReadLegacyDirectories(String appType) {
        // En Android 11+ (SDK >= 30), File.listFiles() devuelve un arreglo vacío File[0] (no null) por Scoped Storage.
        // Por tanto, solo es válido si realmente encuentra archivos multimedia legibles.
        for (File dir : getLegacyDirectoriesToScan(appType)) {
            try {
                if (dir.exists() && dir.isDirectory() && dir.canRead()) {
                    File[] files = dir.listFiles();
                    if (files != null && files.length > 0) {
                        for (File f : files) {
                            if (f.isFile() && f.length() > 0 && isSupportedStatusMediaName(f.getName())) {
                                return true;
                            }
                        }
                    }
                }
            } catch (Exception ignored) {}
        }
        return false;
    }

    private String getBestInitialSafDocId(String appType) {
        File extStorage = Environment.getExternalStorageDirectory();
        if ("business".equals(appType)) {
            File modernBiz = new File(extStorage, "Android/media/com.whatsapp.w4b");
            File legacyBiz = new File(extStorage, "WhatsApp Business/Media/.Statuses");
            if (!modernBiz.exists() && legacyBiz.exists()) {
                return "primary:WhatsApp Business/Media/.Statuses";
            }
            return "primary:Android/media/com.whatsapp.w4b/WhatsApp Business/Media/.Statuses";
        } else {
            File modernWa = new File(extStorage, "Android/media/com.whatsapp");
            File legacyWa = new File(extStorage, "WhatsApp/Media/.Statuses");
            if (!modernWa.exists() && legacyWa.exists()) {
                return "primary:WhatsApp/Media/.Statuses";
            }
            return "primary:Android/media/com.whatsapp/WhatsApp/Media/.Statuses";
        }
    }

    @PluginMethod
    public void checkPermission(PluginCall call) {
        String rawAppType = call.getString("appType", "");
        String appType = resolveTargetAppType(rawAppType);

        JSObject ret = new JSObject();
        boolean isSafRequired = Build.VERSION.SDK_INT >= Build.VERSION_CODES.R;
        boolean granted;

        if (isSafRequired) {
            granted = hasSafPermission(appType) || canReadLegacyDirectories(appType);
        } else {
            int result = ContextCompat.checkSelfPermission(getContext(), Manifest.permission.READ_EXTERNAL_STORAGE);
            granted = (result == PackageManager.PERMISSION_GRANTED) || hasSafPermission(appType);
        }

        ret.put("granted", granted);
        ret.put("isAllFiles", false);
        ret.put("isSaf", isSafRequired);
        ret.put("appType", appType);
        ret.put("sdkVersion", Build.VERSION.SDK_INT);
        call.resolve(ret);
    }

    @PluginMethod
    public void requestPermission(PluginCall call) {
        String rawAppType = call.getString("appType", "");
        String appType = resolveTargetAppType(rawAppType);
        if ("all".equals(appType)) {
            boolean wb = isPackageInstalled("com.whatsapp.w4b");
            boolean wa = isPackageInstalled("com.whatsapp");
            appType = (wb && !wa) ? "business" : "whatsapp";
        }
        lastRequestedAppType = appType;

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            try {
                String initialDocId = getBestInitialSafDocId(appType);
                Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT_TREE);
                intent.addFlags(
                        Intent.FLAG_GRANT_READ_URI_PERMISSION
                                | Intent.FLAG_GRANT_WRITE_URI_PERMISSION
                                | Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION
                                | Intent.FLAG_GRANT_PREFIX_URI_PERMISSION
                );
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    Uri initialUri = DocumentsContract.buildDocumentUri(EXTERNAL_STORAGE_AUTHORITY, initialDocId);
                    intent.putExtra(DocumentsContract.EXTRA_INITIAL_URI, initialUri);
                }
                startActivityForResult(call, intent, "handleSafTreeResult");
            } catch (Exception e) {
                call.reject("Error al abrir selector de carpeta de WhatsApp: " + e.getMessage());
            }
        } else {
            JSObject ret = new JSObject();
            Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
            intent.setData(Uri.parse("package:" + getContext().getPackageName()));
            getActivity().startActivity(intent);
            ret.put("openedSettings", true);
            ret.put("type", "app_details");
            call.resolve(ret);
        }
    }

    @ActivityCallback
    private void handleSafTreeResult(PluginCall call, ActivityResult result) {
        if (call == null) return;
        JSObject ret = new JSObject();

        if (result != null && result.getResultCode() == Activity.RESULT_OK && result.getData() != null) {
            Uri treeUri = result.getData().getData();
            if (treeUri != null) {
                try {
                    getContext().getContentResolver().takePersistableUriPermission(
                            treeUri,
                            Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_GRANT_WRITE_URI_PERMISSION
                    );
                } catch (Exception e1) {
                    try {
                        getContext().getContentResolver().takePersistableUriPermission(
                                treeUri,
                                Intent.FLAG_GRANT_READ_URI_PERMISSION
                        );
                    } catch (Exception e2) {
                        android.util.Log.w("WhatsAppStatus", "No se pudo persistir URI SAF: " + e2.getMessage());
                    }
                }
                ret.put("granted", true);
                ret.put("openedSettings", true);
                ret.put("uri", treeUri.toString());
                ret.put("type", "saf_tree");
                call.resolve(ret);
                return;
            }
        }

        ret.put("granted", false);
        ret.put("openedSettings", false);
        ret.put("type", "saf_cancelled");
        call.resolve(ret);
    }

    @PluginMethod
    public void checkInstalledApps(PluginCall call) {
        boolean wa = isPackageInstalled("com.whatsapp");
        boolean wb = isPackageInstalled("com.whatsapp.w4b");

        JSObject ret = new JSObject();
        ret.put("whatsappInstalled", wa);
        ret.put("businessInstalled", wb);
        ret.put("anyInstalled", wa || wb);
        call.resolve(ret);
    }

    private static class StatusEntry {
        String name;
        String pathOrUri;
        boolean isContentUri;
        Uri contentUri;
        boolean isVideo;
        boolean isBusiness;
        long sizeBytes;
        long lastModified;
    }

    private boolean isSupportedStatusMediaName(String name) {
        if (name == null) return false;
        String lower = name.toLowerCase(Locale.US);
        if (lower.startsWith(".") || lower.equals(".nomedia")) return false;
        return lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".png")
                || lower.endsWith(".webp") || lower.endsWith(".mp4") || lower.endsWith(".3gp")
                || lower.endsWith(".mov") || lower.endsWith(".mkv");
    }

    private boolean isVideoFileName(String name) {
        if (name == null) return false;
        String lower = name.toLowerCase(Locale.US);
        return lower.endsWith(".mp4") || lower.endsWith(".3gp") || lower.endsWith(".mov") || lower.endsWith(".mkv");
    }

    private void scanSafTreeForStatuses(Uri treeUri, String statusFolderDocId, boolean isBusiness, List<StatusEntry> outList) {
        Cursor cursor = null;
        try {
            Uri childrenUri = DocumentsContract.buildChildDocumentsUriUsingTree(treeUri, statusFolderDocId);
            String[] projection = new String[] {
                DocumentsContract.Document.COLUMN_DOCUMENT_ID,
                DocumentsContract.Document.COLUMN_DISPLAY_NAME,
                DocumentsContract.Document.COLUMN_SIZE,
                DocumentsContract.Document.COLUMN_LAST_MODIFIED,
                DocumentsContract.Document.COLUMN_MIME_TYPE
            };
            cursor = getContext().getContentResolver().query(childrenUri, projection, null, null, null);
            if (cursor == null) return;

            while (cursor.moveToNext()) {
                String docId = cursor.getString(0);
                String name = cursor.getString(1);
                long size = cursor.isNull(2) ? 0L : cursor.getLong(2);
                long lastMod = cursor.isNull(3) ? System.currentTimeMillis() : cursor.getLong(3);
                String mime = cursor.isNull(4) ? "" : cursor.getString(4);

                if (DocumentsContract.Document.MIME_TYPE_DIR.equals(mime)) continue;
                if (size <= 0 || !isSupportedStatusMediaName(name)) continue;

                boolean alreadyAdded = false;
                for (StatusEntry existing : outList) {
                    if (existing.name.equals(name) && existing.sizeBytes == size) {
                        alreadyAdded = true;
                        break;
                    }
                }
                if (alreadyAdded) continue;

                Uri fileUri = DocumentsContract.buildDocumentUriUsingTree(treeUri, docId);
                StatusEntry entry = new StatusEntry();
                entry.name = name;
                entry.pathOrUri = fileUri.toString();
                entry.isContentUri = true;
                entry.contentUri = fileUri;
                entry.isVideo = isVideoFileName(name);
                entry.isBusiness = isBusiness || (docId != null && (docId.contains("w4b") || docId.contains("Business")));
                entry.sizeBytes = size;
                entry.lastModified = lastMod;
                outList.add(entry);
            }
        } catch (Exception ignored) {
        } finally {
            if (cursor != null) {
                try { cursor.close(); } catch (Exception ignored) {}
            }
        }
    }

    @PluginMethod
    public void getStatuses(PluginCall call) {
        String appType = call.getString("appType", "all"); // "all", "whatsapp", "business"
        if (!"all".equals(appType)) {
            lastRequestedAppType = appType;
        }

        List<StatusEntry> entries = new ArrayList<>();

        // 1. Escanear mediante SAF (Storage Access Framework - Oficial de Google Play para Android 11+)
        try {
            List<UriPermission> perms = getContext().getContentResolver().getPersistedUriPermissions();
            if (perms != null) {
                List<String> targetSafFolders = new ArrayList<>();
                if ("all".equals(appType) || "whatsapp".equals(appType)) {
                    targetSafFolders.add("primary:Android/media/com.whatsapp/WhatsApp/Media/.Statuses");
                    targetSafFolders.add("primary:WhatsApp/Media/.Statuses");
                }
                if ("all".equals(appType) || "business".equals(appType)) {
                    targetSafFolders.add("primary:Android/media/com.whatsapp.w4b/WhatsApp Business/Media/.Statuses");
                    targetSafFolders.add("primary:WhatsApp Business/Media/.Statuses");
                }

                for (UriPermission perm : perms) {
                    if (!perm.isReadPermission()) continue;
                    Uri treeUri = perm.getUri();
                    String treeDocId;
                    try {
                        treeDocId = DocumentsContract.getTreeDocumentId(treeUri);
                    } catch (Exception e) {
                        continue;
                    }
                    if (treeDocId == null || !treeCoversAppType(treeDocId, appType)) continue;

                    boolean scannedAnySubfolder = false;
                    for (String candidateFolderDocId : targetSafFolders) {
                        if (candidateFolderDocId.equals(treeDocId)
                                || candidateFolderDocId.startsWith(treeDocId + "/")
                                || "primary:".equals(treeDocId)) {
                            boolean isBiz = candidateFolderDocId.contains("w4b") || candidateFolderDocId.contains("Business");
                            scanSafTreeForStatuses(treeUri, candidateFolderDocId, isBiz, entries);
                            scannedAnySubfolder = true;
                        }
                    }

                    if (!scannedAnySubfolder) {
                        boolean isBiz = treeDocId.contains("w4b") || treeDocId.contains("Business");
                        scanSafTreeForStatuses(treeUri, treeDocId, isBiz, entries);
                        if (!treeDocId.endsWith("/.Statuses")) {
                            scanSafTreeForStatuses(treeUri, treeDocId + "/.Statuses", isBiz, entries);
                        }
                    }
                }
            }
        } catch (Exception ignored) {}

        // 2. Escanear directorios estándar por File (Android 10 o inferior / fallback)
        for (File dir : getLegacyDirectoriesToScan(appType)) {
            try {
                if (dir.exists() && dir.isDirectory()) {
                    File[] files = dir.listFiles();
                    if (files != null) {
                        for (File f : files) {
                            if (f.isFile() && f.length() > 0 && isSupportedStatusMediaName(f.getName())) {
                                boolean alreadyAdded = false;
                                for (StatusEntry existing : entries) {
                                    if (existing.name.equals(f.getName()) && existing.sizeBytes == f.length()) {
                                        alreadyAdded = true;
                                        break;
                                    }
                                }
                                if (!alreadyAdded) {
                                    StatusEntry entry = new StatusEntry();
                                    entry.name = f.getName();
                                    entry.pathOrUri = f.getAbsolutePath();
                                    entry.isContentUri = false;
                                    entry.contentUri = null;
                                    entry.isVideo = isVideoFileName(f.getName());
                                    entry.isBusiness = f.getAbsolutePath().contains("w4b") || f.getAbsolutePath().contains("Business");
                                    entry.sizeBytes = f.length();
                                    entry.lastModified = f.lastModified();
                                    entries.add(entry);
                                }
                            }
                        }
                    }
                }
            } catch (Exception ignored) {}
        }

        // Ordenar del más reciente al más antiguo
        Collections.sort(entries, new Comparator<StatusEntry>() {
            @Override
            public int compare(StatusEntry e1, StatusEntry e2) {
                return Long.compare(e2.lastModified, e1.lastModified);
            }
        });

        SimpleDateFormat dateFormat = new SimpleDateFormat("dd MMM, HH:mm", Locale.getDefault());
        JSArray statusArray = new JSArray();

        for (StatusEntry entry : entries) {
            try {
                JSObject item = new JSObject();
                item.put("id", "wa-" + entry.name);
                item.put("name", entry.name);
                item.put("path", entry.pathOrUri);
                item.put("type", entry.isVideo ? "video" : "image");
                item.put("app", entry.isBusiness ? "business" : "whatsapp");
                item.put("sizeBytes", entry.sizeBytes);
                item.put("sizeFormatted", formatFileSize(entry.sizeBytes));
                item.put("date", dateFormat.format(new Date(entry.lastModified)));

                String cacheKey = entry.name + "_" + entry.sizeBytes + "_" + entry.lastModified;
                String thumbnailBase64 = thumbnailCache.get(cacheKey);
                if (thumbnailBase64 == null) {
                    try {
                        if (entry.isContentUri && entry.contentUri != null) {
                            thumbnailBase64 = entry.isVideo
                                    ? getVideoThumbnailBase64FromUri(entry.contentUri)
                                    : getImageThumbnailBase64FromUri(entry.contentUri);
                        } else {
                            thumbnailBase64 = entry.isVideo
                                    ? getVideoThumbnailBase64(entry.pathOrUri)
                                    : getImageThumbnailBase64(entry.pathOrUri);
                        }
                        if (thumbnailBase64 != null) {
                            thumbnailCache.put(cacheKey, thumbnailBase64);
                        }
                    } catch (Exception ignored) {}
                }

                item.put("thumbnail", thumbnailBase64);
                statusArray.put(item);
            } catch (Exception ignored) {}
        }

        JSObject res = new JSObject();
        res.put("statuses", statusArray);
        res.put("count", statusArray.length());
        call.resolve(res);
    }

    private String getDisplayNameFromContentUri(Uri uri) {
        Cursor cursor = null;
        try {
            cursor = getContext().getContentResolver().query(
                    uri,
                    new String[] { OpenableColumns.DISPLAY_NAME },
                    null,
                    null,
                    null
            );
            if (cursor != null && cursor.moveToFirst()) {
                String name = cursor.getString(0);
                if (name != null && !name.isEmpty()) return name;
            }
        } catch (Exception ignored) {
        } finally {
            if (cursor != null) {
                try { cursor.close(); } catch (Exception ignored) {}
            }
        }
        String lastSeg = uri.getLastPathSegment();
        if (lastSeg != null) {
            int slash = lastSeg.lastIndexOf('/');
            if (slash >= 0 && slash + 1 < lastSeg.length()) {
                return lastSeg.substring(slash + 1);
            }
            return lastSeg;
        }
        return "status_" + System.currentTimeMillis() + ".mp4";
    }

    private File copyContentUriToCache(Uri uri) {
        try {
            String displayName = getDisplayNameFromContentUri(uri)
                    .replaceAll("[\\\\/:*?\"<>|\\r\\n]+", "_")
                    .trim();
            if (displayName.isEmpty()) {
                displayName = "status_" + System.currentTimeMillis() + ".mp4";
            }
            File cacheSubDir = new File(getContext().getCacheDir(), "wa_status_cache");
            if (!cacheSubDir.exists()) {
                cacheSubDir.mkdirs();
            }
            File destFile = new File(cacheSubDir, displayName);
            try (InputStream in = getContext().getContentResolver().openInputStream(uri);
                 OutputStream out = new FileOutputStream(destFile)) {
                if (in == null) return null;
                byte[] buf = new byte[32768];
                int len;
                while ((len = in.read(buf)) > 0) {
                    out.write(buf, 0, len);
                }
            }
            return destFile.exists() && destFile.length() > 0 ? destFile : null;
        } catch (Exception e) {
            return null;
        }
    }

    private File resolveFile(String filePath) {
        if (filePath == null || filePath.isEmpty()) return null;
        try {
            if (filePath.startsWith("content://")) {
                File cached = copyContentUriToCache(Uri.parse(filePath));
                if (cached != null && cached.exists()) return cached;
            }
            if (filePath.startsWith("file://")) {
                filePath = Uri.parse(filePath).getPath();
            }
            filePath = java.net.URLDecoder.decode(filePath, "UTF-8");
            File file = new File(filePath);
            if (file.exists()) return file;

            // Revisar en el directorio interno de la aplicación
            File inFiles = new File(getContext().getFilesDir(), filePath);
            if (inFiles.exists()) return inFiles;

            // Revisar en Download público
            File inDownload = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS), filePath);
            if (inDownload.exists()) return inDownload;

            // Revisar en Movies público
            File inMovies = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_MOVIES), filePath);
            if (inMovies.exists()) return inMovies;

            return file;
        } catch (Exception e) {
            return new File(filePath);
        }
    }

    public Uri saveFileToMediaStore(File sourceFile, String displayName, boolean isAudio) {
        if (sourceFile == null || !sourceFile.exists()) return null;

        try {
            String safeDisplayName = (displayName == null || displayName.isEmpty()
                    ? "media_" + System.currentTimeMillis()
                    : displayName).replaceAll("[\\\\/:*?\"<>|\\r\\n]+", "_").trim();
            if (safeDisplayName.isEmpty()) {
                safeDisplayName = "media_" + System.currentTimeMillis();
            }

            boolean hasM4aHeader = false;
            if (isAudio) {
                try (InputStream headIn = new FileInputStream(sourceFile)) {
                    byte[] header = new byte[12];
                    int n = headIn.read(header);
                    if (n >= 8) {
                        String box = new String(header, 4, 4, StandardCharsets.US_ASCII);
                        if ("ftyp".equals(box)) {
                            hasM4aHeader = true;
                        }
                    }
                } catch (Exception ignored) {}
            }

            if (isAudio && hasM4aHeader && safeDisplayName.toLowerCase().endsWith(".mp3")) {
                safeDisplayName = safeDisplayName.substring(0, safeDisplayName.length() - 4) + ".m4a";
            }

            String lower = safeDisplayName.toLowerCase();
            boolean isVideo = !isAudio && (lower.endsWith(".mp4") || lower.endsWith(".3gp") || lower.endsWith(".mov") || lower.endsWith(".mkv"));

            String mimeType = "video/mp4";
            Uri collection;
            String relativeSubDir;

            if (isVideo) {
                mimeType = "video/mp4";
                collection = MediaStore.Video.Media.EXTERNAL_CONTENT_URI;
                relativeSubDir = Environment.DIRECTORY_MOVIES + "/FTY Downloader Pro";
            } else if (isAudio) {
                mimeType = (lower.endsWith(".m4a") || hasM4aHeader) ? "audio/mp4" : "audio/mpeg";
                collection = MediaStore.Audio.Media.EXTERNAL_CONTENT_URI;
                relativeSubDir = Environment.DIRECTORY_MUSIC + "/FTY Downloader Pro";
            } else if (lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".png") || lower.endsWith(".webp")) {
                mimeType = "image/jpeg";
                collection = MediaStore.Images.Media.EXTERNAL_CONTENT_URI;
                relativeSubDir = Environment.DIRECTORY_PICTURES + "/FTY Downloader Pro";
            } else {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    collection = MediaStore.Downloads.EXTERNAL_CONTENT_URI;
                } else {
                    collection = MediaStore.Files.getContentUri("external");
                }
                relativeSubDir = Environment.DIRECTORY_DOWNLOADS + "/FTY Downloader Pro";
            }

            ContentValues values = new ContentValues();
            String finalDisplayName = safeDisplayName.startsWith("FTY_") ? safeDisplayName : ("FTY_" + safeDisplayName);
            values.put(MediaStore.MediaColumns.DISPLAY_NAME, finalDisplayName);
            values.put(MediaStore.MediaColumns.MIME_TYPE, mimeType);

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                values.put(MediaStore.MediaColumns.RELATIVE_PATH, relativeSubDir);
                values.put(MediaStore.MediaColumns.IS_PENDING, 1);
            }

            Uri itemUri = getContext().getContentResolver().insert(collection, values);
            if (itemUri == null && Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                values.put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS + "/FTY Downloader Pro");
                itemUri = getContext().getContentResolver().insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values);
            }
            if (itemUri == null) return null;

            try (InputStream in = new FileInputStream(sourceFile);
                 OutputStream out = getContext().getContentResolver().openOutputStream(itemUri)) {
                byte[] buffer = new byte[32768];
                int bytesRead;
                while ((bytesRead = in.read(buffer)) > 0) {
                    out.write(buffer, 0, bytesRead);
                }
            }

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                values.clear();
                values.put(MediaStore.MediaColumns.IS_PENDING, 0);
                getContext().getContentResolver().update(itemUri, values, null, null);
            } else {
                MediaScannerConnection.scanFile(getContext(), new String[]{sourceFile.getAbsolutePath()}, new String[]{mimeType}, null);
            }

            return itemUri;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @PluginMethod
    public void saveToGallery(PluginCall call) {
        String filePath = call.getString("filePath");
        if (filePath == null || filePath.isEmpty()) {
            call.reject("filePath es requerido");
            return;
        }

        File sourceFile = resolveFile(filePath);
        if (sourceFile == null || !sourceFile.exists()) {
            call.reject("El archivo original no existe: " + filePath);
            return;
        }

        try {
            boolean isAudio = sourceFile.getName().toLowerCase().endsWith(".mp3") || sourceFile.getName().toLowerCase().endsWith(".m4a");
            Uri itemUri = saveFileToMediaStore(sourceFile, sourceFile.getName(), isAudio);
            if (itemUri == null) {
                call.reject("No se pudo guardar en almacenamiento público");
                return;
            }

            JSObject ret = new JSObject();
            ret.put("success", true);
            ret.put("uri", itemUri.toString());
            ret.put("fileName", "FTY_" + sourceFile.getName());
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Error al guardar en galería/música: " + e.getMessage());
        }
    }

    @PluginMethod
    public void openWhatsApp(PluginCall call) {
        String target = call.getString("target", "whatsapp"); // "whatsapp" o "business"
        String packageName = "business".equals(target) ? "com.whatsapp.w4b" : "com.whatsapp";

        try {
            PackageManager pm = getContext().getPackageManager();
            Intent intent = pm.getLaunchIntentForPackage(packageName);
            if (intent != null) {
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                getContext().startActivity(intent);
                JSObject ret = new JSObject();
                ret.put("success", true);
                ret.put("package", packageName);
                call.resolve(ret);
                return;
            }
        } catch (Exception ignored) {
        }

        // Si la app específica no se encontró, abrir WhatsApp genérico o navegador
        try {
            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse("whatsapp://app"));
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(intent);
            JSObject ret = new JSObject();
            ret.put("success", true);
            call.resolve(ret);
        } catch (Exception ex) {
            call.reject("WhatsApp no está instalado");
        }
    }

    @PluginMethod
    public void openMedia(PluginCall call) {
        String filePath = call.getString("filePath");
        if (filePath == null || filePath.isEmpty()) {
            call.reject("filePath es requerido");
            return;
        }

        try {
            if (filePath.startsWith("content://")) {
                Uri contentUri = Uri.parse(filePath);
                String mimeType = getContext().getContentResolver().getType(contentUri);
                if (mimeType == null) {
                    mimeType = "video/*";
                }
                Intent intent = new Intent(Intent.ACTION_VIEW);
                intent.setDataAndType(contentUri, mimeType);
                intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
                Intent chooser = Intent.createChooser(intent, "Reproducir con");
                chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                getContext().startActivity(chooser);

                JSObject ret = new JSObject();
                ret.put("success", true);
                call.resolve(ret);
                return;
            }

            File file = resolveFile(filePath);
            if (file == null || !file.exists()) {
                call.reject("El archivo no existe: " + filePath);
                return;
            }

            String name = file.getName().toLowerCase();
            boolean isVideo = name.endsWith(".mp4") || name.endsWith(".3gp") || name.endsWith(".mov") || name.endsWith(".mkv");
            boolean isAudio = name.endsWith(".mp3") || name.endsWith(".m4a") || name.endsWith(".wav") || name.endsWith(".aac");
            boolean isImage = name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".png") || name.endsWith(".webp");

            String mimeType = isVideo ? "video/*" : (isAudio ? "audio/*" : (isImage ? "image/*" : "*/*"));

            Uri contentUri;
            try {
                contentUri = FileProvider.getUriForFile(
                    getContext(),
                    getContext().getPackageName() + ".fileprovider",
                    file
                );
            } catch (Exception ex) {
                contentUri = Uri.fromFile(file);
            }

            Intent intent = new Intent(Intent.ACTION_VIEW);
            intent.setDataAndType(contentUri, mimeType);
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
            Intent chooser = Intent.createChooser(intent, "Reproducir con");
            chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(chooser);

            JSObject ret = new JSObject();
            ret.put("success", true);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Error al abrir medio: " + e.getMessage());
        }
    }

    @PluginMethod
    public void shareFile(PluginCall call) {
        String filePath = call.getString("filePath");
        String title = call.getString("title", "Compartir con");

        if (filePath == null || filePath.isEmpty()) {
            call.reject("filePath es requerido");
            return;
        }

        try {
            if (filePath.startsWith("content://")) {
                Uri contentUri = Uri.parse(filePath);
                String mimeType = getContext().getContentResolver().getType(contentUri);
                if (mimeType == null) {
                    mimeType = "video/*";
                }
                Intent shareIntent = new Intent(Intent.ACTION_SEND);
                shareIntent.setType(mimeType);
                shareIntent.putExtra(Intent.EXTRA_STREAM, contentUri);
                shareIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);

                Intent chooser = Intent.createChooser(shareIntent, title);
                chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                getContext().startActivity(chooser);

                JSObject ret = new JSObject();
                ret.put("success", true);
                call.resolve(ret);
                return;
            }

            File file = resolveFile(filePath);
            if (file == null || !file.exists()) {
                call.reject("El archivo no existe en el almacenamiento: " + filePath);
                return;
            }

            String name = file.getName().toLowerCase();
            boolean isVideo = name.endsWith(".mp4") || name.endsWith(".3gp") || name.endsWith(".mov") || name.endsWith(".mkv");
            boolean isAudio = name.endsWith(".mp3") || name.endsWith(".m4a") || name.endsWith(".wav") || name.endsWith(".aac");
            boolean isImage = name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".png") || name.endsWith(".webp");

            String mimeType = isVideo ? "video/*" : (isAudio ? "audio/*" : (isImage ? "image/*" : "*/*"));

            Uri contentUri = FileProvider.getUriForFile(
                getContext(),
                getContext().getPackageName() + ".fileprovider",
                file
            );

            Intent shareIntent = new Intent(Intent.ACTION_SEND);
            shareIntent.setType(mimeType);
            shareIntent.putExtra(Intent.EXTRA_STREAM, contentUri);
            shareIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);

            Intent chooser = Intent.createChooser(shareIntent, title);
            chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(chooser);

            JSObject ret = new JSObject();
            ret.put("success", true);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Error al compartir archivo: " + e.getMessage());
        }
    }

    @PluginMethod
    public void getClipboard(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            try {
                ClipboardManager clipboard = (ClipboardManager) getContext().getSystemService(Context.CLIPBOARD_SERVICE);
                if (clipboard != null && clipboard.hasPrimaryClip() && clipboard.getPrimaryClip().getItemCount() > 0) {
                    CharSequence text = clipboard.getPrimaryClip().getItemAt(0).getText();
                    JSObject ret = new JSObject();
                    ret.put("text", text != null ? text.toString() : "");
                    call.resolve(ret);
                } else {
                    JSObject ret = new JSObject();
                    ret.put("text", "");
                    call.resolve(ret);
                }
            } catch (Exception e) {
                JSObject ret = new JSObject();
                ret.put("text", "");
                call.resolve(ret);
            }
        });
    }

    private String getImageThumbnailBase64FromUri(Uri uri) {
        try {
            BitmapFactory.Options bounds = new BitmapFactory.Options();
            bounds.inJustDecodeBounds = true;
            try (InputStream is1 = getContext().getContentResolver().openInputStream(uri)) {
                if (is1 == null) return null;
                BitmapFactory.decodeStream(is1, null, bounds);
            }

            int width = bounds.outWidth;
            int height = bounds.outHeight;
            int sampleSize = 1;
            int reqWidth = 320;
            int reqHeight = 480;

            if (height > reqHeight || width > reqWidth) {
                final int halfHeight = height / 2;
                final int halfWidth = width / 2;
                while ((halfHeight / sampleSize) >= reqHeight && (halfWidth / sampleSize) >= reqWidth) {
                    sampleSize *= 2;
                }
            }

            BitmapFactory.Options opts = new BitmapFactory.Options();
            opts.inSampleSize = sampleSize;
            Bitmap bitmap;
            try (InputStream is2 = getContext().getContentResolver().openInputStream(uri)) {
                if (is2 == null) return null;
                bitmap = BitmapFactory.decodeStream(is2, null, opts);
            }

            if (bitmap != null) {
                ByteArrayOutputStream stream = new ByteArrayOutputStream();
                bitmap.compress(Bitmap.CompressFormat.JPEG, 75, stream);
                byte[] byteArray = stream.toByteArray();
                bitmap.recycle();
                return "data:image/jpeg;base64," + Base64.encodeToString(byteArray, Base64.NO_WRAP);
            }
        } catch (Exception ignored) {
        }
        return null;
    }

    private String getVideoThumbnailBase64FromUri(Uri uri) {
        MediaMetadataRetriever retriever = new MediaMetadataRetriever();
        try {
            retriever.setDataSource(getContext(), uri);
            Bitmap frame = retriever.getFrameAtTime(1000000, MediaMetadataRetriever.OPTION_CLOSEST_SYNC);
            if (frame == null) {
                frame = retriever.getFrameAtTime();
            }

            if (frame != null) {
                int maxDim = 360;
                int w = frame.getWidth();
                int h = frame.getHeight();
                if (w > maxDim || h > maxDim) {
                    float ratio = Math.min((float) maxDim / w, (float) maxDim / h);
                    int nw = Math.round(w * ratio);
                    int nh = Math.round(h * ratio);
                    frame = Bitmap.createScaledBitmap(frame, nw, nh, true);
                }

                ByteArrayOutputStream stream = new ByteArrayOutputStream();
                frame.compress(Bitmap.CompressFormat.JPEG, 70, stream);
                byte[] byteArray = stream.toByteArray();
                frame.recycle();
                return "data:image/jpeg;base64," + Base64.encodeToString(byteArray, Base64.NO_WRAP);
            }
        } catch (Exception ignored) {
        } finally {
            try {
                retriever.release();
            } catch (Exception ignored) {}
        }
        return null;
    }

    private String getImageThumbnailBase64(String path) {
        try {
            BitmapFactory.Options bounds = new BitmapFactory.Options();
            bounds.inJustDecodeBounds = true;
            BitmapFactory.decodeFile(path, bounds);

            int width = bounds.outWidth;
            int height = bounds.outHeight;
            int sampleSize = 1;

            int reqWidth = 320;
            int reqHeight = 480;

            if (height > reqHeight || width > reqWidth) {
                final int halfHeight = height / 2;
                final int halfWidth = width / 2;
                while ((halfHeight / sampleSize) >= reqHeight && (halfWidth / sampleSize) >= reqWidth) {
                    sampleSize *= 2;
                }
            }

            BitmapFactory.Options opts = new BitmapFactory.Options();
            opts.inSampleSize = sampleSize;
            Bitmap bitmap = BitmapFactory.decodeFile(path, opts);

            if (bitmap != null) {
                ByteArrayOutputStream stream = new ByteArrayOutputStream();
                bitmap.compress(Bitmap.CompressFormat.JPEG, 75, stream);
                byte[] byteArray = stream.toByteArray();
                bitmap.recycle();
                return "data:image/jpeg;base64," + Base64.encodeToString(byteArray, Base64.NO_WRAP);
            }
        } catch (Exception ignored) {
        }
        return null;
    }

    private String getVideoThumbnailBase64(String path) {
        MediaMetadataRetriever retriever = new MediaMetadataRetriever();
        try {
            retriever.setDataSource(path);
            Bitmap frame = retriever.getFrameAtTime(1000000, MediaMetadataRetriever.OPTION_CLOSEST_SYNC);
            if (frame == null) {
                frame = retriever.getFrameAtTime();
            }

            if (frame != null) {
                // Escalar a un tamaño óptimo para thumbnail
                int maxDim = 360;
                int w = frame.getWidth();
                int h = frame.getHeight();
                if (w > maxDim || h > maxDim) {
                    float ratio = Math.min((float) maxDim / w, (float) maxDim / h);
                    int nw = Math.round(w * ratio);
                    int nh = Math.round(h * ratio);
                    frame = Bitmap.createScaledBitmap(frame, nw, nh, true);
                }

                ByteArrayOutputStream stream = new ByteArrayOutputStream();
                frame.compress(Bitmap.CompressFormat.JPEG, 70, stream);
                byte[] byteArray = stream.toByteArray();
                frame.recycle();
                return "data:image/jpeg;base64," + Base64.encodeToString(byteArray, Base64.NO_WRAP);
            }
        } catch (Exception ignored) {
        } finally {
            try {
                retriever.release();
            } catch (Exception ignored) {}
        }
        return null;
    }

    protected String formatFileSize(long bytes) {
        if (bytes < 1024) return bytes + " B";
        int exp = (int) (Math.log(bytes) / Math.log(1024));
        String pre = "KMGTPE".charAt(exp - 1) + "";
        return String.format(Locale.US, "%.1f %sB", bytes / Math.pow(1024, exp), pre);
    }


    @PluginMethod
    public void getDistributionChannel(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("channel", BuildConfig.DISTRIBUTION_CHANNEL);
        ret.put("extendedMediaAllowed", BuildConfig.EXTENDED_MEDIA);
        call.resolve(ret);
    }
}
