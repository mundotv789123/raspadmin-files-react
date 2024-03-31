export interface FileResponse {
  name: string,
  is_dir: boolean,
  open: boolean;
  icon?: string,
  type?: string;
}

export interface FileModel extends FileResponse {
  src: string,
  href: string,
  parent: string
}
