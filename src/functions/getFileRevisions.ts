import { GetFileRevisionsResponse } from '../types.js'
import { drive } from '../google/googleClient.js'

export const getFileRevisions = async (
  fileId: string
): Promise<GetFileRevisionsResponse> => {
  try {
    const res = await drive.revisions.list({
      fileId,
      fields: 'revisions(id, mimeType, modifiedTime, lastModifyingUser, size, originalFilename)',
    })

    const revisions = res.data.revisions || []

    return {
      success: true,
      revisions: revisions.map(rev => ({
        id: rev.id,
        mimeType: rev.mimeType,
        modifiedTime: rev.modifiedTime,
        lastModifyingUser: rev.lastModifyingUser ? {
          displayName: rev.lastModifyingUser.displayName,
          emailAddress: rev.lastModifyingUser.emailAddress
        } : undefined,
        size: rev.size,
        originalFilename: rev.originalFilename
      }))
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error getting file revisions:', message)
    return {
      success: false,
      message: `Error getting file revisions: ${message}`,
    }
  }
}
