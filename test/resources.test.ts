import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

test('registerResources registers expected resource templates', async () => {
  const tokenPath = path.resolve('test/.tmp-token.json')
  fs.writeFileSync(tokenPath, JSON.stringify({}, null, 2))

  const previousClientId = process.env.CLIENT_ID
  const previousClientSecret = process.env.CLIENT_SECRET
  const previousTokenPath = process.env.GOOGLE_DRIVE_TOKEN_PATH

  const server = new McpServer({ name: 'test', version: '0.0.0' })
  try {
    process.env.CLIENT_ID = 'test-client-id'
    process.env.CLIENT_SECRET = 'test-client-secret'
    process.env.GOOGLE_DRIVE_TOKEN_PATH = tokenPath

    const { registerResources } = await import('../src/resources/index.js')
    registerResources(server)
  } finally {
    if (typeof previousClientId === 'undefined') delete process.env.CLIENT_ID
    else process.env.CLIENT_ID = previousClientId

    if (typeof previousClientSecret === 'undefined')
      delete process.env.CLIENT_SECRET
    else process.env.CLIENT_SECRET = previousClientSecret

    if (typeof previousTokenPath === 'undefined')
      delete process.env.GOOGLE_DRIVE_TOKEN_PATH
    else process.env.GOOGLE_DRIVE_TOKEN_PATH = previousTokenPath

    fs.rmSync(tokenPath, { force: true })
  }

  const templates: Record<string, any> = (server as any)._registeredResourceTemplates
  assert.ok(templates)

  const uriTemplates = Object.values(templates).map((t: any) =>
    t.resourceTemplate.uriTemplate.toString()
  )

  assert.deepEqual(uriTemplates.sort(), [
    'gdrive://file/{fileId}/content',
    'gdrive://file/{fileId}/metadata',
    'gdrive://folder/{folderId}/files',
  ])
})
