import axios, { AxiosInstance } from "axios";
import { FileLinkModel, FileModel } from "./models/FilesModel";
import { lookup } from "mime-types";

export class FilesService {
    private API_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";

    private api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: `${this.API_URL}`,
            timeout: 1000
        })
    }

    public getFiles(pathFile: string | null, callback: ((files: Array<FileModel>, path: string) => void), callbackError?: ((status: number, errorMessage: string) => void)) {
        let path = this.clearPath(pathFile);

        this.api.get(`/files?path=/${encodeURIComponent(path)}`).then(reponse => {
            if (reponse.status == 204) {
                return callback([], path);
            }

            let files: Array<FileModel> = Object.values<FileModel>(reponse.data.files).map(file => {
                if (!file.type) {
                    let type = lookup(file.name);
                    if (type)
                        file.type = type;
                }
                if (file.icon) 
                    file.icon = `${this.API_URL}/files/open?path=/${encodeURIComponent(file.icon)}`
                return file;
            });
            callback(files, path);
        }).catch(error => {
            if (!callbackError)
                return;

            let status = 500;
            try {
                let json = error.toJSON();
                if (json && json.status)
                    status = json.status;
            } catch {
            }

            let message = this.getErrorMessage(status);
            callbackError(status, message);
        })
    }

    public openFile(file: FileModel, path: string): FileLinkModel {
        let parent = path.replace(/\/[^\/]+\/?$/, '');
        return {
            name: file.name,
            type: file.type,
            parent: parent,
            src: `${this.API_URL}/files/open?path=/${encodeURIComponent(path)}`
        }
    }

    private clearPath(path: string | null): string {
        if (path == null)
            return "";
        return decodeURI(
            path
                .replace(/\/\/+/, '/')
                .replace(/^\/+/, '')
                .replace(/\/+$/, '')
                .trim()
        );
    }

    private getErrorMessage(code: number): string {
        switch (code) {
            case 404:
                return 'Arquivo ou diretório não encontrado!';
            case 403:
                return 'Você não tem permissão para acessar esse arquivo ou diretório!';
            case 500:
                return 'Erro interno ao processar arquivo!';
            default:
                return 'Erro desconhecido ao processar requisição!'
        }
    }
}



