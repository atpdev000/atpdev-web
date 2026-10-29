import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ftydownloader.pro',
  appName: 'FTY Downloader Pro',
  webDir: 'out',
  server: {
    url: 'https://www.ftydownloader.com',
    androidScheme: 'https',
    cleartext: true
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
