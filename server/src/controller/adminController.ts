import express from 'express';
import { tokenVerifier } from '../utilities/jwt';
import { ADMIN_SECRET_KEY } from '../config';
import queryModel from '../model/queryModel';
import userModel from '../model/userModel';


export const adminViewProfileController = async (request: any, response: express.Response) => {
    try {
        const { email, role } = request.payload;
        if (!email) {
            response.status(404).json({ message: "Token not found" });
        } else {
            const adminData = await userModel.findOne({ email, role });
            if (adminData?.status) {
                response.status(201).json({ adminData: adminData, message: "This is your dersired data ..!" })
            } else {
                response.status(404).json({ adminData: null, message: "The Account You are Trying to Acces has been Deactivated ..!" })
            }
        }
    } catch (error) {
        console.log(error);
        response.status(500).json({ message: "Something went wrong ..!" });
    }
}


export const adminAddContactNumberController = async (request: any, response: express.Response) => {
    try {
        const { email, role } = request.payload;
        const { contactNumber } = request.body;
        console.log('Hello from adminAddContactNumberController ..!');
        if (!email || !role) {
            response.status(404).json({ message: "Token not found" });
        } else {
            const adminData = await userModel.findOneAndUpdate(
                { email, role },
                { contactNumber },
                { new: true }
            );
            if (adminData?.status) {
                console.log('Contact Number added successfully ..!')
                return response.status(201).json({ adminData: adminData, message: "Contact number updated successfully!" });
            } else {
                return response.status(404).json({ adminData: null, message: "The account you are trying to access has been deactivated!" });
            }
        }
    } catch (error) {
        console.log(error);
        response.status(500).json({ message: "Something went wrong ..!" });

    }
}

export const adminViewRaisedQueryListController = async (request: express.Request, response: express.Response) => {
    try {
        const raisedQueries = await queryModel.find();
        console.log(`RaisedQuery by  ${raisedQueries} : `);
        if (raisedQueries) {
            return response.status(201).json({ raisedQueries: raisedQueries, message: "These are the recently raised queries ..!" });
        } else {
            throw new Error('Queries not found ..!')
        }
    } catch (error) {
        console.log('Error occure in userRaiseQueryController : ', error)
        response.status(500).json({ message: "Something went wrong ..!" });
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
            return response.status(201).json({ updatedQuery, message: "Your query has been successfully published ..!" });
        } else {
            return response.status(400).json({ message: "A similar query has already been added by you ..!" });
        }

    } catch (error) {
        console.log(error);
        response.status(500).json({ error: 'Failed to create query' });
    }
};


export const adminResponseController = async (request: any, response: express.Response) => {
    try {
        const { queryId } = request.params;
        const { sender, message } = request.body;
        console.log('QueryId : ', queryId);

        // Find the query by its _id
        const query = await queryModel.findOne({ _id: Object(queryId) }); // No need to wrap in Object()
        if (!query) {
            return response.status(404).json({ error: 'Query not found' });
        } else if (query?.status === "Open") {
            query.conversation.push({
                sender,
                message,
                role: request.payload?.role,
                timestamp: new Date()
            });
            await query.save();
            response.status(201).json({ query, message: "Your response has been sent to the Inquirer successfully!" });
        } else {
            response.status(500).json({ error: 'Query has been closed by the user!' });
        }
        console.log('Query in adminResponseController : ', query);


        // You can proceed with other logic after the query is found
        // Example:
        // response.status(200).json({ query });

    } catch (error) {
        response.status(500).json({ error: 'Failed to find query' });
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
        response.status(201).json({ userData: adminData, token: token, message: "Authenntication Successfull ..!" });
    } catch (err) {
        console.log("Error while user authentication Controller", err);
        response.status(500).json({ message: 'Token Not verify please login then try to access ..!' });
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
        return response.status(500).json({ message: "Invalid or expired Candidate token" });
    }
};