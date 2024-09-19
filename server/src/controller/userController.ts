import express, { Request, Response, NextFunction } from 'express';
import userModel from '../model/userModel';
import { tokenVerifier } from '../utilities/jwt';
import { StatusCodes, USER_SECRET_KEY } from '../config';
import queryModel from '../model/queryModel';

interface CustomRequest extends Request {
    payload: {
        email: string;
        role: string;
        token: string;
    };
}

export const userViewProfileController = async (request: CustomRequest, response: Response, next: NextFunction) => {
    try {
        let email = request.payload?.email;
        if (!email) {
            return response.status(StatusCodes.UNAUTHORIZED).json({ message: "Token not found" });
        }

        const result = await userModel.findOne({ email });
        console.log('ContactNumber', result);

        const userData = {
            name: result?.name,
            email: result?.email,
            contactNumber: result?.contactNumber,
            role: result?.role,
            profileImg: result?.profileImg
        };

        if (result?.status) {
            response.status(StatusCodes.OK).json({ userData: userData, message: "UserData fetched successfully ..!" });
        } else {
            response.status(StatusCodes.BAD_REQUEST).json({ userData: null, message: "The Account You are Trying to Access has been Deactivated ..!" });
        }
    } catch (error) {
        console.log(error);
        next(error); // Use next for proper error handling
    }
};

export const userAddContactNumberController = async (request: any, response: express.Response) => {
    try {
        const userEmail = request.payload.email;
        const { contactNumber } = request.body;
        // console.log('Hello from userAddContactNumberController ..!',userEmail,'  ',contactNumber);
        if (!userEmail) {
            response.status(StatusCodes.UNAUTHORIZED).json({ message: "Token not found" });
        } else {
            const result = await userModel.updateOne(
                { email: userEmail },
                { $set: { contactNumber: contactNumber } },
            );
            console.log('ContactNumber updated ', result)

            if (result?.acknowledged) {
                response.status(StatusCodes.OK).json({ message: "Contact number updated successfully ..!" });
            } else {
                response.status(StatusCodes.UNAUTHORIZED).json({ message: "The account you are trying to access has been deactivated!" });
            }
        }
    } catch (error) {
        console.log(error);
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong ..!" });

    }
}

export const userRaiseQueryController = async (request: any, response: express.Response) => {
    try {
        const { name, email, role } = request.payload;
        const { subject, message } = request.body;

        const similaryExistingQuery = await queryModel.findOne({ userEmail: email, userRole: role, subject, message });

        if (!similaryExistingQuery) {
            console.log('Inside if block of userRaiseQueryController ..!')
            const updatedQuery = await queryModel.create({
                userEmail: email,
                userRole: role,
                subject,
                message,
                conversation: [{
                    sender: name,
                    email: email,
                    message: message,
                    role: role,
                    timestamp: new Date()
                }]
            });
            if (updatedQuery) {
                response.status(StatusCodes.OK).json({ queryId: updatedQuery._id, message: "Your query has been successfully published ..!" });
            } else {
                response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ userData: null, message: "Something went wrong ..!" })
            }
        } else {
            response.status(StatusCodes.ALREADY_EXIST).json({ message: "A similar query has already been added by you ..!" });
        }

    } catch (error) {
        console.log(error);
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to create query' });
    }
};

export const userViewMyQueriesController = async (request: any, response: express.Response) => {
    try {
        const { email, role } = request.payload;
        const myQueries = await queryModel.find({ userEmail: email, userRole: role })
            .sort({ updatedAt: -1, createdAt: -1 });
        console.log(`RaisedQuery by  ${myQueries} : `);
        if (myQueries) {
            response.status(StatusCodes.OK).json({ myQueries: myQueries, message: "These are the recently raised queries by you ..!" });
        } else {
            response.status(StatusCodes.NOT_FOUND).json({ myQueries: null, message: "No Queries are added by You ..!" });
        }
    } catch (error) {
        console.log('Error occure in userRaiseQueryController : ', error)
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong ..!" });
    }
}

