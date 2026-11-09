import { ScannedCode, CodeType } from '../types';

/**
 * Analiza una cadena escaneada y clasifica su tipo semántico con datos estructurados.
 */
export function parseScannedContent(raw: string, format = 'QR_CODE'): ScannedCode {
  const text = raw.trim();
  const id = 'scan_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const timestamp = Date.now();

  // 1. Detección de Wi-Fi: WIFI:S:MySSID;T:WPA;P:MyPass;;
  if (text.startsWith('WIFI:') || text.startsWith('wifi:')) {
    const ssidMatch = text.match(/S:([^;]+)/i);
    const passMatch = text.match(/P:([^;]+)/i);
    const typeMatch = text.match(/T:([^;]+)/i);
    const hiddenMatch = text.match(/H:([^;]+)/i);

    const ssid = ssidMatch ? ssidMatch[1] : 'Red Wi-Fi';
    const password = passMatch ? passMatch[1] : undefined;
    const rawAuth = typeMatch ? typeMatch[1].toUpperCase() : 'WPA';
    let authType: 'WPA' | 'WEP' | 'nopass' = 'WPA';
    if (rawAuth === 'WEP') authType = 'WEP';
    else if (rawAuth === 'NOPASS') authType = 'nopass';

    return {
      id,
      rawText: text,
      format,
      type: 'wifi',
      timestamp,
      isFavorite: false,
      parsedData: {
        wifi: {
          ssid,
          password,
          authType,
          isHidden: hiddenMatch ? hiddenMatch[1].toLowerCase() === 'true' : false,
        },
      },
    };
  }

  // 2. Detección de Contacto vCard: BEGIN:VCARD
  if (text.includes('BEGIN:VCARD') || text.includes('begin:vcard')) {
    const fnMatch = text.match(/FN:([^\r\n]+)/i) || text.match(/N:([^\r\n]+)/i);
    const telMatch = text.match(/TEL(?:;[^:]+)?:([^\r\n]+)/i);
    const emailMatch = text.match(/EMAIL(?:;[^:]+)?:([^\r\n]+)/i);
    const orgMatch = text.match(/ORG:([^\r\n]+)/i);
    const noteMatch = text.match(/NOTE:([^\r\n]+)/i);

    return {
      id,
      rawText: text,
      format,
      type: 'contact',
      timestamp,
      isFavorite: false,
      parsedData: {
        contact: {
          name: fnMatch ? fnMatch[1].trim() : 'Contacto',
          phone: telMatch ? telMatch[1].trim() : undefined,
          email: emailMatch ? emailMatch[1].trim() : undefined,
          org: orgMatch ? orgMatch[1].trim() : undefined,
          note: noteMatch ? noteMatch[1].trim() : undefined,
        },
      },
    };
  }

  // 3. Detección de WhatsApp: https://wa.me/ o api.whatsapp.com
  if (text.includes('wa.me/') || text.includes('api.whatsapp.com/send')) {
    const phoneMatch = text.match(/wa\.me\/([0-9+]+)/i) || text.match(/phone=([0-9+]+)/i);
    const textMatch = text.match(/[?&]text=([^&]+)/i);

    return {
      id,
      rawText: text,
      format,
      type: 'whatsapp',
      timestamp,
      isFavorite: false,
      parsedData: {
        whatsapp: {
          phone: phoneMatch ? phoneMatch[1] : '',
          message: textMatch ? decodeURIComponent(textMatch[1]) : undefined,
        },
      },
    };
  }

  // 4. Detección de Email: mailto:
  if (text.startsWith('mailto:') || text.startsWith('MAILTO:')) {
    const emailStr = text.replace(/mailto:/i, '');
    const [address, query] = emailStr.split('?');
    const subjectMatch = query ? query.match(/subject=([^&]+)/i) : null;
    const bodyMatch = query ? query.match(/body=([^&]+)/i) : null;

    return {
      id,
      rawText: text,
      format,
      type: 'email',
      timestamp,
      isFavorite: false,
      parsedData: {
        email: {
          address: address.trim(),
          subject: subjectMatch ? decodeURIComponent(subjectMatch[1]) : undefined,
          body: bodyMatch ? decodeURIComponent(bodyMatch[1]) : undefined,
        },
      },
    };
  }

  // 5. Detección de Teléfono: tel:
  if (text.startsWith('tel:') || text.startsWith('TEL:')) {
    const phone = text.replace(/tel:/i, '').trim();
    return {
      id,
      rawText: text,
      format,
      type: 'phone',
      timestamp,
      isFavorite: false,
      parsedData: { phone },
    };
  }

  // 6. Detección de SMS: SMSTO: o sms:
  if (text.startsWith('SMSTO:') || text.startsWith('smsto:') || text.startsWith('sms:')) {
    const cleaned = text.replace(/^(smsto:|sms:)/i, '');
    const parts = cleaned.split(':');
    const phone = parts[0];
    const message = parts.slice(1).join(':');

    return {
      id,
      rawText: text,
      format,
      type: 'sms',
      timestamp,
      isFavorite: false,
      parsedData: { sms: { phone, message } },
    };
  }

  // 7. Detección de Coordenadas Geográficas: geo:lat,lng
  if (text.startsWith('geo:') || text.startsWith('GEO:')) {
    const coords = text.replace(/geo:/i, '').split(',');
    const lat = parseFloat(coords[0]);
    const lng = parseFloat(coords[1]);
    if (!isNaN(lat) && !isNaN(lng)) {
      return {
        id,
        rawText: text,
        format,
        type: 'geo',
        timestamp,
        isFavorite: false,
        parsedData: { geo: { latitude: lat, longitude: lng } },
      };
    }
  }

  // 8. Detección de URL Web: http:// o https://
  if (text.startsWith('http://') || text.startsWith('https://') || text.match(/^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/.*)?$/)) {
    const fullUrl = text.startsWith('http') ? text : 'https://' + text;
    return {
      id,
      rawText: text,
      format,
      type: 'url',
      timestamp,
      isFavorite: false,
      parsedData: { url: fullUrl },
    };
  }

  // 9. Texto Genérico
  return {
    id,
    rawText: text,
    format,
    type: 'text',
    timestamp,
    isFavorite: false,
    parsedData: { text },
  };
}

/**
 * Formateadores de cadenas para el Generador QR
 */
export function buildWifiString(ssid: string, pass = '', auth = 'WPA', hidden = false): string {
  return `WIFI:T:${auth};S:${ssid};P:${pass};H:${hidden ? 'true' : 'false'};;`;
}

export function buildVCardString(name: string, phone = '', email = '', org = '', note = ''): string {
  let vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\n`;
  if (org) vcard += `ORG:${org}\n`;
  if (phone) vcard += `TEL;TYPE=CELL:${phone}\n`;
  if (email) vcard += `EMAIL:${email}\n`;
  if (note) vcard += `NOTE:${note}\n`;
  vcard += 'END:VCARD';
  return vcard;
}

export function buildWhatsAppString(phone: string, message = ''): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  if (!message.trim()) return `https://wa.me/${cleanPhone}`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
