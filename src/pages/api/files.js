import fs from 'fs'
export default function handler(req, res) {
    if (process.env.API_AUTH == true) {
        res.status(401).send();
        return;
    }

    let path = process.env.API_DIR + (req.query.path ? req.query.path : '/');
    if (!fs.existsSync(path)) {
        res.status(404).send();
        return;
    }

    if (!fs.realpathSync(path).startsWith(fs.realpathSync(process.env.API_DIR))) {
        res.status(403).send();
        return;
    }

    let file = fs.lstatSync(path);
    if (file.isDirectory()) {
        let files = fs.readdirSync(path).filter(file => { return (!file.startsWith('.') && !file.startsWith('_')) });
        res.status(200).json({files: files.map(file => {
            return {
                name: file, 
                is_dir: fs.lstatSync(path + '/' + file).isDirectory()
            }
        })});
        return;
    }
    res.status(200).json([]); //code
}