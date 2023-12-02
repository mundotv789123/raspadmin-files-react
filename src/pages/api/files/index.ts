import fs from 'fs'
import { verifyToken } from '../auth/login'
import { NextApiRequest, NextApiResponse } from 'next'
import { FileModel } from '../../../services/models/FilesModel';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    /* verificando autenticação */
    if (!verifyToken(req.headers.cookie)) {
        res.status(401).json({ message: 'auth required' });
        return;
    }

    /* pegando e validando caminho do arquivo */
    let path = (req.query.path ? req.query.path : '/');
    let url_path = process.env.API_DIR + (req.query.path ? req.query.path : '/');
    if (!fs.existsSync(url_path) || !fs.realpathSync(url_path).startsWith(fs.realpathSync(process.env.API_DIR))) {
        res.status(404).send({ message: 'not found' });
        return;
    }

    /* retornando arquivos em json */
    let file = fs.lstatSync(url_path);
    let files_rest: Array<FileModel> = [];

    if (file.isDirectory()) {
        let files = fs.readdirSync(url_path).filter(file => (!file.startsWith('.') && !file.startsWith('_')));
        files_rest = files.map(file => {
            let fileModel = statsToFile(fs.lstatSync(url_path + '/' + file), file)
            if (fileModel.is_dir) {
                let icon = getFileIcon(url_path + '/' + file)
                if (icon)
                    fileModel.icon = `${path}/${file}/${icon}`
            }
            return fileModel;
        });
    } else {
        let file_name = url_path.split(/\/([^\/])^/)[0]
        files_rest.push(statsToFile(file, file_name, true));
    }

    /* retornando valores */
    if (files_rest.length === 0) {
        res.status(204).send(null);
        return;
    }

    res.status(200).json({ files: files_rest })
}

function statsToFile(file: fs.Stats, name: string, open: boolean = false): FileModel {
    let is_dir = file.isDirectory();
    let created_at = file.ctime;
    return { name, is_dir, icon: null, open: open, created_at: created_at }
}

function getFileIcon(url_path: string):string | null {
    let files = fs.readdirSync(url_path);
    for(let file of files) {
        if (file.match(/^_icon\.(png|jpe?g|svg|webp)$/))
            return file;
    }
    return null;
}