import jwt from 'jsonwebtoken';
import { ADMIN_SECRET_KEY, USER_SECRET_KEY } from '../config';

interface Payload {
    name: string;
    email: string;
    roleId: string;
    roleName: string;
    googleToken: string;
}

interface Token {
    token: string;
}

export const tokenGenerator = (data: Payload) => {
    let token = '';
    switch (data.roleName) {
        case 'SupportAdmin': {
            token = jwt.sign(data, ADMIN_SECRET_KEY, { expiresIn: '1d' });
            console.log('Admin Token ==> ', token);
            break;
        }
        case 'Student': {
            console.log('Data ==> ', data);
            token = jwt.sign(data, USER_SECRET_KEY, { expiresIn: '1d' });
            console.log('User Token ==> ', token);
            break;
        }
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

