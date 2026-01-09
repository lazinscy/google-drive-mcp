import { drive } from '../google/googleClient.js'

export const getFileContent = async (fileId: string): Promise<{ success: boolean; content?: string; message?: string }> => {
  try {
    // First get file metadata to check mime type
    const metadata = await drive.files.get({
      fileId,
      fields: 'mimeType, name',
    })

    const mimeType = metadata.data.mimeType

    // For Google Docs, Sheets, etc. - export as plain text or appropriate format
    if (mimeType === 'application/vnd.google-apps.document') {
      const res = await drive.files.export({
        fileId,
        mimeType: 'text/plain',
      }, { responseType: 'text' })
      
      return {
        success: true,
        content: res.data as string,
      }
    }

    // For Google Sheets - export as CSV
    if (mimeType === 'application/vnd.google-apps.spreadsheet') {
      const res = await drive.files.export({
        fileId,
        mimeType: 'text/csv',
      }, { responseType: 'text' })
      
      return {
        success: true,
        content: res.data as string,
      }
    }

    // For regular files (docx, txt, etc.) - download content
    if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        mimeType === 'text/plain' ||
        mimeType === 'text/html' ||
        mimeType === 'application/rtf') {
      
      // For docx files, export as plain text through Google's conversion
      const res = await drive.files.export({
        fileId,
        mimeType: 'text/plain',
      }, { responseType: 'text' })
      
      return {
        success: true,
        content: res.data as string,
      }
    }

    return {
      success: false,
      message: `Unsupported file type: ${mimeType}. Supported: Google Docs, Sheets, docx, txt, html, rtf`,
    }

  } catch (error) {
    console.error('Error getting file content:', error)
    return {
      success: false,
      message: `Error getting file content: ${error}`,
    }
  }
}
