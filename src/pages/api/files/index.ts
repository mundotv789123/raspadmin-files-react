import fs from 'fs'
import { verifyToken } from '../auth/login'
import { fileFormat } from '../../../libs/api'
import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    /* verificando autenticação */
    if (!verifyToken(req.headers.cookie)) {
        res.status(401).json({ message: 'auth required' });
        return;
    }

    /* pegando e validando caminho do arquivo */
    let url_path = process.env.API_DIR + (req.query.path ? req.query.path : '/');
    if (!fs.existsSync(url_path) || !fs.realpathSync(url_path).startsWith(fs.realpathSync(process.env.API_DIR))) {
        res.status(404).send({ message: 'not found' });
        return;
    }

    /* retornando arquivos em json */
    let file = fs.lstatSync(url_path);
    let files_rest: fileFormat[] = [];

    if (file.isDirectory()) {
        let files = fs.readdirSync(url_path).filter(file => (!file.startsWith('.') && !file.startsWith('_')));
        files_rest = files.map(file => statsToFile(fs.lstatSync(url_path + '/' + file), file));
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

function statsToFile(file: fs.Stats, name: string, open: boolean = false): fileFormat {
    let is_dir = file.isDirectory();
    let icon = null;
    // if (is_dir) {
    //     let icon_path = url_path + file + '/_icon'
    //     icon = fs.existsSync(icon_path + '.png') ? icon_path + '.png' : (fs.existsSync(icon_path + '.jpeg') ? icon_path + '.jpeg' : (fs.existsSync(icon_path + '.jpg') ? icon_path + '.jpg' : null));
    //     icon = (icon != null) ? icon.substring(process.env.API_DIR.length) : null;
    // }
    return { name, is_dir, icon, open: open }
}