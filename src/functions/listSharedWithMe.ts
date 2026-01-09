import { ListFilesResponse } from '../types.js'
import { drive } from '../google/googleClient.js'

export const listSharedWithMe = async (): Promise<ListFilesResponse> => {
  try {
    const res = await drive.files.list({
      q: 'sharedWithMe=true',
      fields: 'files(id, name, mimeType, owners, modifiedTime)',
      pageSize: 100,
    })

    const files = res.data.files || []

    return {
      success: true,
      files: files.map(file => ({
        id: file.id,
        name: file.name,
        mimeType: file.mimeType,
        owners: file.owners?.map(o => o.emailAddress).join(', '),
        modifiedTime: file.modifiedTime,
      })),
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error listing shared files:', message)
    return {
      success: false,
      message: `Error listing shared files: ${message}`,
    }
  }
}
