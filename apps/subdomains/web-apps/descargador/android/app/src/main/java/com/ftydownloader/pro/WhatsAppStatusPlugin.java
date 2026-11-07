package com.ftydownloader.pro;

import android.Manifest;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.ContentValues;
import android.content.Intent;
import android.content.pm.PackageManager;
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
import android.provider.MediaStore;
import android.provider.Settings;
import android.util.Base64;
import androidx.core.content.ContextCompat;
import androidx.core.content.FileProvider;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.ByteBuffer;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Locale;

@CapacitorPlugin(name = "WhatsAppStatus")
public class WhatsAppStatusPlugin extends Plugin {

    @PluginMethod
    public void checkPermission(PluginCall call) {
        JSObject ret = new JSObject();
        boolean isAllFiles = Build.VERSION.SDK_INT >= Build.VERSION_CODES.R;
        boolean granted;

        if (isAllFiles) {
            granted = Environment.isExternalStorageManager();
        } else {
            int result = ContextCompat.checkSelfPermission(getContext(), Manifest.permission.READ_EXTERNAL_STORAGE);
            granted = (result == PackageManager.PERMISSION_GRANTED);
        }

        ret.put("granted", granted);
        ret.put("isAllFiles", isAllFiles);
        ret.put("sdkVersion", Build.VERSION.SDK_INT);
        call.resolve(ret);
    }

