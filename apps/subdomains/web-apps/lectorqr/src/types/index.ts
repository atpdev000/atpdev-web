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

// =================== PARÁMETROS AVANZADOS QR.IO / API ===================

export type QRPattern = 
  | 'default'
  | 'circle'
  | 'star'
  | 'diamond'
  | 'sparkle'
  | 'danger'
  | 'cross'
  | 'plus'
  | 'x'
  | 'heart'
  | 'shake'
  | 'blob'
  | 'special-circle'
  | 'special-diamond'
  | 'ribbon'
  | 'ellipse';

export type QRMarkerOut = 
  | 'default'
  | 'flurry'
  | 'sdoz'
  | 'drop_in'
  | 'drop'
  | 'dropeye'
  | 'dropeyeleft'
  | 'dropeyeright'
  | 'squarecircle'
  | 'circle'
  | 'rounded'
  | 'flower'
  | 'leaf';

export type QRMarkerIn = 
  | 'default'
  | 'flurry'
  | 'sdoz'
  | 'drop'
  | 'circle'
  | 'rounded'
  | 'sun'
  | 'star'
  | 'diamond'
  | 'danger'
  | 'cross'
  | 'plus'
  | 'x'
  | 'heart';

export type QROptionLogo = 
  | 'none'
  | 'upload'
  | 'tiktok'
  | 'whatsapp'
  | 'instagram'
  | 'facebook'
  | 'youtube'
  | 'twitter'
  | 'linkedin'
  | 'spotify'
  | 'telegram'
  | 'pinterest'
  | 'discord'
  | 'twitch'
  | 'paypal'
  | 'btc'
  | 'wifi'
  | 'email'
  | 'link'
  | 'location'
  | 'vcard'
  | 'pdf'
  | 'appstore'
  | 'googleplay';

export type QROuterFrame = 
  | 'none'
  | 'bottom'
  | 'top'
  | 'balloon-bottom'
  | 'balloon-top'
  | 'ribbon-bottom'
  | 'ribbon-top'
  | 'phone'
  | 'cine';

export type QRLabelFont = 
  | 'Arial, Helvetica, sans-serif'
  | "'Times New Roman', Times, serif"
  | "'Courier New', Courier, monospace";

export interface QRDesignConfig {
  // Parámetros Principales
  data?: string;
  title?: string;
  folderid?: number;

  // Parámetros de Color y Forma
  transparent: boolean;       // 'on' | 'off'
  backcolor: string;          // default #FFFFFF
  frontcolor: string;         // default #000000
  gradient: boolean;          // 'on' | 'off'
  radial: boolean;            // 'on' | 'off'
  gradient_color: string;     // color 2
  marker_out_color: string;   // outside corners
  marker_in_color: string;    // inside corners
  pattern: QRPattern;         // estilo de puntos
  marker: QRMarkerOut;        // estilo marco de ojos
  marker_in: QRMarkerIn;      // estilo pupila de ojos

  // Logotipo
  optionlogo: QROptionLogo;
  customLogoUrl?: string;
  no_logo_bg: boolean;        // 'on' | 'off'
  logoSize?: number;

  // Marco
  outer_frame: QROuterFrame;
  framelabel: string;         // default "SCAN ME"
  label_font: QRLabelFont;
  custom_frame_color: boolean;// 'on' | 'off'
  framecolor: string;         // default #000000
  frame_text_color?: string;  // default #ffffff

  // Calidad
  errorCorrection: 'L' | 'M' | 'Q' | 'H';
  margin: number;
}
