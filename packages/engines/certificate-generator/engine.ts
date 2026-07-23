export type TemplateType = 'classic' | 'modern' | 'elegant';

export function drawClassic(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  displayTitle: string,
  recipient: string,
  achievement: string,
  organization: string,
  date: string,
  logoImage: HTMLImageElement | null
) {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  ctx.lineWidth = 15;
  ctx.strokeStyle = '#1a365d';
  ctx.strokeRect(30, 30, width - 60, height - 60);
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#e2e8f0';
  ctx.strokeRect(48, 48, width - 96, height - 96);

  // Logo
  if (logoImage) {
    const imgWidth = 100;
    const imgHeight = (logoImage.height / logoImage.width) * imgWidth;
    ctx.drawImage(logoImage, width / 2 - imgWidth / 2, 70, imgWidth, imgHeight);
  }

  ctx.textAlign = 'center';
  ctx.fillStyle = '#1a365d';
  ctx.font = 'bold 40px serif';
  ctx.fillText(displayTitle, width / 2, logoImage ? 220 : 160);

  ctx.fillStyle = '#64748b';
  ctx.font = '20px sans-serif';
  ctx.fillText('This certificate is proudly presented to', width / 2, logoImage ? 260 : 210);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'italic bold 56px serif';
  ctx.fillText(recipient || '[Recipient Name]', width / 2, logoImage ? 340 : 290);

  ctx.beginPath();
  ctx.moveTo(width / 2 - 250, logoImage ? 360 : 310);
  ctx.lineTo(width / 2 + 250, logoImage ? 360 : 310);
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = '#64748b';
  ctx.font = '20px sans-serif';
  ctx.fillText('For successfully completing the program/course:', width / 2, logoImage ? 400 : 360);

  ctx.fillStyle = '#1a365d';
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText(achievement || '[Achievement]', width / 2, logoImage ? 440 : 400);

  ctx.fillStyle = '#334155';
  ctx.font = 'bold 22px serif';
  ctx.fillText(organization || '[Organization]', width / 2, height - 80);

  ctx.font = '20px sans-serif';
  ctx.fillText(date, 250, 520);
  ctx.beginPath();
  ctx.moveTo(150, 535);
  ctx.lineTo(350, 535);
  ctx.moveTo(width - 350, 535);
  ctx.lineTo(width - 150, 535);
  ctx.stroke();

  ctx.font = '16px sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('Date', 250, 560);
  ctx.fillText('Signature', width - 250, 560);
}

export function drawModern(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  displayTitle: string,
  recipient: string,
  achievement: string,
  organization: string,
  date: string,
  logoImage: HTMLImageElement | null
) {
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#2563eb';
  ctx.fillRect(0, 0, 40, height);

  if (logoImage) {
    const imgWidth = 80;
    const imgHeight = (logoImage.height / logoImage.width) * imgWidth;
    ctx.drawImage(logoImage, 100, 60, imgWidth, imgHeight);
  } else {
    ctx.textAlign = 'left';
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(organization || '[Organization Name]', 100, 90);
  }

  ctx.textAlign = 'left';
  ctx.fillStyle = '#0f172a';
  ctx.font = '900 38px sans-serif';

  const words = displayTitle.split(' ');
  let line1 = words.slice(0, Math.ceil(words.length / 2)).join(' ');
  let line2 = words.slice(Math.ceil(words.length / 2)).join(' ');
  if (words.length <= 2) {
    line1 = words[0] || '';
    line2 = words[1] || '';
  }

  ctx.fillText(line1, 100, 180);
  ctx.fillStyle = '#2563eb';
  ctx.fillText(line2, 100, 225);

  ctx.fillStyle = '#64748b';
  ctx.font = '16px sans-serif';
  ctx.fillText('PROUDLY PRESENTED TO:', 100, 290);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 48px sans-serif';
  ctx.fillText(recipient || '[Recipient Name]', 100, 350);

  ctx.fillStyle = '#64748b';
  ctx.font = '16px sans-serif';
  ctx.fillText('FOR SUCCESSFUL COMPLETION OF', 100, 410);

  ctx.fillStyle = '#2563eb';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText(achievement || '[Achievement]', 100, 445);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#334155';
  ctx.font = '20px sans-serif';
  ctx.fillText(date, 200, 520);
  ctx.beginPath();
  ctx.moveTo(100, 535);
  ctx.lineTo(300, 535);
  ctx.moveTo(width - 350, 535);
  ctx.lineTo(width - 150, 535);
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.font = '14px sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('DATE', 200, 560);
  ctx.fillText('SIGNATURE', width - 250, 560);
}

export function drawElegant(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  displayTitle: string,
  recipient: string,
  achievement: string,
  organization: string,
  date: string,
  logoImage: HTMLImageElement | null
) {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  ctx.lineWidth = 4;
  ctx.strokeStyle = '#b45309';
  ctx.strokeRect(40, 40, width - 80, height - 80);
  ctx.lineWidth = 1;
  ctx.strokeRect(46, 46, width - 92, height - 92);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 22px serif';
  ctx.fillText(organization || '[Organization Name]', width / 2, 90);

  if (logoImage) {
    const imgWidth = 60;
    const imgHeight = (logoImage.height / logoImage.width) * imgWidth;
    ctx.drawImage(logoImage, width / 2 - imgWidth / 2, 110, imgWidth, imgHeight);
  }

  ctx.fillStyle = '#b45309';
  ctx.font = 'italic 44px serif';
  ctx.fillText(displayTitle, width / 2, logoImage ? 230 : 170);

  ctx.fillStyle = '#475569';
  ctx.font = 'italic 22px serif';
  ctx.fillText('is hereby granted to', width / 2, logoImage ? 270 : 220);

  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 54px serif';
  ctx.fillText(recipient || '[Recipient Name]', width / 2, logoImage ? 340 : 290);

  ctx.fillStyle = '#475569';
  ctx.font = 'italic 22px serif';
  ctx.fillText('to certify completion of', width / 2, logoImage ? 390 : 350);

  ctx.fillStyle = '#b45309';
  ctx.font = 'bold 26px serif';
  ctx.fillText(achievement || '[Achievement]', width / 2, logoImage ? 440 : 400);

  ctx.fillStyle = '#334155';
  ctx.font = '20px serif';
  ctx.fillText(date, 250, 520);
  ctx.beginPath();
  ctx.moveTo(150, 535);
  ctx.lineTo(350, 535);
  ctx.moveTo(width - 350, 535);
  ctx.lineTo(width - 150, 535);
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.font = 'italic 16px serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('Date', 250, 560);
  ctx.fillText('Authorized Signature', width - 250, 560);
}
