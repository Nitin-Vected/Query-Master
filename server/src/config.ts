import dotenv from "dotenv";
dotenv.config();

export const CONNECTION_STRING: string = process.env.CONNECTION_STRING as string; 
export const PORT: string = process.env.PORT as string;
export const COMPANY_EMAIL: string = process.env.COMPANY_EMAIL as string;
export const COMPANY_PASS: string = process.env.COMPANY_PASS as string;
export const USER_SECRET_KEY: string = process.env.USER_SECRET_KEY as string;
export const ADMIN_SECRET_KEY: string = process.env.ADMIN_SECRET_KEY as string;
