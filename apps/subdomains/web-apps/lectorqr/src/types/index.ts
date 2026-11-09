export type CodeType = 
  | 'url' 
  | 'text'
  | 'email'
  | 'phone'
  | 'sms'
  | 'contact'
  | 'whatsapp'
  | 'wifi'
  | 'pdf'
  | 'app'
  | 'images'
  | 'video'
  | 'social'
  | 'event'
  | 'crypto'
  | 'geo';

export interface WifiData {
  ssid: string;
  password?: string;
  authType: 'WPA' | 'WEP' | 'nopass';
  isHidden?: boolean;
}

export interface ContactData {
  name: string;
  phone?: string;
  email?: string;
  org?: string;
  title?: string;
  website?: string;
  address?: string;
  note?: string;
}

export interface WhatsAppData {
  phone: string;
  message?: string;
}

export interface EmailData {
  address: string;
  subject?: string;
  body?: string;
}

export interface GeoData {
  latitude: number;
  longitude: number;
}

export interface EventData {
  title: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface SocialData {
  instagram?: string;
  tiktok?: string;
  facebook?: string;
  youtube?: string;
  twitter?: string;
  linkedin?: string;
}

export interface AppData {
  appName: string;
  iosUrl?: string;
  androidUrl?: string;
}

export interface ScannedCode {
  id: string;
  rawText: string;
  format: string;
  type: CodeType;
  timestamp: number;
  isFavorite: boolean;
  parsedData: {
    url?: string;
    wifi?: WifiData;
    contact?: ContactData;
    whatsapp?: WhatsAppData;
    email?: EmailData;
    phone?: string;
    sms?: { phone: string; message?: string };
    geo?: GeoData;
    event?: EventData;
    social?: SocialData;
    app?: AppData;
    text?: string;
  };
}

export type FrameStyle = 
  | 'none' 
  | 'bottom-banner' 
  | 'top-banner' 
  | 'rounded-card' 
  | 'speech-bubble' 
  | 'badge';

export type DotShape = 
  | 'squares' 
  | 'dots' 
  | 'rounded' 
  | 'diamond';

export type EyeFrameStyle = 
  | 'square' 
  | 'rounded' 
  | 'circle';

export type EyeBallStyle = 
  | 'square' 
  | 'circle' 
  | 'diamond';

export type PresetLogo = 
  | 'none' 
  | 'upload' 
  | 'whatsapp' 
  | 'instagram' 
  | 'facebook' 
  | 'tiktok' 
  | 'youtube' 
  | 'twitter' 
  | 'wifi' 
  | 'linkedin' 
  | 'pdf' 
  | 'appstore' 
  | 'googleplay';

export interface QRDesignConfig {
  // Marco (Frame)
  frameStyle: FrameStyle;
  frameText: string;
  frameColor: string;
  frameTextColor: string;

  // Forma (Shape & Dots)
  dotShape: DotShape;
  eyeFrame: EyeFrameStyle;
  eyeBall: EyeBallStyle;

  // Colores (Colors & Gradient)
  colorType: 'solid' | 'gradient';
  fgColor: string;
  gradientColor2: string;
  gradientDirection: 'horizontal' | 'vertical' | 'diagonal';
  bgColor: string;
  customEyeColor: boolean;
  eyeColor: string;

  // Logo
  logo: PresetLogo;
  customLogoUrl?: string;
  logoSize: number; // percentage (e.g. 20-30%)

  // Calidad
  errorCorrection: 'L' | 'M' | 'Q' | 'H';
  margin: number;
}
