import fs from 'fs'
import path from 'path'
import md5 from 'md5'
import cookie from 'cookie'
import { lookup } from 'mime-types'

export default function handler(req, res) {
    if (process.env.API_AUTH === 'true') {
        if (!req.headers.cookie) {
            res.status(401).json({ message: 'auth required' });
            return;
        }
        let cookie_auth_md5 = cookie.parse(req.headers.cookie).RA_TOKEN;
        let api_auth_md5 = md5(process.env.API_USERNAME + '-' + process.env.API_PASSWORD);
        if (cookie_auth_md5 !== api_auth_md5) {
            res.status(401).send({ message: 'auth required' });
            return;
        }
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
        res.status(200).json({
            files: files.map(file => {
                return {
                    name: file,
                    is_dir: fs.lstatSync(url_path + '/' + file).isDirectory()
                }
            })
        });
        return;
    }

    /* eviando arquivo */
    send_file(req, res, url_path, file)
}

function send_file(req, res, url_path, file) {
    /* pegando informações do arquivo */
    let file_path = path.resolve(url_path)
    res.setHeader('Content-Type', lookup(file_path))

    /* verificando range */
    let range = get_range(req.headers.range, file.size);
    if (range === null) {
        res.setHeader('Accept-Ranges', 'bytes');
        res.status(200).send();
        return;
    }

    /* enviando range */
    res.setHeader('Content-Range', 'bytes ' + range.Start + '-' + range.End + '/' + file.size);
    let file_stream = fs.createReadStream(file_path, {start: range.Start, end: range.End})
    res.status(206).send(file_stream)
}

function get_range(range, length) {
    if (range == null || range.length == 0)
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

    return {Start: start, End: end};
}