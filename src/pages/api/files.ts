import fs from 'fs'
import path from 'path'
import { verifyToken } from './login'
import { lookup } from 'mime-types'
import { fileFormat as file } from '../../libs/api'
import { NextApiRequest, NextApiResponse } from 'next'

export const config = {
    api: {responseLimit: false}
}

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

    /* verificando se caminho é diretório */
    let file = fs.lstatSync(url_path);
    if (file.isDirectory()) {
        let files = fs.readdirSync(url_path).filter(file => { return (!file.startsWith('.') && !file.startsWith('_')) });
        if (files.length === 0) {
            res.status(204).send(null);
            return;
        }

        let files_rest: file[] = files.map(file => {
            let icon = null;
            let is_dir = fs.lstatSync(url_path + '/' + file).isDirectory();
            if (is_dir) {
                let icon_path = url_path + file + '/_icon'
                icon = fs.existsSync(icon_path + '.png') ? icon_path + '.png' : (fs.existsSync(icon_path + '.jpeg') ? icon_path + '.jpeg' : (fs.existsSync(icon_path + '.jpg') ? icon_path + '.jpg' : null));
                icon = (icon != null) ? icon.substring(process.env.API_DIR.length) : null;
            }
            return {
                name: file,
                is_dir: is_dir,
                icon: icon
            }
        })

        res.status(200).json({ files: files_rest })
        return;
    }

    /* eviando arquivo */
    send_file(req, res, url_path, file)
}

function send_file(req: NextApiRequest, res: NextApiResponse, url_path: string, file: fs.Stats) {
    /* pegando informações do arquivo */
    let file_path = path.resolve(url_path)
    let content_type = lookup(file_path);
    if (content_type)
        res.setHeader('Content-Type', content_type)

    /* verificando range */
    let range = get_range(req.headers.range, file.size);
    if (range === null) {
        if (content_type && content_type.split('/')[0] !== 'video') {
            let file_stream = fs.createReadStream(file_path)
            res.status(200).send(file_stream)
            return
        }
        res.setHeader('Accept-Ranges', 'bytes');
        res.status(200).send(null);
        return;
    }

    /* enviando range */
    res.setHeader('Content-Range', 'bytes ' + range.Start + '-' + range.End + '/' + file.size);
    let file_stream = fs.createReadStream(file_path, { start: range.Start, end: range.End })
    res.status(206).send(file_stream)
}

function get_range(range: null | string, length: number) {
    if (!range || range.length == 0)
        return null;

    let buffer = 524288;
    let array = range.split(/bytes=([0-9]*)-([0-9]*)/);

    let start = parseInt(array[1]);
    let end = parseInt(array[2]);

    start = isNaN(start) ? 0 : start
    end = isNaN(end) ? (start + buffer) : end

    if (end > length - 1) {
        end = length - 1;
    }

    if (start > end) {
        start = 0;
        end = buffer;
    }

    return { Start: start, End: end };
}