    @PluginMethod
    public void requestPermission(PluginCall call) {
        JSObject ret = new JSObject();

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            try {
                Intent intent = new Intent(Settings.ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION);
                intent.setData(Uri.parse("package:" + getContext().getPackageName()));
                getActivity().startActivity(intent);
                ret.put("openedSettings", true);
                ret.put("type", "all_files_package");
                call.resolve(ret);
            } catch (Exception e) {
                try {
                    Intent intent = new Intent(Settings.ACTION_MANAGE_ALL_FILES_ACCESS_PERMISSION);
                    getActivity().startActivity(intent);
                    ret.put("openedSettings", true);
                    ret.put("type", "all_files_general");
                    call.resolve(ret);
                } catch (Exception ex) {
                    call.reject("Error al abrir ajustes de almacenamiento: " + ex.getMessage());
                }
            }
        } else {
            // Android 10 o inferior
            Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
            intent.setData(Uri.parse("package:" + getContext().getPackageName()));
            getActivity().startActivity(intent);
            ret.put("openedSettings", true);
            ret.put("type", "app_details");
            call.resolve(ret);
        }
    }

    @PluginMethod
    public void getStatuses(PluginCall call) {
        String appType = call.getString("appType", "all"); // "all", "whatsapp", "business"
        JSArray statusArray = new JSArray();

        List<File> directoriesToScan = new ArrayList<>();
        File extStorage = Environment.getExternalStorageDirectory();

        // WhatsApp Normal
        if ("all".equals(appType) || "whatsapp".equals(appType)) {
            directoriesToScan.add(new File(extStorage, "Android/media/com.whatsapp/WhatsApp/Media/.Statuses"));
            directoriesToScan.add(new File(extStorage, "WhatsApp/Media/.Statuses"));
            directoriesToScan.add(new File("/storage/emulated/0/Android/media/com.whatsapp/WhatsApp/Media/.Statuses"));
            directoriesToScan.add(new File("/storage/emulated/0/WhatsApp/Media/.Statuses"));
            directoriesToScan.add(new File("/storage/emulated/999/Android/media/com.whatsapp/WhatsApp/Media/.Statuses"));
        }

        // WhatsApp Business
        if ("all".equals(appType) || "business".equals(appType)) {
            directoriesToScan.add(new File(extStorage, "Android/media/com.whatsapp.w4b/WhatsApp Business/Media/.Statuses"));
            directoriesToScan.add(new File(extStorage, "WhatsApp Business/Media/.Statuses"));
            directoriesToScan.add(new File("/storage/emulated/0/Android/media/com.whatsapp.w4b/WhatsApp Business/Media/.Statuses"));
            directoriesToScan.add(new File("/storage/emulated/0/WhatsApp Business/Media/.Statuses"));
            directoriesToScan.add(new File("/storage/emulated/999/Android/media/com.whatsapp.w4b/WhatsApp Business/Media/.Statuses"));
        }

        List<File> allFiles = new ArrayList<>();

        for (File dir : directoriesToScan) {
            try {
                if (dir.exists() && dir.isDirectory()) {
                    File[] files = dir.listFiles();
                    if (files != null) {
                        for (File f : files) {
                            if (f.isFile() && f.length() > 0) {
                                String name = f.getName().toLowerCase();
                                if (!name.startsWith(".") && !name.equals(".nomedia")) {
                                    if (name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".png") ||
                                        name.endsWith(".webp") || name.endsWith(".mp4") || name.endsWith(".3gp") ||
                                        name.endsWith(".mov") || name.endsWith(".mkv")) {
                                        // Evitar duplicados por ruta
                                        boolean alreadyAdded = false;
                                        for (File existing : allFiles) {
                                            if (existing.getName().equals(f.getName()) && existing.length() == f.length()) {
                                                alreadyAdded = true;
                                                break;
                                            }
                                        }
                                        if (!alreadyAdded) {
                                            allFiles.add(f);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            } catch (Exception ignored) {
            }
        }

        // Ordenar del más reciente al más antiguo
        Collections.sort(allFiles, new Comparator<File>() {
            @Override
            public int compare(File f1, File f2) {
                return Long.compare(f2.lastModified(), f1.lastModified());
            }
        });

        SimpleDateFormat dateFormat = new SimpleDateFormat("dd MMM, HH:mm", Locale.getDefault());

        for (File f : allFiles) {
            try {
                String name = f.getName();
                String lower = name.toLowerCase();
                boolean isVideo = lower.endsWith(".mp4") || lower.endsWith(".3gp") || lower.endsWith(".mov") || lower.endsWith(".mkv");
                boolean isBusiness = f.getAbsolutePath().contains("w4b") || f.getAbsolutePath().contains("Business");

                JSObject item = new JSObject();
                item.put("id", "wa-" + name);
                item.put("name", name);
                item.put("path", f.getAbsolutePath());
                item.put("type", isVideo ? "video" : "image");
                item.put("app", isBusiness ? "business" : "whatsapp");
                item.put("sizeBytes", f.length());
                item.put("sizeFormatted", formatFileSize(f.length()));
                item.put("date", dateFormat.format(new Date(f.lastModified())));

                // Generar Thumbnail en Base64 para visualización instantánea y fluida en WebView
                String thumbnailBase64 = null;
                try {
                    if (isVideo) {
                        thumbnailBase64 = getVideoThumbnailBase64(f.getAbsolutePath());
                    } else {
                        thumbnailBase64 = getImageThumbnailBase64(f.getAbsolutePath());
                    }
                } catch (Exception e) {
                    // Fallback
                }

                item.put("thumbnail", thumbnailBase64);
                statusArray.put(item);
            } catch (Exception ignored) {
            }
        }

        JSObject res = new JSObject();
        res.put("statuses", statusArray);
        res.put("count", statusArray.length());
        call.resolve(res);
    }

    private File resolveFile(String filePath) {
        if (filePath == null || filePath.isEmpty()) return null;
        try {
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
            String lower = displayName.toLowerCase();
            boolean isVideo = !isAudio && (lower.endsWith(".mp4") || lower.endsWith(".3gp") || lower.endsWith(".mov") || lower.endsWith(".mkv"));

            String mimeType = "video/mp4";
            Uri collection;
            String relativeSubDir;

            if (isVideo) {
                mimeType = "video/mp4";
                collection = MediaStore.Video.Media.EXTERNAL_CONTENT_URI;
                relativeSubDir = Environment.DIRECTORY_MOVIES + "/FTY Downloader Pro";
            } else if (isAudio) {
                mimeType = lower.endsWith(".m4a") ? "audio/mp4" : "audio/mpeg";
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
            String finalDisplayName = displayName.startsWith("FTY_") ? displayName : ("FTY_" + displayName);
            values.put(MediaStore.MediaColumns.DISPLAY_NAME, finalDisplayName);
            values.put(MediaStore.MediaColumns.MIME_TYPE, mimeType);

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                values.put(MediaStore.MediaColumns.RELATIVE_PATH, relativeSubDir);
                values.put(MediaStore.MediaColumns.IS_PENDING, 1);
            }

            Uri itemUri = getContext().getContentResolver().insert(collection, values);
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
    public void downloadAndCombineMedia(PluginCall call) {
        String videoUrl = call.getString("videoUrl");
        String audioUrl = call.getString("audioUrl");
        String filename = call.getString("filename", "video_" + System.currentTimeMillis() + ".mp4");
        boolean isAudio = Boolean.TRUE.equals(call.getBoolean("isAudio", false));

        if ((videoUrl == null || videoUrl.isEmpty()) && (audioUrl == null || audioUrl.isEmpty())) {
            call.reject("URL multimedia es requerida");
            return;
        }

        new Thread(() -> {
            File cacheDir = getContext().getCacheDir();
            long now = System.currentTimeMillis();
            File tempVideo = new File(cacheDir, "temp_v_" + now + ".mp4");
            File tempAudio = new File(cacheDir, "temp_a_" + now + ".m4a");
            File tempCombined = new File(cacheDir, "temp_c_" + now + ".mp4");

            try {
                File fileToSave = null;

                if (isAudio && audioUrl != null && !audioUrl.isEmpty()) {
                    downloadHttpStream(audioUrl, tempAudio);
                    fileToSave = tempAudio;
                } else if (videoUrl != null && !videoUrl.isEmpty()) {
                    downloadHttpStream(videoUrl, tempVideo);
                    fileToSave = tempVideo;

                    if (audioUrl != null && !audioUrl.isEmpty()) {
                        try {
                            downloadHttpStream(audioUrl, tempAudio);
                            boolean muxSuccess = muxMediaTracks(tempVideo, tempAudio, tempCombined);
                            if (muxSuccess && tempCombined.exists() && tempCombined.length() > 0) {
                                fileToSave = tempCombined;
                            }
                        } catch (Exception e) {
                            android.util.Log.w("FTYCombiner", "Audio mux falló, guardando solo video: " + e.getMessage());
                        }
                    }
                }

                if (fileToSave != null && fileToSave.exists() && fileToSave.length() > 0) {
                    Uri savedUri = saveFileToMediaStore(fileToSave, filename, isAudio);
                    if (savedUri != null) {
                        JSObject ret = new JSObject();
                        ret.put("success", true);
                        ret.put("uri", savedUri.toString());
                        ret.put("fileName", filename);
                        call.resolve(ret);
                    } else {
                        call.reject("No se pudo registrar el archivo en MediaStore");
                    }
                } else {
                    call.reject("El archivo descargado está vacío o no se pudo generar");
                }
            } catch (Exception e) {
                e.printStackTrace();
                call.reject("Error en descarga nativa: " + e.getMessage());
            } finally {
                try { tempVideo.delete(); } catch (Exception ignored) {}
                try { tempAudio.delete(); } catch (Exception ignored) {}
                try { tempCombined.delete(); } catch (Exception ignored) {}
            }
        }).start();
    }

    private void downloadHttpStream(String fileUrl, File destFile) throws Exception {
        String currentUrl = fileUrl;
        int redirects = 0;
        HttpURLConnection conn = null;

        while (redirects < 6) {
            URL url = new URL(currentUrl);
            conn = (HttpURLConnection) url.openConnection();
            conn.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36");
            conn.setRequestProperty("Accept", "*/*");
            conn.setRequestProperty("Range", "bytes=0-");
            conn.setConnectTimeout(30000);
            conn.setReadTimeout(120000);
            conn.setInstanceFollowRedirects(true);
            conn.connect();

            int code = conn.getResponseCode();
            if (code == HttpURLConnection.HTTP_MOVED_PERM || code == HttpURLConnection.HTTP_MOVED_TEMP || code == 307 || code == 308) {
                String newUrl = conn.getHeaderField("Location");
                conn.disconnect();
                if (newUrl != null && !newUrl.isEmpty()) {
                    currentUrl = newUrl;
                    redirects++;
                    continue;
                }
            }

            if (code != 200 && code != 206) {
                conn.disconnect();
                throw new Exception("HTTP " + code + " descargando stream multimedia");
            }

            break;
        }

        if (conn == null) {
            throw new Exception("No se pudo iniciar la conexión HTTP");
        }

        try (InputStream in = conn.getInputStream();
             OutputStream out = new FileOutputStream(destFile)) {
            byte[] buf = new byte[32768];
            int read;
            while ((read = in.read(buf)) != -1) {
                out.write(buf, 0, read);
            }
        } finally {
            conn.disconnect();
        }
    }

    private boolean muxMediaTracks(File videoFile, File audioFile, File outputFile) {
        MediaExtractor videoExtractor = null;
        MediaExtractor audioExtractor = null;
        MediaMuxer muxer = null;

        try {
            videoExtractor = new MediaExtractor();
            videoExtractor.setDataSource(videoFile.getAbsolutePath());

            audioExtractor = new MediaExtractor();
            audioExtractor.setDataSource(audioFile.getAbsolutePath());

            int videoTrack = -1;
            int audioTrack = -1;

            for (int i = 0; i < videoExtractor.getTrackCount(); i++) {
                MediaFormat format = videoExtractor.getTrackFormat(i);
                String mime = format.getString(MediaFormat.KEY_MIME);
                if (mime != null && mime.startsWith("video/")) {
                    videoTrack = i;
                    break;
                }
            }

            for (int i = 0; i < audioExtractor.getTrackCount(); i++) {
                MediaFormat format = audioExtractor.getTrackFormat(i);
                String mime = format.getString(MediaFormat.KEY_MIME);
                if (mime != null && mime.startsWith("audio/")) {
                    audioTrack = i;
                    break;
                }
            }

            if (videoTrack < 0) {
                return false;
            }

            muxer = new MediaMuxer(outputFile.getAbsolutePath(), MediaMuxer.OutputFormat.MUXER_OUTPUT_MPEG_4);

            videoExtractor.selectTrack(videoTrack);
            MediaFormat vFormat = videoExtractor.getTrackFormat(videoTrack);
            int muxerVideoTrack = muxer.addTrack(vFormat);

            int muxerAudioTrack = -1;
            if (audioTrack >= 0) {
                audioExtractor.selectTrack(audioTrack);
                MediaFormat aFormat = audioExtractor.getTrackFormat(audioTrack);
                muxerAudioTrack = muxer.addTrack(aFormat);
            }

            muxer.start();

            ByteBuffer buffer = ByteBuffer.allocate(1024 * 1024 * 2);
            MediaCodec.BufferInfo info = new MediaCodec.BufferInfo();

            // Interleave Video Track
            while (true) {
                int sampleSize = videoExtractor.readSampleData(buffer, 0);
                if (sampleSize < 0) break;
                info.offset = 0;
                info.size = sampleSize;
                info.presentationTimeUs = videoExtractor.getSampleTime();
                info.flags = videoExtractor.getSampleFlags();
                muxer.writeSampleData(muxerVideoTrack, buffer, info);
                videoExtractor.advance();
            }

            // Interleave Audio Track
            if (muxerAudioTrack >= 0) {
                while (true) {
                    int sampleSize = audioExtractor.readSampleData(buffer, 0);
                    if (sampleSize < 0) break;
                    info.offset = 0;
                    info.size = sampleSize;
                    info.presentationTimeUs = audioExtractor.getSampleTime();
                    info.flags = audioExtractor.getSampleFlags();
                    muxer.writeSampleData(muxerAudioTrack, buffer, info);
                    audioExtractor.advance();
                }
            }

            muxer.stop();
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        } finally {
            if (muxer != null) {
                try { muxer.release(); } catch (Exception ignored) {}
            }
            if (videoExtractor != null) {
                try { videoExtractor.release(); } catch (Exception ignored) {}
            }
            if (audioExtractor != null) {
                try { audioExtractor.release(); } catch (Exception ignored) {}
            }
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

    private String formatFileSize(long bytes) {
        if (bytes < 1024) return bytes + " B";
        int exp = (int) (Math.log(bytes) / Math.log(1024));
        String pre = "KMGTPE".charAt(exp - 1) + "";
        return String.format(Locale.US, "%.1f %sB", bytes / Math.pow(1024, exp), pre);
    }
}
