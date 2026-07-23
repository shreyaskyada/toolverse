import QRCode from 'qrcode';
import { QrGeneratorOptions, VCardDetails, QrTabType } from './types';

export function getFormattedQrText(
  activeTab: QrTabType,
  url: string,
  text: string,
  vCard: VCardDetails
): string {
  switch (activeTab) {
    case 'url':
      return url || 'https://example.com';
    case 'text':
      return text || 'Hello World';
    case 'vcard':
      const parts = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${vCard.lastName};${vCard.firstName};;;`,
        `FN:${vCard.firstName} ${vCard.lastName}`,
        vCard.company ? `ORG:${vCard.company}` : '',
        vCard.phone ? `TEL;TYPE=WORK,VOICE:${vCard.phone}` : '',
        vCard.email ? `EMAIL:${vCard.email}` : '',
        vCard.website ? `URL:${vCard.website}` : '',
        'END:VCARD',
      ];
      return parts.filter(Boolean).join('\n');
    default:
      return '';
  }
}

export async function generateQrDataUrl(
  text: string,
  options: QrGeneratorOptions
): Promise<string> {
  return QRCode.toDataURL(text, {
    width: options.size,
    margin: options.margin,
    color: {
      dark: options.fgColor,
      light: options.bgColor,
    },
    errorCorrectionLevel: 'M',
  });
}
