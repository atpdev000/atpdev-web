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

@CapacitorPlugin(name = "WhatsAppStatus")
public class WhatsAppStatusPlugin extends WhatsAppStatusBasePlugin {
    private WebView ytPoWebView;
    private boolean ytPoWebViewLoaded = false;
    private String cachedBgHelperJs = null;
    private final List<Runnable> pendingPoEvals = new ArrayList<>();
    private final ConcurrentHashMap<String, PluginCall> pendingPoCalls = new ConcurrentHashMap<>();

    private void emitDownloadProgress(int percent, String details) {
        JSObject data = new JSObject();
        data.put("percent", Math.max(0, Math.min(100, percent)));
        data.put("details", details);
        notifyListeners("youtubeDownloadProgress", data);
    }

    @PluginMethod
    public void downloadAndCombineMedia(PluginCall call) {
        String videoUrl = call.getString("videoUrl");
        String audioUrl = call.getString("audioUrl");
        String filename = call.getString("filename", "video_" + System.currentTimeMillis() + ".mp4");
        String userAgent = call.getString("userAgent");
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
                    emitDownloadProgress(10, "Descargando audio en tu dispositivo...");
                    downloadHttpStream(audioUrl, tempAudio, userAgent, 10, 92, "Descargando audio");
                    fileToSave = tempAudio;
                } else if (videoUrl != null && !videoUrl.isEmpty()) {
                    boolean hasSeparateAudio = (audioUrl != null && !audioUrl.isEmpty());
                    emitDownloadProgress(10, "Descargando video en tu dispositivo...");
                    downloadHttpStream(videoUrl, tempVideo, userAgent, 10, hasSeparateAudio ? 68 : 92, "Descargando video");
                    fileToSave = tempVideo;

                    if (hasSeparateAudio) {
                        emitDownloadProgress(70, "Descargando pista de audio...");
                        downloadHttpStream(audioUrl, tempAudio, userAgent, 70, 88, "Descargando audio");
                        emitDownloadProgress(90, "Combinando video y audio HD...");
                        boolean muxSuccess = muxMediaTracks(tempVideo, tempAudio, tempCombined);
                        if (!muxSuccess || !tempCombined.exists() || tempCombined.length() <= 0) {
                            throw new Exception("No se pudo combinar el video y audio en el dispositivo (MediaMuxer)");
                        }
                        fileToSave = tempCombined;
                    }
                }

