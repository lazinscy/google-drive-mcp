import { drive } from '../google/googleClient.js'
import mammoth from 'mammoth'

export const getFileContent = async (fileId: string): Promise<{ success: boolean; content?: string; message?: string }> => {
  try {
    // First get file metadata to check mime type
    const metadata = await drive.files.get({
      fileId,
      fields: 'mimeType, name',
    })

    const mimeType = metadata.data.mimeType || ''

    // For Google Docs - export as plain text
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

    // For docx files - download and parse with mammoth
    if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const res = await drive.files.get({
        fileId,
        alt: 'media',
      }, { responseType: 'arraybuffer' })
      
      const buffer = Buffer.from(res.data as ArrayBuffer)
      const result = await mammoth.extractRawText({ buffer })
      
      return {
        success: true,
        content: result.value,
      }
    }

    // For plain text files
    if (mimeType === 'text/plain' ||
        mimeType === 'text/html' ||
        mimeType === 'text/csv') {
      const res = await drive.files.get({
        fileId,
        alt: 'media',
      }, { responseType: 'text' })
      
      return {
        success: true,
        content: res.data as string,
      }
    }

    return {
      success: false,
      message: `Unsupported file type: ${mimeType}. Supported: Google Docs, Sheets, docx, txt, html, csv`,
    }

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error getting file content:', message)
    return {
      success: false,
      message: `Error getting file content: ${message}`,
    }
  }
}
