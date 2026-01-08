import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { getFileRevisions } from '../functions/getFileRevisions.js'
import { GetFileRevisionsResponse } from '../types.js'

export function registerGetFileRevisionsTool(server: McpServer) {
  server.tool(
    'get-file-revisions',
    'Retrieves the revision history of a specific file, showing all versions with modification times and who made each change.',
    {
      fileId: z.string().describe('The ID of the file to get revision history for'),
    },
    async ({ fileId }) => {
      try {
        const response: GetFileRevisionsResponse = await getFileRevisions(fileId)

        if (response?.success) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(response.revisions, null, 2),
              },
            ],
          }
        } else {
          return {
            content: [
              {
                type: 'text',
                text: response.message || 'Failed to retrieve file revisions.',
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
              text: `Error getting file revisions: ${error}`,
            },
          ],
          isError: true,
        }
      }
    }
  )
}
