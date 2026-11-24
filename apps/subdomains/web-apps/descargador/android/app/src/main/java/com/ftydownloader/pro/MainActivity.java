package com.ftydownloader.pro;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.CapConfig;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import org.json.JSONObject;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(WhatsAppStatusPlugin.class);
        super.onCreate(savedInstanceState);
    }

    @Override
    protected void load() {
        // Tag every WebView/SSR/API request with FTYChannel/<playstore|direct> before initial URL load.
        try (InputStream is = getAssets().open("capacitor.config.json")) {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            byte[] buf = new byte[4096];
            int n;
            while ((n = is.read(buf)) != -1) {
                baos.write(buf, 0, n);
            }
            JSONObject json = new JSONObject(new String(baos.toByteArray(), StandardCharsets.UTF_8));
            JSONObject androidObj = json.optJSONObject("android");
            if (androidObj == null) {
                androidObj = new JSONObject();
            }
            String existingAppend = androidObj.optString("appendUserAgent", "").trim();
            String channelToken = "FTYChannel/" + BuildConfig.DISTRIBUTION_CHANNEL;
            androidObj.put("appendUserAgent", existingAppend.isEmpty() ? channelToken : existingAppend + " " + channelToken);
            json.put("android", androidObj);
            this.config = new CapConfig(getAssets(), json);
        } catch (Exception ignored) {
        }
        super.load();
    }
}
