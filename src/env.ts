export function getEnvString(
  primaryKey: string
): string | undefined {
  const directValue = process.env[primaryKey]
  return directValue && directValue.length > 0 ? directValue : undefined
}

export function requireEnvString(
  primaryKey: string
): string {
  const value = getEnvString(primaryKey)
  if (value) return value

  throw new Error(`Missing environment variable ${primaryKey}.`)
}
