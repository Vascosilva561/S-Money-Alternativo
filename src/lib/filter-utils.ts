export function hasActiveFilterValues(...values: unknown[]): boolean {
  return values.some((value) => value !== undefined && value !== null && String(value).trim().length > 0)
}
