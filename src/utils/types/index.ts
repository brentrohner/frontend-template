/**
 * Maps a type to the union of its property values.
 * Useful for typing object enums. You can also specify
 * a subset of T's keys to filter the resulting union
 * to just those properties' values.
 * @example
 * const chars = { a: 'A', b: 'B', c: 'C' } as const;
 * type AllValues = Values<typeof chars>; // 'A' | 'B' | 'C'
 * type SomeValues = Values<typeof chars, 'b' | 'c'>; // 'B' | 'C'
 */
export type Values<T, K extends keyof T = keyof T> = T[K];
