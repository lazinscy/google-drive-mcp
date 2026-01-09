import { Folder, ListFoldersResponse } from '../types.js'
import { drive } from '../google/googleClient.js'

export const listAllFolders = async (): Promise<ListFoldersResponse> => {
  try {
    const folderQuery = `mimeType = 'application/vnd.google-apps.folder' and trashed = false`
    const folderRes = await drive.files.list({
      q: folderQuery,
      fields: 'files(id, name)',
      spaces: 'drive',
      pageSize: 1000,
    })

    const folders: Folder[] =
      folderRes.data.files?.map((folder) => ({
        id: folder.id,
        name: folder.name,
      })) || []

    return {
      success: true,
      folders,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error listing client folders:', message)
    return {
      success: false,
      message: `Error listing client folders: ${message}`,
    }
  }
}
