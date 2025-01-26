export interface FileDTO {
  name: string,
  size: number,
  is_dir: boolean,
  type: string | null,
  icon: string | null,
  path: string,
  updatedAt: Date,
  open: boolean,
  href: string,
  src: string,
  parent: string
}

export interface FilesResponse {
  files: Array<FileDTO>
}