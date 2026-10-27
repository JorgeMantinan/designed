export type ClassValue = string | false | null | undefined;

/** Tiny class-name joiner (clsx-style, no dependency). */
export function cx(...values: ClassValue[]): string {
  return values.filter((value): value is string => Boolean(value)).join(' ');
}
