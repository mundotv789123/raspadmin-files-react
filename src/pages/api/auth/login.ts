import cookie from "cookie";
import * as jwt from 'jsonwebtoken';
import md5 from "md5";
import { NextApiRequest, NextApiResponse } from "next";

const COOKIE_NAME = "token";

export function verifyToken(cookies: string | null): boolean {
    if (!process.env.API_AUTH_KEY || process.env.API_AUTH_KEY === '') {
        return true;
    }

    if (!cookies)
        return false;
    let token = cookie.parse(cookies)[COOKIE_NAME];
    if (!token)
        return false;

    try {
        let decoded = jwt.verify(token, process.env.API_AUTH_KEY);
        return (decoded['password'] === md5(process.env.API_PASSWORD));
    } catch (e) { }

    return false;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (process.env.API_AUTH_KEY && process.env.API_AUTH_KEY !== '') {
        if (process.env.API_USERNAME !== req.body.username || process.env.API_PASSWORD !== req.body.password) {
            res.status(401).send({ message: 'Senha ou usuário inválido' });
            return;
        }
        let token = jwt.sign({ name: process.env.API_USERNAME, password: md5(process.env.API_PASSWORD) }, process.env.API_AUTH_KEY, { expiresIn: '1d' });
        res.setHeader('Set-Cookie', cookie.serialize(COOKIE_NAME, token, { httpOnly: true, path: "/" }))
    }
    res.status(200).json({ message: 'Success' });
}