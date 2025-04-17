export function classnames(...args: (string | null | undefined)[]): string {
  return args.filter(Boolean).join(' ');
}
