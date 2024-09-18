import express from 'express';
import { tokenVerifier } from '../utilities/jwt';
import { ADMIN_SECRET_KEY, StatusCodes } from '../config';
import queryModel from '../model/queryModel';
import userModel from '../model/userModel';


export const adminViewProfileController = async (request: any, response: express.Response) => {
    try {
        const { email, role } = request.payload;
        if (!email) {
            response.status(StatusCodes.NOT_FOUND).json({ message: "Token not found" });
        } else {
            const adminData = await userModel.findOne({ email, role });
            if (adminData?.status) {
                response.status(StatusCodes.CREATED).json({ adminData: adminData, message: "This is your dersired data ..!" })
            } else {
                response.status(StatusCodes.NOT_FOUND).json({ adminData: null, message: "The Account You are Trying to Acces has been Deactivated ..!" })
            }
        }
    } catch (error) {
        console.log(error);
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong ..!" });
    }
}


export const adminAddContactNumberController = async (request: any, response: express.Response) => {
    try {
        const { email, role } = request.payload;
        const { contactNumber } = request.body;
        console.log('Hello from adminAddContactNumberController ..!');
        if (!email || !role) {
            response.status(StatusCodes.NOT_FOUND).json({ message: "Token not found" });
        } else {
            const adminData = await userModel.findOneAndUpdate(
                { email, role },
                { contactNumber },
                { new: true }
            );
            if (adminData?.status) {
                console.log('Contact Number added successfully ..!')
                return response.status(StatusCodes.CREATED).json({ adminData: adminData, message: "Contact number updated successfully!" });
            } else {
                return response.status(StatusCodes.NOT_FOUND).json({ adminData: null, message: "The account you are trying to access has been deactivated!" });
            }
        }
    } catch (error) {
        console.log(error);
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong ..!" });

    }
}

export const adminViewRaisedQueryListController = async (request: express.Request, response: express.Response) => {
    try {
        const raisedQueries = await queryModel.find();
        console.log(`RaisedQuery by  ${raisedQueries} : `);
        if (raisedQueries) {
            return response.status(StatusCodes.CREATED).json({ raisedQueries: raisedQueries, message: "These are the recently raised queries ..!" });
        } else {
            throw new Error('Queries not found ..!')
        }
    } catch (error) {
        console.log('Error occure in userRaiseQueryController : ', error)
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong ..!" });
    }
}

export const adminRaiseQueryController = async (request: any, response: express.Response) => {
    try {
        const { email, role } = request.payload;
        const { subject, message } = request.body;

        const similaryExistingQuery = await queryModel.findOne({ userEmail: email, userRole: role, subject, message });
        if (!similaryExistingQuery) {
            const updatedQuery = await queryModel.create({
                userEmail: email,
                userRole: role,
                subject,
                message,
                conversation: [{
                    sender: email,
                    message: message,
                    role: role,
                    timestamp: new Date()
                }]
            });
            return response.status(StatusCodes.CREATED).json({ updatedQuery, message: "Your query has been successfully published ..!" });
        } else {
            return response.status(400).json({ message: "A similar query has already been added by you ..!" });
        }

    } catch (error) {
        console.log(error);
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to create query' });
    }
};

export const adminResponseController = async (request: any, response: express.Response) => {
    try {
        const { name, email, role } = request.payload;
        const { queryId } = request.params;
        const { message } = request.body;
        console.log('QueryId : ', queryId);

        // Find the query by its _id
        const query = await queryModel.findOne({ _id: Object(queryId) });
        console.log('Got Query ==> ', query?.status)
        if (!query) {
            return response.status(StatusCodes.NOT_FOUND).json({ error: 'Query not found' });
        } else if (query.status === "Open") {
            console.log('Name ==> ',request.payload.name);
            console.log('Email ==> ',request.payload.email);
            console.log('Query ', query);
            query.conversation.push({
                sender: name,
                email: email,
                message,
                role:role,
                timestamp: new Date()
            });
            await query.save();
            console.log('After conversation.push:', query.conversation);
            // added new changes
            response.status(StatusCodes.CREATED).json({ query, message: "Your response has been sent to the Inquirer successfully!" });
        } else {
            response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Query has been closed by the user!' });
        }
        console.log('Query in adminResponseController : ', query);

    } catch (error) {
        console.log(error);
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to find query' });
    }
};

export const adminAuthenticationController = async (request: express.Request, response: express.Response) => {
    try {
        const authHeader = request.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return response.status(401).json({ message: 'Authorization token is missing or invalid' });
        }
        const token = authHeader.split(' ')[1];
        console.log('Token : ', token);
        const payload = await tokenVerifier(token, ADMIN_SECRET_KEY);
        const adminData = await userModel.findOne({ email: payload.email, role: payload.role });
        console.log('userData : ', adminData, '  token in adminAuthenticationController : ', token)
        response.status(StatusCodes.CREATED).json({ userData: adminData, token: token, message: "Authenntication Successfull ..!" });
    } catch (err) {
        console.log("Error while user authentication Controller", err);
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Token Not verify please login then try to access ..!' });
    }
};

// for backend
export const adminAuthenticateJWT = async (request: any, response: express.Response, next: Function) => {
    try {
        const authHeader = request.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return response.status(401).json({ message: 'Authorization token is missing or invalid' });
        }
        const token = authHeader.split(' ')[1];
        console.log('Token : ', token);
        const payload = await tokenVerifier(token, ADMIN_SECRET_KEY);
        request.payload = payload;
        next();
    } catch (error) {
        return response.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid or expired Candidate token" });
    }
};