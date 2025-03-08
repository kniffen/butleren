export const hexToRGB = (hex: string): [number, number, number] => {
  const bigint = parseInt(hex.slice(1), 16);

  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return [ r, g, b ];
};

const rgbToAnsi = (r: number, g: number, b: number) => {
  return `\x1b[38;2;${r};${g};${b}m`;
};

export const colors: Record<string, string> = {
  reset:    '\x1b[0m',
  yellow:   '\x1b[33m',
  Discord:  rgbToAnsi(...hexToRGB('#7289DA')), // Discord blue
  Database: rgbToAnsi(...hexToRGB('#FFFFC5')), // Light yellow
  Fun:      rgbToAnsi(...hexToRGB('#FFC0CB')), // Pink
};