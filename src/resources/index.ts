import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js'
import { getFileContent } from '../functions/getFileContent.js'
import { getFileMetadata } from '../functions/getFileMetadata.js'
import { listFilesInFolder } from '../functions/listFilesInFolder.js'

function normalizeId(value: string | string[] | null | undefined): string {
  if (Array.isArray(value)) return value[0] ?? ''
  return value ?? ''
}

export function registerResources(server: McpServer) {
  server.resource(
    'gdrive-file-metadata',
    new ResourceTemplate('gdrive://file/{fileId}/metadata', { list: undefined }),
    {
      title: 'Google Drive file metadata',
      description: 'Metadata for a Google Drive file by fileId.',
    },
    async (_uri, variables) => {
      const fileId = normalizeId(variables.fileId)
      const response = await getFileMetadata(fileId)
      if (!response.success) {
        return {
          contents: [
            {
              uri: `gdrive://file/${fileId}/metadata`,
              mimeType: 'text/plain',
              text: response.message ?? 'Failed to retrieve file metadata.',
            },
          ],
        }
      }

      return {
        contents: [
          {
            uri: `gdrive://file/${fileId}/metadata`,
            mimeType: 'application/json',
            text: JSON.stringify(response.metadata ?? null, null, 2),
          },
        ],
      }
    }
  )

  server.resource(
    'gdrive-file-content',
    new ResourceTemplate('gdrive://file/{fileId}/content', { list: undefined }),
    {
      title: 'Google Drive file content',
      description:
        'Text content for a Google Drive file by fileId (Google Docs/Sheets supported via export).',
    },
    async (_uri, variables) => {
      const fileId = normalizeId(variables.fileId)
      const response = await getFileContent(fileId)

      if (!response.success) {
        return {
          contents: [
            {
              uri: `gdrive://file/${fileId}/content`,
              mimeType: 'text/plain',
              text: response.message ?? 'Failed to retrieve file content.',
            },
          ],
        }
      }

      return {
        contents: [
          {
            uri: `gdrive://file/${fileId}/content`,
            mimeType: 'text/plain',
            text: response.content ?? '',
          },
        ],
      }
    }
  )

  server.resource(
    'gdrive-folder-files',
    new ResourceTemplate('gdrive://folder/{folderId}/files', { list: undefined }),
    {
      title: 'Google Drive folder files',
      description: 'Lists files in a Google Drive folder by folderId.',
    },
    async (_uri, variables) => {
      const folderId = normalizeId(variables.folderId)
      const response = await listFilesInFolder(folderId)

      if (!response.success) {
        return {
          contents: [
            {
              uri: `gdrive://folder/${folderId}/files`,
              mimeType: 'text/plain',
              text: response.message ?? 'Failed to list files in folder.',
            },
          ],
        }
      }

      return {
        contents: [
          {
            uri: `gdrive://folder/${folderId}/files`,
            mimeType: 'application/json',
            text: JSON.stringify(response.files ?? [], null, 2),
          },
        ],
      }
    }
  )
}
