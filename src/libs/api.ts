import axios from "axios"
import { lookup } from 'mime-types'

/* api */
export const api_url = process.env.NEXT_PUBLIC_API_URL;
export const api = axios.create({ baseURL: api_url, timeout: 1000 })

export interface fileFormat {
    name: string,
    is_dir: boolean,
    icon: string | null,
    type?: string | false,
    url?: string | null,
    open: boolean
}

export interface openFile {
    type: string | false,
    src: string,
    parent: string
}

export function getFiles(path: string | null, call: (files: fileFormat[], file: openFile | null) => void, errorF: (e: any) => void) {
    api.get(`files${(path != null ? '?path=' + path : '')}`).then(r => {
        if (r.status == 204) {
            call([], null);
            return;
        }

        let files: fileFormat[] = Object.values(r.data.files);
        if (files.length == 1 && files[0].open) {
            let src_splited = path.split('/');
            let parent_src = path.substring(0, (path.length - src_splited[src_splited.length - 1].length) - 1);
            call([], {
                type: lookup(files[0].name),
                src: `${api_url}/files/open?path=${path}`,
                parent: `${parent_src}`
            });
            return;
        }

        files = files.sort((a: fileFormat, b: fileFormat) => ("" + a.name).localeCompare(b.name, undefined, { numeric: true }))
        call(files.map((file: fileFormat) => {
            return {
                name: file.name,
                is_dir: file.is_dir,
                open: file.open,
                type: lookup(file.name),
                icon: file.icon ? encodeURI(`${api_url}/files?path=${file.icon}`) : null,
                url: ('#'+`${path}/${file.name}`.replace('&', '%26').replace('#', '%23'))
            }
        }), null)
    }).catch(errorF);
}

export function getErrorMessage(code: number): string {
    switch (code) {
        case 404:
            return 'Arquivo ou diretório não encontrado!';
        case 403:
            return 'Você não tem permissão para acessar esse arquivo ou diretório!';
        default:
            return 'Erro interno ao processar arquivo!';
    }
}