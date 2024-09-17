"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenVerifier = exports.tokenGenerator = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const tokenGenerator = (data, secretKey) => {
    let token = '';
    console.log('Data inside tokenGenerator : ', data);
    if (data.role === 'supportAdmin') {
        token = jsonwebtoken_1.default.sign(data, secretKey, { expiresIn: '1d' });
        console.log('Admin Token ==> ', token);
    }
    else {
        console.log('Data ==> ', data);
        token = jsonwebtoken_1.default.sign(data, secretKey, { expiresIn: '1d' });
        console.log('User Token ==> ', token);
    }
    console.log('Token inside tokenGenerator outside if-else  block ==> ', token);
    return token;
};
exports.tokenGenerator = tokenGenerator;
const tokenVerifier = (token, secretKey) => {
    try {
        // console.log('token --> ',token);
        const payload = jsonwebtoken_1.default.verify(token, secretKey);
        console.log("payload on token verifying ", payload);
        return payload;
    }
    catch (error) {
        console.log('Token verification failed:', error.message);
        // response.status(203).json({ message: "Token verification failed" });
        return error;
    }
};
exports.tokenVerifier = tokenVerifier;
