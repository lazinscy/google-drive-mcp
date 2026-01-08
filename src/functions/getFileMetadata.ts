import { GetFileMetadataResponse } from '../types.js'
import { drive } from '../google/googleClient.js'

export const getFileMetadata = async (
  fileId: string
): Promise<GetFileMetadataResponse> => {
  try {
    const res = await drive.files.get({
      fileId,
      fields: 'id, name, mimeType, size, createdTime, modifiedTime, owners, lastModifyingUser, webViewLink, webContentLink, parents, shared, trashed',
    })

    const file = res.data

    return {
      success: true,
      metadata: {
        id: file.id,
        name: file.name,
        mimeType: file.mimeType,
        size: file.size,
        createdTime: file.createdTime,
        modifiedTime: file.modifiedTime,
        owners: file.owners?.map(o => ({ 
          displayName: o.displayName, 
          emailAddress: o.emailAddress 
        })),
        lastModifyingUser: file.lastModifyingUser ? {
          displayName: file.lastModifyingUser.displayName,
          emailAddress: file.lastModifyingUser.emailAddress
        } : undefined,
        webViewLink: file.webViewLink,
        webContentLink: file.webContentLink,
        parents: file.parents,
        shared: file.shared,
        trashed: file.trashed
      },
    }
  } catch (error) {
    console.error('Error getting file metadata:', error)
    return {
      success: false,
      message: `Error getting file metadata: ${error}`,
    }
  }
}
