export interface MCPTool {
  name: string
  description: string
  parameters: any
  invoke: (input: { arguments: any }) => Promise<any>
}

export interface ListFoldersResponse {
  success: boolean
  folders?: Folder[]
  message?: string
}

export interface Folder {
  id: string | null | undefined
  name: string | null | undefined
}

export interface ListFilesResponse {
  success: boolean
  files?: File[]
  message?: string
}

export interface ReturnFileResponse {
  success: boolean
  file?: File
  message?: string
}

export interface File {
  id: string | null | undefined
  name: string | null | undefined
  viewLink?: string | null
  downloadLink?: string | null
}

export interface FileMetadata {
  id: string | null | undefined
  name: string | null | undefined
  mimeType: string | null | undefined
  size: string | null | undefined
  createdTime: string | null | undefined
  modifiedTime: string | null | undefined
  owners?: { displayName?: string | null; emailAddress?: string | null }[]
  lastModifyingUser?: { displayName?: string | null; emailAddress?: string | null }
  webViewLink: string | null | undefined
  webContentLink: string | null | undefined
  parents: string[] | null | undefined
  shared: boolean | null | undefined
  trashed: boolean | null | undefined
}

export interface GetFileMetadataResponse {
  success: boolean
  metadata?: FileMetadata
  message?: string
}

export interface FileRevision {
  id: string | null | undefined
  mimeType: string | null | undefined
  modifiedTime: string | null | undefined
  lastModifyingUser?: { displayName?: string | null; emailAddress?: string | null }
  size: string | null | undefined
  originalFilename: string | null | undefined
}

export interface GetFileRevisionsResponse {
  success: boolean
  revisions?: FileRevision[]
  message?: string
}
