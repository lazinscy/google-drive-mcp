import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { getFileMetadata } from '../functions/getFileMetadata.js'
import { GetFileMetadataResponse } from '../types.js'

export function registerGetFileMetadataTool(server: McpServer) {
  server.tool(
    'get-file-metadata',
    'Retrieves detailed metadata for a specific file including size, creation date, modification date, owners, and sharing status.',
    {
      fileId: z.string().describe('The ID of the file to get metadata for'),
    },
    async ({ fileId }) => {
      try {
        const response: GetFileMetadataResponse = await getFileMetadata(fileId)

        if (response?.success) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(response.metadata, null, 2),
              },
            ],
          }
        } else {
          return {
            content: [
              {
                type: 'text',
                text: response.message || 'Failed to retrieve file metadata.',
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
              text: `Error getting file metadata: ${error}`,
            },
          ],
          isError: true,
        }
      }
    }
  )
}
