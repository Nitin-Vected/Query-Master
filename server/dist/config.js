"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADMIN_SECRET_KEY = exports.USER_SECRET_KEY = exports.COMPANY_PASS = exports.COMPANY_EMAIL = exports.PORT = exports.CONNECTION_STRING = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.CONNECTION_STRING = process.env.CONNECTION_STRING;
exports.PORT = process.env.PORT;
exports.COMPANY_EMAIL = process.env.COMPANY_EMAIL;
exports.COMPANY_PASS = process.env.COMPANY_PASS;
exports.USER_SECRET_KEY = process.env.USER_SECRET_KEY;
exports.ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY;
