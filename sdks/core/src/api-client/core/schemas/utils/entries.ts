// export function entries<T>(object: T): [keyof T, T[keyof T]][] {
//     return Object.entries(object) as [keyof T, T[keyof T]][];
// }

export function entries<T extends { [key: string]: unknown }>(
  object: T,
): [keyof T, T[keyof T]][] {
  return Object.entries(object) as [keyof T, T[keyof T]][];
}
