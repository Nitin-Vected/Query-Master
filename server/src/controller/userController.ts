import express from 'express';
import userModel from '../model/userModel';
import { tokenVerifier } from '../utilities/jwt';
import { USER_SECRET_KEY } from '../config';
import queryModel from '../model/queryModel';;

export const userViewProfileController = async (request: any, response: express.Response) => {
    try {
        const email = request.payload.email;
        if (!email) {
            response.status(404).json({ message: "Token not found" });
        } else {
            const userData = await userModel.findOne({ email });
            if (userData?.status) {
                response.status(201).json({ userData: userData, message: "This is your dersired data ..!" })
            } else {
                response.status(404).json({ userData: null, message: "The Account You are Trying to Acces has been Deactivated ..!" })
            }
        }
    } catch (error) {
        console.log(error);
        response.status(500).json({ message: "Something went wrong ..!" });

    }
}

export const userAddContactNumberController = async (request: any, response: express.Response) => {
    try {
        const userEmail = request.payload.email;
        const { contactNumber } = request.body;
        // console.log('Hello from userAddContactNumberController ..!',userEmail,'  ',contactNumber);

        if (!userEmail) {
            response.status(404).json({ message: "Token not found" });
        } else {
            const userData = await userModel.findOneAndUpdate(
                { email: userEmail },
                { contactNumber },
                { new: true }
            );
            if (userData?.status) {
                return response.status(201).json({ userData: userData, message: "Contact number updated successfully!" });
            } else {
                return response.status(404).json({ userData: null, message: "The account you are trying to access has been deactivated!" });
            }
        }
    } catch (error) {
        console.log(error);
        response.status(500).json({ message: "Something went wrong ..!" });

    }
}

export const userRaiseQueryController = async (request: any, response: express.Response) => {
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

// according to pagination page = current Page Number, limit = number of Documents
export const userGetQueriesController = async (request: any, response: express.Response) => {
    try {
        const { email, role } = request.payload;
        const page = parseInt(request.query.page) || 1;
        const limit = parseInt(request.query.limit) || 4;

        const numberOfDocsToSkip = (page - 1) * limit;
        const total = await queryModel.countDocuments(); // 3
        const myQueries = await queryModel.find({ userEmail: email, userRole: role }).skip(numberOfDocsToSkip).limit(limit);
        console.log('My Queries : ',myQueries);
        console.log('Page  : ',page);
        console.log('limit : ',limit);
        console.log('Total Queries : ', total);

        response.json({
            page,
            limit,
            total,
            myQueries: myQueries
        });

    } catch (error) {
        console.log(error);
        response.status(500).json({ error: 'Failed to create query' });
    }
};

export const userViewMyQueriesController = async (request: any, response: express.Response) => {
    try {
        const { email, role } = request.payload;
        const myQueries = await queryModel.find({ userEmail: email, userRole: role });
        console.log(`RaisedQuery by  ${myQueries} : `);
        if (myQueries) {
            return response.status(201).json({ myQueries: myQueries, message: "These are the recently raised queries by you ..!" });
        } else {
            throw new Error('Queries not found ..!')
        }
    } catch (error) {
        console.log('Error occure in userRaiseQueryController : ', error)
        response.status(500).json({ message: "Something went wrong ..!" });
    }
}

export const userAuthenticationController = async (request: any, response: express.Response) => {
    try {
        const authHeader = request.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return response.status(401).json({ message: 'Authorization token is missing or invalid' });
        }
        const token = authHeader.split(' ')[1];
        console.log('Token : ', token);
        const payload = await tokenVerifier(token, USER_SECRET_KEY);
        const userData = await userModel.findOne({ email: payload.email });
        console.log('userData : ', userData, '  token in userAuthenticationController : ', token)
        response.status(201).json({ userData: userData, token: token, message: "Authenntication Successfull ..!" });
    } catch (err) {
        console.log("Error while user authentication Controller", err);
        response.status(500).json({ message: 'Token Not verify please login then try to access ..!' });
    }
};

// for backend
export const userAuthenticateJWT = async (request: any, response: express.Response, next: Function) => {
    try {
        const authHeader = request.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return response.status(401).json({ message: 'Authorization token is missing or invalid' });
        }
        const token = authHeader.split(' ')[1];
        console.log('Token : ', token);
        const payload = await tokenVerifier(token, USER_SECRET_KEY);
        request.payload = payload;
        next();
    } catch (error) {
        return response.status(500).json({ message: "Invalid or expired Candidate token" });
    }
};