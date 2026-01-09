import * as dotenv from 'dotenv'

function getArgValue(args: string[], name: string): string | undefined {
  const idx = args.indexOf(name)
  if (idx === -1) return undefined
  const value = args[idx + 1]
  if (!value || value.startsWith('--')) return undefined
  return value
}

function hasArg(args: string[], name: string): boolean {
  return args.includes(name)
}

function applyCliConfig(args: string[]) {
  const clientId = getArgValue(args, '--client-id')
  const clientSecret = getArgValue(args, '--client-secret')
  const redirectUri = getArgValue(args, '--redirect-uri')
  const tokenPath = getArgValue(args, '--token-path')

  if (clientId) process.env.CLIENT_ID = clientId
  if (clientSecret) process.env.CLIENT_SECRET = clientSecret
  if (redirectUri) process.env.REDIRECT_URI = redirectUri
  if (tokenPath) process.env.GOOGLE_DRIVE_TOKEN_PATH = tokenPath
}

function printHelp() {
  const lines = [
    'Usage: node build/index.js [options]',
    '',
    'Options:',
    '  --client-id <VALUE>                 Provide Client ID directly (not recommended)',
    '  --client-secret <VALUE>             Provide Client Secret directly (not recommended)',
    '  --redirect-uri <VALUE>              Provide Redirect URI directly',
    '  --token-path <VALUE>                Provide token path directly',
  ]
  console.error(lines.join('\n'))
}

async function bootstrap() {
  dotenv.config()

  const args = process.argv.slice(2)
  if (hasArg(args, '--help') || hasArg(args, '-h')) {
    printHelp()
    process.exit(0)
  }

  applyCliConfig(args)

  const { main } = await import('./main.js')
  await main()
}

bootstrap().catch((err) => {
  console.error('MCP Server failed to start:', err)
  process.exit(1)
})
