import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { registerResources } from './resources/index.js'
import { registerAllTools } from './tools/index.js'

export async function main() {
  const server = new McpServer({
    name: 'Google Drive',
    version: '1.0.0',
  })

  registerResources(server)
  registerAllTools(server)

  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('Google Drive MCP Server running on stdio')
}
