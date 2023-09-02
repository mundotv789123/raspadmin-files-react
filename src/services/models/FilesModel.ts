export interface FileModel {
    name: string,
    is_dir: boolean,
    icon?: string,
    type?: string,
    href?: string, 
    open: boolean
}

export interface FileLinkModel {
    name: string,
    src: string,
    parent: string,
    type: string | false
}