export const userAddCommentController = async (request: any, response: express.Response) => {
    try {
        const { name, email, role } = request.payload;
        const { queryId } = request.params;
        const { message } = request.body;
        console.log('QueryId : ', queryId);

        // Find the query by its _id
        const query = await queryModel.findOne({ _id: Object(queryId) });
        if (!query) {
            response.status(StatusCodes.NOT_FOUND).json({ error: 'Query not found' });
        } else if (query.status === "Open" || query.status === "In Progress") {
            console.log('Query ', query);
            query.conversation.push({
                sender: name,
                email: email,
                message,
                role: role,
                timestamp: new Date()
            });
            await query.save();
            response.status(StatusCodes.OK).json({ message: "Your response has been sent to the trail successfully!" });
        } else {
            response.status(StatusCodes.BAD_REQUEST).json({ error: 'Query has been closed by the user ..!' });
        }
        console.log('Query in userAddCommentController : ', query);

    } catch (error) {
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to find query' });
    }
};

export const userManageQueryStatusController = async (request: any, response: express.Response) => {
    try {
        const { email } = request.payload;
        const { queryId, status } = request.params;
        console.log('query id : ', queryId, '   query status : ', status)
        if (!queryId || !status) {
            response.status(StatusCodes.BAD_REQUEST).json({ error: 'Query ID and status are required' });
        }
        const result = await queryModel.updateOne(
            { _id: Object(queryId), userEmail: email },
            { $set: { status: status } },
        );
        console.log('Query Status :', result)

        if (!result?.acknowledged) {
            response.status(StatusCodes.NOT_FOUND).json({ error: 'Query not found or email mismatch' });
        }
        console.log('Query status updated successfully');
        response.status(StatusCodes.CREATED).json({ message: "Query status updated successfully" });
    } catch (error) {
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to find query' });
    }
};

export const userAuthenticationController = async (request: any, response: express.Response) => {
    try {
        const authHeader = request.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return response.status(StatusCodes.UNAUTHORIZED).json({ message: 'Authorization token is missing or invalid' });
        }
        const token = authHeader.split(' ')[1];
        console.log('Token : ', token);
        const payload = await tokenVerifier(token, USER_SECRET_KEY);
        const result = await userModel.findOne({ email: payload.email });
        console.log('userData : ', result, '  token in userAuthenticationController : ', token);
        const userData = {
            name: result?.name,
            email: result?.email,
            contactNumber: result?.contactNumber,
            role: result?.role,
            profileImg: result?.profileImg
        }
        response.status(StatusCodes.OK).json({ userData: userData, token: token, message: "Authenntication Successfull ..!" });
    } catch (err) {
        console.log("Error while user authentication Controller", err);
        response.status(StatusCodes.UNAUTHORIZED).json({ message: 'Token Not verify please login then try to access ..!' });
    }
};

export const userGetQueryDataController = async (request: express.Request, response: express.Response) => {
    try {
        const { queryId } = request.params;
        const queryData = await queryModel.findOne({ _id: queryId });
        if (queryData) {
            response.status(StatusCodes.OK).json({ queryData: queryData, message: "Query has been f ..!" });
        } else {
            response.status(StatusCodes.NOT_FOUND).json({ queryData: null, message: "Query Not found with this Id  ..!" });
        }
    } catch (err) {
        console.log("Error while user authentication Controller", err);
        response.status(StatusCodes.UNAUTHORIZED).json({ message: 'Token Not verify please login then try to access ..!' });
    }
};

// for backend
export const userAuthenticateJWT = async (request: any, response: express.Response, next: Function) => {
    try {
        const authHeader = request.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return response.status(StatusCodes.UNAUTHORIZED).json({ message: 'Authorization token is missing or invalid' });
        }
        const token = authHeader.split(' ')[1];
        console.log('Token : ', token);
        const payload = await tokenVerifier(token, USER_SECRET_KEY);
        request.payload = payload;
        next();
    } catch (error) {
        response.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid or expired User token" });
    }
};