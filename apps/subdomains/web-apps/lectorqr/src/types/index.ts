export type CodeType = 
  | 'url' 
  | 'wifi' 
  | 'contact' 
  | 'whatsapp' 
  | 'email' 
  | 'phone' 
  | 'sms' 
  | 'geo' 
  | 'text';

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
    text?: string;
  };
}

export interface QRGeneratorOptions {
  type: CodeType;
  fgColor: string;
  bgColor: string;
  errorCorrection: 'L' | 'M' | 'Q' | 'H';
  centerIcon: 'none' | 'whatsapp' | 'wifi' | 'link' | 'email' | 'phone' | 'star';
  margin: number;
  width: number;
}
