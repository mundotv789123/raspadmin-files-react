import axios from "axios"
import { lookup } from 'mime-types'

/* interfaces */
export interface fileFormat {
    name: string,
    is_dir: boolean,
    icon: string | null,
    type: string | false,
    url?: string | null,
}

export interface openFile {
    type: string,
    src: string,
    parent: string
}

/* api */
export const api_url = process.env.NEXT_PUBLIC_API_URL;
export const api = axios.create({
    baseURL: api_url,
    timeout: 1000
})

/* funções */
export function getFiles(path: string | null, call: (files: fileFormat[], file: openFile | null) => void, errorF: (e: any) => void) {
    api.get(`files${(path != null ? '?path=' + path : '')}`).then(r => {
        if (r.status == 204) {
            call([], null);
            return;
        }
        let type = r.headers['content-type'];
        if (!type.startsWith('application/json')) {
            let src_splited = path.split('/');
            let parent_src = path.substring(0, (path.length - src_splited[src_splited.length - 1].length) - 1);
            call([], {
                type: type,
                src: `${api_url}/files?path=${path}`,
                parent: `${parent_src}`
            });
            return;
        }

        let files: fileFormat[] = Object.values(r.data.files);
        files = files.sort((a: fileFormat, b: fileFormat) => ("" + a.name).localeCompare(b.name, undefined, { numeric: true }))
        call(files.map((file: fileFormat) => {
            return {
                url: ('#'+`${path}/${file.name}`.replace('&', '%26').replace('#', '%23')),
                name: file.name,
                is_dir: file.is_dir,
                type: lookup(file.name),
                icon: file.icon ? encodeURI(`${api_url}/files?path=${file.icon}`) : null
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