                if (fileToSave != null && fileToSave.exists() && fileToSave.length() > 0) {
                    emitDownloadProgress(96, "Guardando en tu dispositivo...");
                    Uri savedUri = saveFileToMediaStore(fileToSave, filename, isAudio);
                    if (savedUri != null) {
                        emitDownloadProgress(100, "¡Descarga completada!");
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
                android.util.Log.e("FTYCombiner", "downloadAndCombineMedia failed: " + e.getMessage(), e);
                call.reject("Error en descarga nativa: " + e.getMessage());
            } finally {
                try { tempVideo.delete(); } catch (Exception ignored) {}
                try { tempAudio.delete(); } catch (Exception ignored) {}
                try { tempCombined.delete(); } catch (Exception ignored) {}
            }
        }).start();
    }

    private String resolveStreamUserAgent(String fileUrl, String overrideUserAgent) {
        if (fileUrl != null) {
            if (fileUrl.contains("c=ANDROID_VR")) {
                return "com.google.android.apps.youtube.vr.oculus/1.56.21 (Linux; U; Android 12L; eureka-user Build/SQ3A.220605.009.A1) gzip";
            }
            if (fileUrl.contains("c=ANDROID")) {
                return "com.google.android.youtube/20.10.38 (Linux; U; Android 14) gzip";
            }
            if (fileUrl.contains("c=IOS")) {
                return "com.google.ios.youtube/19.29.1 (iPhone16,2; U; CPU iOS 17_5_1 like Mac OS X;)";
            }
        }
        if (overrideUserAgent != null && !overrideUserAgent.isEmpty()) {
            return overrideUserAgent;
        }
        try {
            return WebSettings.getDefaultUserAgent(getContext());
        } catch (Exception e) {
            return "Mozilla/5.0 (Linux; Android 13; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36";
        }
    }

    private long extractClenFromUrl(String fileUrl) {
        if (fileUrl == null) return -1L;
        Matcher m = Pattern.compile("[?&]clen=(\\d+)").matcher(fileUrl);
        if (m.find()) {
            try {
                return Long.parseLong(m.group(1));
            } catch (Exception ignored) {}
        }
        return -1L;
    }

    private long parseTotalFromContentRange(String contentRange) {
        if (contentRange == null) return -1L;
        int slash = contentRange.lastIndexOf('/');
        if (slash >= 0 && slash + 1 < contentRange.length()) {
            String totalStr = contentRange.substring(slash + 1).trim();
            if (!"*".equals(totalStr)) {
                try {
                    return Long.parseLong(totalStr);
                } catch (Exception ignored) {}
            }
        }
        return -1L;
    }

    private HttpURLConnection openStreamConnection(String fileUrl, String userAgent, String rangeHeader) throws Exception {
        String currentUrl = fileUrl;
        int redirects = 0;
        boolean sendYoutubeOrigin = fileUrl.contains("googlevideo.com") && !fileUrl.contains("c=ANDROID") && !fileUrl.contains("c=IOS");

        while (redirects < 6) {
            URL url = new URL(currentUrl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestProperty("User-Agent", userAgent);
            conn.setRequestProperty("Accept", "*/*");
            conn.setRequestProperty("Accept-Encoding", "identity");
            if (sendYoutubeOrigin) {
                conn.setRequestProperty("Origin", "https://www.youtube.com");
                conn.setRequestProperty("Referer", "https://www.youtube.com/");
            }
            if (rangeHeader != null && !rangeHeader.isEmpty()) {
                conn.setRequestProperty("Range", rangeHeader);
            }
            conn.setConnectTimeout(25000);
            conn.setReadTimeout(45000);
            conn.setInstanceFollowRedirects(false);
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
            return conn;
        }
        throw new Exception("Demasiados redireccionamientos al descargar stream");
    }

    private String extractQueryParam(String fileUrl, String paramName) {
        if (fileUrl == null || paramName == null) return "";
        Matcher m = Pattern.compile("[?&]" + Pattern.quote(paramName) + "=([^&]+)").matcher(fileUrl);
        return m.find() ? m.group(1) : "";
    }

    private void downloadHttpStream(String fileUrl, File destFile, String overrideUserAgent, double progressStart, double progressEnd, String label) throws Exception {
        String ua = resolveStreamUserAgent(fileUrl, overrideUserAgent);
        long expectedTotal = extractClenFromUrl(fileUrl);
        String streamClient = extractQueryParam(fileUrl, "c");
        boolean hasPot = !extractQueryParam(fileUrl, "pot").isEmpty();
        boolean useChunkedRange = fileUrl.contains("googlevideo.com") || expectedTotal > 0;
        final long chunkSize = 1048576L; // 1MB chunks avoid YouTube long-socket drops/throttling

        android.util.Log.i("FTYCombiner", "Starting stream (" + label + ") client=" + streamClient + " pot=" + hasPot + " expectedTotal=" + expectedTotal + " chunked=" + useChunkedRange);

        if (!useChunkedRange) {
            HttpURLConnection conn = openStreamConnection(fileUrl, ua, null);
            try {
                int code = conn.getResponseCode();
                if (code != 200 && code != 206) {
                    throw new Exception("HTTP " + code + " (" + label + ")");
                }
                long cl = conn.getContentLengthLong();
                long downloaded = 0;
                try (InputStream in = conn.getInputStream();
                     OutputStream out = new FileOutputStream(destFile)) {
                    byte[] buf = new byte[32768];
                    int read;
                    while ((read = in.read(buf)) != -1) {
                        out.write(buf, 0, read);
                        downloaded += read;
                        if (cl > 0) {
                            double frac = Math.min(1.0, (double) downloaded / cl);
                            emitDownloadProgress((int) Math.round(progressStart + frac * (progressEnd - progressStart)),
                                    label + " (" + formatFileSize(downloaded) + " / " + formatFileSize(cl) + ")");
                        }
                    }
                }
                if (downloaded <= 0) {
                    throw new Exception("Archivo vacío (0 bytes) en " + label);
                }
                return;
            } finally {
                conn.disconnect();
            }
        }

        long offset = 0;
        long totalKnown = expectedTotal;
        int chunkIndex = 0;
        long lastProgressEmit = 0;

        try (OutputStream out = new FileOutputStream(destFile)) {
            while (totalKnown <= 0 || offset < totalKnown) {
                long end = (totalKnown > 0) ? Math.min(offset + chunkSize - 1, totalKnown - 1) : (offset + chunkSize - 1);
                String rangeHeader = "bytes=" + offset + "-" + end;
                Exception lastErr = null;
                boolean chunkOk = false;

                for (int attempt = 1; attempt <= 3; attempt++) {
                    HttpURLConnection conn = null;
                    try {
                        conn = openStreamConnection(fileUrl, ua, rangeHeader);
                        int code = conn.getResponseCode();
                        if (code == 416 && offset > 0) {
                            chunkOk = true;
                            totalKnown = offset;
                            break;
                        }
                        if (code != 200 && code != 206) {
                            String meta = (streamClient.isEmpty() ? "" : " c=" + streamClient) + " pot=" + (hasPot ? "1" : "0");
                            throw new Exception("HTTP " + code + " en rango " + offset + "-" + end + (totalKnown > 0 ? "/" + totalKnown : "") + " [" + meta.trim() + "]");
                        }

                        if (code == 200) {
                            // Server ignored Range and returned the full payload from offset 0
                            long cl = conn.getContentLengthLong();
                            if (offset > 0) {
                                // Restart cleanly from offset 0 is unexpected mid-file; abort or skip
                                throw new Exception("Servidor devolvió HTTP 200 sin Content-Range en offset " + offset);
                            }
                            try (InputStream in = conn.getInputStream()) {
                                byte[] buf = new byte[32768];
                                int read;
                                while ((read = in.read(buf)) != -1) {
                                    out.write(buf, 0, read);
                                    offset += read;
                                    long nowMs = System.currentTimeMillis();
                                    if (cl > 0 && nowMs - lastProgressEmit > 350) {
                                        lastProgressEmit = nowMs;
                                        double frac = Math.min(1.0, (double) offset / cl);
                                        emitDownloadProgress((int) Math.round(progressStart + frac * (progressEnd - progressStart)),
                                                label + " (" + formatFileSize(offset) + " / " + formatFileSize(cl) + ")");
                                    }
                                }
                            }
                            totalKnown = offset;
                            chunkOk = true;
                            break;
                        }

                        long crTotal = parseTotalFromContentRange(conn.getHeaderField("Content-Range"));
                        if (crTotal > 0) {
                            totalKnown = crTotal;
                        }

                        ByteArrayOutputStream chunkBuf = new ByteArrayOutputStream((int) (end - offset + 1));
                        try (InputStream in = conn.getInputStream()) {
                            byte[] buf = new byte[32768];
                            int read;
                            while ((read = in.read(buf)) != -1) {
                                chunkBuf.write(buf, 0, read);
                            }
                        }

                        byte[] chunkBytes = chunkBuf.toByteArray();
                        if (chunkBytes.length == 0) {
                            if (offset > 0 && totalKnown <= 0) {
                                totalKnown = offset;
                                chunkOk = true;
                                break;
                            }
                            throw new Exception("Chunk vacío en offset " + offset);
                        }

                        out.write(chunkBytes);
                        offset += chunkBytes.length;
                        chunkIndex++;
                        chunkOk = true;

                        long nowMs = System.currentTimeMillis();
                        if (nowMs - lastProgressEmit > 300 || (totalKnown > 0 && offset >= totalKnown)) {
                            lastProgressEmit = nowMs;
                            double frac = (totalKnown > 0) ? Math.min(1.0, (double) offset / totalKnown) : Math.min(0.9, chunkIndex * 0.08);
                            String sizeInfo = totalKnown > 0
                                    ? (formatFileSize(offset) + " / " + formatFileSize(totalKnown))
                                    : formatFileSize(offset);
                            emitDownloadProgress((int) Math.round(progressStart + frac * (progressEnd - progressStart)),
                                    label + " (" + sizeInfo + ")");
                        }

                        // If server returned fewer bytes than requested when totalKnown was unknown, we reached EOF
                        if (totalKnown <= 0 && chunkBytes.length < chunkSize) {
                            totalKnown = offset;
                        }
                        break;
                    } catch (Exception e) {
                        lastErr = e;
                        android.util.Log.w("FTYCombiner", label + " chunk attempt " + attempt + " failed at " + offset + ": " + e.getMessage());
                        if (attempt < 3) {
                            try { Thread.sleep(350L * attempt); } catch (InterruptedException ignored) {}
                        }
                    } finally {
                        if (conn != null) conn.disconnect();
                    }
                }

                if (!chunkOk) {
                    throw (lastErr != null ? lastErr : new Exception("Error descargando chunk en offset " + offset));
                }
            }
        }

        if (offset <= 0 || (totalKnown > 0 && offset < totalKnown)) {
            try { destFile.delete(); } catch (Exception ignored) {}
            throw new Exception("Descarga incompleta (" + offset + "/" + totalKnown + " bytes) en " + label);
        }
        android.util.Log.i("FTYCombiner", label + " completed: " + offset + " bytes");
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
    public void extractYoutubeInfo(PluginCall call) {
        String videoId = call.getString("videoId");
        if (videoId == null || videoId.trim().isEmpty()) {
            call.reject("videoId es requerido");
            return;
        }
        final String cleanVideoId = videoId.trim();
        android.util.Log.i("FTYYoutube", "extractYoutubeInfo start videoId=" + cleanVideoId);

        new Thread(() -> {
            StringBuilder diagnostics = new StringBuilder();
            String visitorData = fetchYoutubeVisitorData(cleanVideoId);
            android.util.Log.i("FTYYoutube", "visitorData=" + (visitorData != null ? visitorData.substring(0, Math.min(20, visitorData.length())) + "..." : "NULL"));

            String[][] clientProfiles = new String[][] {
                {
                    "ANDROID",
                    "20.10.38",
                    "com.google.android.youtube/20.10.38 (Linux; U; Android 15) gzip",
                    "Google",
                    "Pixel 8",
                    "Android",
                    "15",
                    "35"
                },
                {
                    "IOS",
                    "20.10.4",
                    "com.google.ios.youtube/20.10.4 (iPhone16,2; U; CPU iOS 18_3_2 like Mac OS X;)",
                    "Apple",
                    "iPhone16,2",
                    "iPhone",
                    "18.3.2.22D82",
                    "0"
                },
                {
                    "ANDROID_VR",
                    "1.60.19",
                    "com.google.android.apps.youtube.vr.oculus/1.60.19 (Linux; U; Android 12L; eureka-user Build/SQ3A.220605.009.A1) gzip",
                    "Oculus",
                    "Quest 3",
                    "Android",
                    "12L",
                    "32"
                }
            };

            for (String[] profile : clientProfiles) {
                String clientName = profile[0];
                String clientVersion = profile[1];
                String userAgent = profile[2];
                String deviceMake = profile[3];
                String deviceModel = profile[4];
                String osName = profile[5];
                String osVersion = profile[6];
                int sdkVersion = Integer.parseInt(profile[7]);

                HttpURLConnection conn = null;
                try {
                    JSONObject clientObj = new JSONObject();
                    clientObj.put("clientName", clientName);
                    clientObj.put("clientVersion", clientVersion);
                    clientObj.put("deviceMake", deviceMake);
                    clientObj.put("deviceModel", deviceModel);
                    clientObj.put("osName", osName);
                    clientObj.put("osVersion", osVersion);
                    if (sdkVersion > 0) {
                        clientObj.put("androidSdkVersion", sdkVersion);
                    }
                    clientObj.put("hl", "es");
                    clientObj.put("gl", "US");
                    if (visitorData != null && !visitorData.isEmpty()) {
                        clientObj.put("visitorData", visitorData);
                    }

                    JSONObject contextObj = new JSONObject();
                    contextObj.put("client", clientObj);

                    JSONObject bodyObj = new JSONObject();
                    bodyObj.put("videoId", cleanVideoId);
                    bodyObj.put("context", contextObj);
                    bodyObj.put("contentCheckOk", true);
                    bodyObj.put("racyCheckOk", true);

                    URL url = new URL("https://www.youtube.com/youtubei/v1/player?prettyPrint=false");
                    conn = (HttpURLConnection) url.openConnection();
                    conn.setRequestMethod("POST");
                    conn.setConnectTimeout(12000);
                    conn.setReadTimeout(15000);
                    conn.setDoOutput(true);
                    conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
                    conn.setRequestProperty("User-Agent", userAgent);
                    if (visitorData != null && !visitorData.isEmpty()) {
                        conn.setRequestProperty("X-Goog-Visitor-Id", visitorData);
                    }

                    byte[] bytes = bodyObj.toString().getBytes(StandardCharsets.UTF_8);
                    try (OutputStream os = conn.getOutputStream()) {
                        os.write(bytes);
                        os.flush();
                    }

                    int code = conn.getResponseCode();
                    InputStream stream = code >= 200 && code < 300 ? conn.getInputStream() : conn.getErrorStream();
                    String responseText = readAllStream(stream);

                    if (code < 200 || code >= 300) {
                        android.util.Log.w("FTYYoutube", clientName + " HTTP " + code);
                        diagnostics.append(clientName).append(":HTTP ").append(code).append("; ");
                        continue;
                    }

                    JSONObject payload = new JSONObject(responseText);
                    JSONObject playability = payload.optJSONObject("playabilityStatus");
                    String status = playability != null ? playability.optString("status", "") : "";
                    if (!"OK".equals(status)) {
                        String reason = playability != null ? playability.optString("reason", "") : "";
                        android.util.Log.w("FTYYoutube", clientName + " status=" + status + " reason=" + reason);
                        diagnostics.append(clientName).append(":").append(status).append("(").append(reason).append("); ");
                        continue;
                    }

                    JSONObject streaming = payload.optJSONObject("streamingData");
                    int directUrls = countDirectFormatUrls(streaming != null ? streaming.optJSONArray("formats") : null)
                        + countDirectFormatUrls(streaming != null ? streaming.optJSONArray("adaptiveFormats") : null);
                    if (directUrls == 0) {
                        android.util.Log.w("FTYYoutube", clientName + " OK but 0 direct URLs");
                        diagnostics.append(clientName).append(":0_urls; ");
                        continue;
                    }

                    android.util.Log.i("FTYYoutube", clientName + " SUCCESS directUrls=" + directUrls);
                    JSObject ret = new JSObject();
                    ret.put("success", true);
                    ret.put("clientUsed", clientName);
                    ret.put("payloadJson", responseText);
                    call.resolve(ret);
                    return;
                } catch (Exception e) {
                    android.util.Log.e("FTYYoutube", clientName + " exception", e);
                    diagnostics.append(clientName).append(":ERR(").append(e.getMessage()).append("); ");
                } finally {
                    if (conn != null) {
                        conn.disconnect();
                    }
                }
            }

            android.util.Log.e("FTYYoutube", "ALL CLIENTS FAILED: " + diagnostics.toString());
            call.reject("Extracción nativa falló: " + diagnostics.toString());
        }).start();
    }

    private String fetchYoutubeVisitorData(String videoId) {
        HttpURLConnection conn = null;
        try {
            URL url = new URL("https://www.youtube.com/embed/" + videoId);
            conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setConnectTimeout(8000);
            conn.setReadTimeout(8000);
            conn.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36");
            if (conn.getResponseCode() == 200) {
                String html = readAllStream(conn.getInputStream());
                Matcher m = Pattern.compile("\"visitorData\":\"([^\"]+)\"").matcher(html);
                if (m.find()) {
                    return m.group(1);
                }
            }
        } catch (Exception ignored) {
        } finally {
            if (conn != null) {
                conn.disconnect();
            }
        }
        return null;
    }

    private int countDirectFormatUrls(JSONArray arr) {
        if (arr == null) return 0;
        int count = 0;
        for (int i = 0; i < arr.length(); i++) {
            JSONObject obj = arr.optJSONObject(i);
            if (obj != null) {
                String u = obj.optString("url", "");
                if (u.startsWith("http")) count++;
            }
        }
        return count;
    }

    @PluginMethod
    public void nativeFetch(PluginCall call) {
        String targetUrl = call.getString("url");
        if (targetUrl == null || targetUrl.isEmpty()) {
            call.reject("url es requerida");
            return;
        }
        String method = call.getString("method", "GET");
        JSObject reqHeaders = call.getObject("headers");
        String body = call.getString("body");

        new Thread(() -> {
            HttpURLConnection conn = null;
            try {
                String currentUrl = targetUrl;
                String currentMethod = (method != null ? method.toUpperCase(Locale.US) : "GET");
                int redirects = 0;

                while (redirects < 6) {
                    URL url = new URL(currentUrl);
                    conn = (HttpURLConnection) url.openConnection();
                    conn.setRequestMethod(currentMethod);
                    conn.setConnectTimeout(15000);
                    conn.setReadTimeout(25000);
                    conn.setInstanceFollowRedirects(false);

                    boolean hasUa = false;
                    if (reqHeaders != null) {
                        Iterator<String> keys = reqHeaders.keys();
                        while (keys.hasNext()) {
                            String k = keys.next();
                            String v = reqHeaders.getString(k);
                            if (v != null) {
                                if ("user-agent".equalsIgnoreCase(k)) hasUa = true;
                                conn.setRequestProperty(k, v);
                            }
                        }
                    }
                    if (!hasUa) {
                        try {
                            conn.setRequestProperty("User-Agent", WebSettings.getDefaultUserAgent(getContext()));
                        } catch (Exception ignored) {}
                    }

                    if (body != null && ("POST".equals(currentMethod) || "PUT".equals(currentMethod) || "PATCH".equals(currentMethod))) {
                        conn.setDoOutput(true);
                        byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
                        conn.setFixedLengthStreamingMode(bytes.length);
                        try (OutputStream os = conn.getOutputStream()) {
                            os.write(bytes);
                        }
                    }

                    int code = conn.getResponseCode();
                    if (code == HttpURLConnection.HTTP_MOVED_PERM || code == HttpURLConnection.HTTP_MOVED_TEMP || code == 307 || code == 308) {
                        String loc = conn.getHeaderField("Location");
                        conn.disconnect();
                        if (loc != null && !loc.isEmpty()) {
                            if (loc.startsWith("/")) {
                                loc = url.getProtocol() + "://" + url.getHost() + (url.getPort() > 0 ? ":" + url.getPort() : "") + loc;
                            }
                            currentUrl = loc;
                            if (code != 307 && code != 308) {
                                currentMethod = "GET";
                            }
                            redirects++;
                            continue;
                        }
                    }

                    InputStream is = code >= 400 ? conn.getErrorStream() : conn.getInputStream();
                    String respBody = readAllStream(is);

                    JSObject respHeaders = new JSObject();
                    Map<String, List<String>> headerFields = conn.getHeaderFields();
                    if (headerFields != null) {
                        for (Map.Entry<String, List<String>> entry : headerFields.entrySet()) {
                            if (entry.getKey() != null && entry.getValue() != null && !entry.getValue().isEmpty()) {
                                respHeaders.put(entry.getKey().toLowerCase(Locale.US), String.join(", ", entry.getValue()));
                            }
                        }
                    }

                    JSObject ret = new JSObject();
                    ret.put("status", code);
                    ret.put("url", currentUrl);
                    ret.put("headers", respHeaders);
                    ret.put("body", respBody);
                    call.resolve(ret);
                    return;
                }
                call.reject("Demasiados redireccionamientos en nativeFetch");
            } catch (Exception e) {
                android.util.Log.e("FTYYoutube", "nativeFetch failed: " + targetUrl, e);
                call.reject("nativeFetch error: " + e.getMessage());
            } finally {
                if (conn != null) {
                    conn.disconnect();
                }
            }
        }).start();
    }

    private class FTYPoBridge {
        @JavascriptInterface
        public void onPoSuccess(String callId, String jsonStr) {
            PluginCall pending = pendingPoCalls.remove(callId);
            if (pending == null) return;
            try {
                JSObject obj = new JSObject(jsonStr);
                android.util.Log.i("FTYYoutube", "mintYoutubePoToken OK callId=" + callId);
                pending.resolve(obj);
            } catch (Exception e) {
                android.util.Log.e("FTYYoutube", "mintYoutubePoToken parse error", e);
                pending.reject("Error parseando PO token: " + e.getMessage());
            }
        }

        @JavascriptInterface
        public void onPoError(String callId, String errMsg) {
            android.util.Log.e("FTYYoutube", "mintYoutubePoToken JS error: " + errMsg);
            PluginCall pending = pendingPoCalls.remove(callId);
            if (pending == null) return;
            pending.reject("Error generando PO token: " + errMsg);
        }
    }

    @PluginMethod
    public void mintYoutubePoToken(PluginCall call) {
        String visitorData = call.getString("visitorData", "");
        String videoId = call.getString("videoId", "");
        String helperUrl = call.getString("helperUrl", "https://descargador.atpdev.dev/vendor/yt-bg-helper.js");

        new Thread(() -> {
            try {
                if (cachedBgHelperJs == null || cachedBgHelperJs.isEmpty()) {
                    HttpURLConnection conn = (HttpURLConnection) new URL(helperUrl).openConnection();
                    conn.setRequestMethod("GET");
                    conn.setConnectTimeout(15000);
                    conn.setReadTimeout(20000);
                    int code = conn.getResponseCode();
                    if (code != 200) {
                        conn.disconnect();
                        call.reject("No se pudo descargar yt-bg-helper.js (HTTP " + code + ")");
                        return;
                    }
                    cachedBgHelperJs = readAllStream(conn.getInputStream());
                    conn.disconnect();
                }

                String helperJs = cachedBgHelperJs;
                String callId = UUID.randomUUID().toString();
                pendingPoCalls.put(callId, call);

                // Safety timeout (25s)
                new android.os.Handler(android.os.Looper.getMainLooper()).postDelayed(() -> {
                    PluginCall timedOut = pendingPoCalls.remove(callId);
                    if (timedOut != null) {
                        android.util.Log.e("FTYYoutube", "mintYoutubePoToken timeout callId=" + callId + " loaded=" + ytPoWebViewLoaded);
                        timedOut.reject("Timeout generando PO token en WebView");
                    }
                }, 25000);

                Runnable runEval = () -> {
                    if (ytPoWebView == null) {
                        PluginCall c = pendingPoCalls.remove(callId);
                        if (c != null) c.reject("poWebView no disponible");
                        return;
                    }
                    String invokeJs =
                            "(async function(){"
                                    + "try{"
                                    + "if(!window.__FTY_mintPoToken){" + helperJs + "}"
                                    + "const res=await window.__FTY_mintPoToken("
                                    + JSONObject.quote(visitorData) + "," + JSONObject.quote(videoId) + ");"
                                    + "window.FTYPoBridge.onPoSuccess(" + JSONObject.quote(callId) + ",JSON.stringify(res));"
                                    + "}catch(err){"
                                    + "window.FTYPoBridge.onPoError(" + JSONObject.quote(callId) + ",String(err&&err.stack||err&&err.message||err));"
                                    + "}"
                                    + "})();";
                    ytPoWebView.evaluateJavascript(invokeJs, null);
                };

                getActivity().runOnUiThread(() -> {
                    try {
                        if (ytPoWebView == null) {
                            ytPoWebView = new WebView(getContext());
                            WebSettings settings = ytPoWebView.getSettings();
                            settings.setJavaScriptEnabled(true);
                            settings.setDomStorageEnabled(true);
                            settings.setDatabaseEnabled(true);
                            try {
                                android.webkit.CookieManager.getInstance().setAcceptCookie(true);
                                android.webkit.CookieManager.getInstance().setAcceptThirdPartyCookies(ytPoWebView, true);
                            } catch (Exception ignored) {}
                            ytPoWebView.setAlpha(0f);
                            ytPoWebView.setTranslationX(-10000f);
                            ytPoWebView.addJavascriptInterface(new FTYPoBridge(), "FTYPoBridge");

                            ViewGroup root = getActivity().findViewById(android.R.id.content);
                            if (root != null) {
                                root.addView(ytPoWebView, new FrameLayout.LayoutParams(1, 1));
                            }

                            pendingPoEvals.add(runEval);
                            ytPoWebView.setWebViewClient(new WebViewClient() {
                                @Override
                                public void onPageFinished(WebView view, String url) {
                                    super.onPageFinished(view, url);
                                    if (!ytPoWebViewLoaded && url != null && url.contains("youtube.com")) {
                                        ytPoWebViewLoaded = true;
                                        android.util.Log.i("FTYYoutube", "poWebView ready url=" + url + " queued=" + pendingPoEvals.size());
                                        List<Runnable> toRun = new ArrayList<>(pendingPoEvals);
                                        pendingPoEvals.clear();
                                        for (Runnable r : toRun) {
                                            r.run();
                                        }
                                    }
                                }
                            });
                            ytPoWebView.loadUrl("https://www.youtube.com/robots.txt");
                        } else if (!ytPoWebViewLoaded) {
                            pendingPoEvals.add(runEval);
                        } else {
                            runEval.run();
                        }
                    } catch (Exception uiErr) {
                        PluginCall c = pendingPoCalls.remove(callId);
                        if (c != null) c.reject("Error UI thread poWebView: " + uiErr.getMessage());
                    }
                });
            } catch (Exception e) {
                android.util.Log.e("FTYYoutube", "mintYoutubePoToken error", e);
                call.reject("mintYoutubePoToken error: " + e.getMessage());
            }
        }).start();
    }

    private String readAllStream(InputStream is) throws Exception {
        if (is == null) return "";
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8))) {
            char[] buf = new char[8192];
            int len;
            while ((len = reader.read(buf)) != -1) {
                sb.append(buf, 0, len);
            }
        }
        return sb.toString();
    }
}
