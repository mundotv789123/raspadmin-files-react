import fs from 'fs'
import path from 'path'
import { lookup } from 'mime-types'

export default function handler(req, res) {
    if (process.env.API_AUTH == true) {
        res.status(401).send();
        return;
    }

    /* pegando e validando caminho do arquivo */
    let url_path = process.env.API_DIR + (req.query.path ? req.query.path : '/');
    if (!fs.existsSync(url_path)) {
        res.status(404).send();
        return;
    }

    if (!fs.realpathSync(url_path).startsWith(fs.realpathSync(process.env.API_DIR))) {
        res.status(403).send();
        return;
    }

    /* verificando se arquivo é diretório */
    let file = fs.lstatSync(url_path);
    if (file.isDirectory()) {
        let files = fs.readdirSync(url_path).filter(file => { return (!file.startsWith('.') && !file.startsWith('_')) });
        res.status(200).json({files: files.map(file => {
            return {
                name: file, 
                is_dir: fs.lstatSync(url_path + '/' + file).isDirectory()
            }
        })});
        return;
    }

    /* eviando arquivo */
    let file_path = path.resolve(url_path)
    let file_buffer = fs.readFileSync(file_path)

    res.setHeader('Content-Type', lookup(file_path))
    res.send(file_buffer)
}