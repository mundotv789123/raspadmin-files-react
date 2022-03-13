import cookie from "cookie";
import md5 from "md5";

export default function handler(req, res) {
    if (process.env.API_AUTH === 'true') {
        let post_auth_md5 = md5(req.body.username+'-'+req.body.password).toString();
        let api_auth_md5 =  md5(process.env.API_USERNAME+'-'+process.env.API_PASSWORD).toString();
        if (post_auth_md5 !== api_auth_md5) {
            res.status(401).send({message: 'Senha ou usuário inválido'});
            return;
        }
        res.setHeader('Set-Cookie', cookie.serialize('RA_TOKEN', api_auth_md5, {httpOnly: true}))
    }
    res.status(200).json({message: 'Success'});
}