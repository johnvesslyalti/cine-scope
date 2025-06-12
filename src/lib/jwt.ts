import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export function signToken(payLoad: object) {
    return jwt.sign(payLoad, JWT_SECRET, {
        expiresIn: '7d',
    })
}

export function verifyToken(token: string) {
        return jwt.verify(token, JWT_SECRET);
}