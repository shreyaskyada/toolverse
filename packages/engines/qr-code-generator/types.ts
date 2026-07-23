export type QrTabType = 'url' | 'text' | 'vcard';

export interface VCardDetails {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  website: string;
  company: string;
}

export interface QrGeneratorOptions {
  size: number;
  margin: number;
  fgColor: string;
  bgColor: string;
}
