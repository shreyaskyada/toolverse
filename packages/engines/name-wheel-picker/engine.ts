export function parseNames(input: string): string[] {
  return input
    .split(/\r?\n/)
    .map((name) => name.trim())
    .filter((name) => name.length > 0);
}

export function easeOutQuart(x: number): number {
  return 1 - Math.pow(1 - x, 4);
}

export function getPointerIndex(rotation: number, count: number): number {
  const finalRotation = rotation % (2 * Math.PI);
  const arc = (2 * Math.PI) / count;

  let pointerAngle = (2 * Math.PI - (finalRotation % (2 * Math.PI))) % (2 * Math.PI);
  if (pointerAngle < 0) {
    pointerAngle += 2 * Math.PI;
  }

  return Math.floor(pointerAngle / arc);
}
