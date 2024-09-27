import jwt from 'jsonwebtoken';
import { ADMIN_SECRET_KEY, COUNSELLOR_SECRET_KEY, USER_SECRET_KEY } from '../config';

interface Payload {
    name: string;
    userId: string;
    email: string;
    roleId: string;
    roleName: string;
    googleToken: string;
    status: string;
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
        case 'Counsellor': {
            console.log('Data ==> ', data);
            console.log('User Token ==> ', token);
            token = jwt.sign(data, COUNSELLOR_SECRET_KEY, { expiresIn: '1d' });
            break;
        }
    }
    console.log('Token inside tokenGenerator outside if-else  block ==> ', token);
    return token;
}

export const tokenVerifier = (token: any, secretKey: string) => {
    try {
        console.log('token --> ', token);
        const payload = jwt.verify(token, secretKey);
        console.log("Verified Payload ", payload);
        return payload;
    } catch (error: any) {
        console.log('Token verification failed:', error.message);
        return error;
    }
}

