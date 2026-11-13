import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ftydownloader.pro',
  appName: 'Descargador Pro',
  webDir: 'out',
  server: {
    url: 'https://descargador.atpdev.dev',
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
