/**
 * Turns a single digit into a double digit by prefixing a zero.
 */
export const dd = (n: number): string => 9 < n ? n+'' : `0${n}`;