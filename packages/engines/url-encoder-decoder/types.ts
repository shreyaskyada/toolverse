export interface UrlEncoderDecoderState {
  input: string;
  output: string;
  mode: 'encode' | 'decode';
  copied: boolean;
}
