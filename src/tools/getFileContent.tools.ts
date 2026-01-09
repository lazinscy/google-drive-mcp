import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { getFileContent } from '../functions/getFileContent.js'

export function registerGetFileContentTool(server: McpServer) {
  server.tool(
    'get-file-content',
    'Retrieves the text content of a file. Supports Google Docs, Google Sheets (as CSV), docx, txt, html, and rtf files.',
    {
      fileId: z.string().describe('The ID of the file to get content from'),
    },
    async ({ fileId }) => {
      try {
        const response = await getFileContent(fileId)

        if (response?.success) {
          return {
            content: [
              {
                type: 'text',
                text: response.content || '',
              },
            ],
          }
        } else {
          return {
            content: [
              {
                type: 'text',
                text: response.message || 'Failed to retrieve file content.',
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
              text: `Error getting file content: ${error}`,
            },
          ],
          isError: true,
        }
      }
    }
  )
}
