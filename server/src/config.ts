import dotenv from "dotenv";
import queryModel from "./model/queryModel";
import shortid from 'shortid';
dotenv.config();

export const CONNECTION_STRING: string = process.env.CONNECTION_STRING as string;
export const PORT: string = process.env.PORT as string;
export const USER_SECRET_KEY: string = process.env.USER_SECRET_KEY as string;
export const ADMIN_SECRET_KEY: string = process.env.ADMIN_SECRET_KEY as string;
export const GOOGLE_DECODE_TOKEN_API: string = process.env.GOOGLE_DECODE_TOKEN_API as string;
export const StatusCodes = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    ALREADY_EXIST: 409,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
};

export const generateQueryId = async (email: string, role: string) => {
    try {
        let isUnique = false;
        let newQueryId = '';
        const latestQuery = await queryModel.findOne({ userEmail: email, userRole: role }).sort({ createdAt: -1 }).limit(1);
        console.log("Latest Query ---> ", latestQuery);
        let newCounter = 1;
        if (latestQuery && latestQuery.queryId) {
            const numericPart = latestQuery.queryId.match(/\d+$/);  
            if (numericPart) {
                newCounter = parseInt(numericPart[0]) + 1; 
            };
        }
        while (!isUnique) {
            const uniqueId = shortid.generate();;
            newQueryId = `QRY${uniqueId}0${newCounter}`;
            console.log(`Generated Query ID: ${newQueryId}`);
            const existingQuery = await queryModel.findOne({ queryId: newQueryId });
            if (!existingQuery) {
                isUnique = true;
            } else {
                console.log('Query ID collision, regenerating...');
            }
        }
        return newQueryId;
    } catch (error) {
        console.error('Error generating Query ID:', error);
        throw error;
    }
}
