const cToF = (c: number): number => (c * 9 / 5) + 32;
export const formatTemp = (tmp: number): [string, string] => [`${Math.round(tmp)}°C`, `${Math.round(cToF(tmp))}°F`];
