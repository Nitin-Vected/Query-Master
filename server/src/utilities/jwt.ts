import e from 'express';
import jwt from 'jsonwebtoken';

interface Payload {
    email: string;
    role: string;
}

interface Token {
    token: string;
}
export const tokenGenerator = (data: Payload, secretKey: string) => {
    let token = '';
    if (data.role === 'supportAdmin') {
        token = jwt.sign(data, secretKey, { expiresIn: '1d' });
        console.log('Admin Token ==> ', token);
    } else {
        console.log('Data ==> ', data);
        token = jwt.sign(data, secretKey, { expiresIn: '1d' });
        console.log('User Token ==> ', token);
    }
    console.log('Token inside tokenGenerator outside if-else  block ==> ', token);
    return token;
}

export const tokenVerifier = (token: any, secretKey: string) => {
    try {
        // console.log('token --> ',token);
        const payload = jwt.verify(token, secretKey);
        return payload;
    } catch (error: any) {
        console.log('Token verification failed:', error.message);
        return error;
    }
}

