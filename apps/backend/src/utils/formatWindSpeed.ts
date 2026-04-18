const msToMPH = (ms: number): number => ms * 2.23694;
export const formatWindSpeed = (ms: number): [string, string] => [`${ms.toFixed(1)}m/s`, `${msToMPH(ms).toFixed(1)}mph`];