import { TemplateType } from './engine';

export interface CertificateData {
  recipient: string;
  organization: string;
  achievement: string;
  date: string;
  issuer: string;
  template: TemplateType;
}
