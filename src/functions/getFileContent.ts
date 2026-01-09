import { drive } from '../google/googleClient.js'
import { Readable } from 'stream'

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

    // For regular files (docx, txt, etc.) - download binary and convert
    if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        mimeType === 'text/plain' ||
        mimeType === 'text/html' ||
        mimeType === 'text/csv' ||
        mimeType === 'application/rtf') {
      
      const res = await drive.files.get({
        fileId,
        alt: 'media',
      }, { responseType: 'arraybuffer' })
      
      const buffer = Buffer.from(res.data as ArrayBuffer)
      
      // For docx, we need to extract text - for now return as UTF-8
      // In production, you'd use a library like mammoth for docx
      if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        // Try to extract readable text from docx (simplified approach)
        const text = buffer.toString('utf-8')
        // Extract text between XML tags (basic extraction)
        const cleanText = text.replace(/<[^>]*>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
        
        return {
          success: true,
          content: cleanText,
        }
      }
      
      return {
        success: true,
        content: buffer.toString('utf-8'),
      }
    }

    return {
      success: false,
      message: `Unsupported file type: ${mimeType}. Supported: Google Docs, Sheets, docx, txt, html, csv, rtf`,
    }

  } catch (error) {
    console.error('Error getting file content:', error)
    return {
      success: false,
      message: `Error getting file content: ${error}`,
    }
  }
}
