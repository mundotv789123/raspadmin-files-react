import fs from 'fs'
import path from 'path'
import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "../auth/login";
import { lookup } from 'mime-types';

/* para evitar erro de limite de resposta */
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

    /* pegando informações do arquivo */
    let file_path = path.resolve(url_path)
    let content_type = lookup(file_path);
    if (content_type)
        res.setHeader('Content-Type', content_type)

    /* verificando range */
    let file = fs.lstatSync(url_path);
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