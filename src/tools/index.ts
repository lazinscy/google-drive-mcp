import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { registerListAllFoldersTool } from './listAllFolders.tools.js'
import { registerListFilesInFolderTool } from './listFilesInFolder.tools.js'
import { registerReturnFileTool } from './returnFile.tools.js'
import { registerGetFileMetadataTool } from './getFileMetadata.tools.js'
import { registerGetFileRevisionsTool } from './getFileRevisions.tools.js'
import { registerListSharedWithMeTool } from './listSharedWithMe.tools.js'
import { registerGetFileContentTool } from './getFileContent.tools.js'

export function registerAllTools(server: McpServer) {
  registerListAllFoldersTool(server)
  registerListFilesInFolderTool(server)
  registerReturnFileTool(server)
  registerGetFileMetadataTool(server)
  registerGetFileRevisionsTool(server)
  registerListSharedWithMeTool(server)
  registerGetFileContentTool(server)
}
