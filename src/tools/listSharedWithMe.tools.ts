import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { listSharedWithMe } from '../functions/listSharedWithMe.js'
import { ListFilesResponse } from '../types.js'

export function registerListSharedWithMeTool(server: McpServer) {
  server.tool(
    'list-shared-with-me',
    'Lists all files and folders that have been shared with you by other users.',
    {},
    async () => {
      try {
        const response: ListFilesResponse = await listSharedWithMe()

        if (response?.success) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(response.files, null, 2),
              },
            ],
          }
        } else {
          return {
            content: [
              {
                type: 'text',
                text: response.message || 'Failed to retrieve shared files.',
              },
            ],
            isError: true,
          }
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error listing shared files: ${error}`,
            },
          ],
          isError: true,
        }
      }
    }
  )
}
