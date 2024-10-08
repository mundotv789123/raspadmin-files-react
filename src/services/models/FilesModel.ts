export interface FileResponse {
  name: string,
  is_dir: boolean,
  open: boolean;
  created_at: Date,
  icon?: string,
  type: string | null;
}

export interface FileModel extends FileResponse {
  src: string,
  href: string,
  parent: string
}
