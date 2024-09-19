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

export const adminViewStudentListController = async (request: express.Request, response: express.Response) => {
    try {
        const studentList = await userModel.find({ role: "Student" });
        if (studentList && studentList.length > 0) {
            response.status(StatusCodes.OK).json({
                studentList: studentList,
                message: "These are the registered students!"
            });
        } else {
            response.status(StatusCodes.NOT_FOUND).json({ message: "Student list not found!" });
        }

    } catch (error) {
        console.log('Error occure in userRaiseQueryController : ', error)
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong ..!" });
    }
}

export const adminViewSupportAdminListController = async (request: express.Request, response: express.Response) => {
    try {
        const adminList = await userModel.find({ role: "SupportAdmin" });
        if (adminList && adminList.length > 0) {
            response.status(StatusCodes.OK).json({
                adminList: adminList,
                message: "These are the registered support admins ..!"
            });
        } else {
            response.status(StatusCodes.NOT_FOUND).json({ message: "Student list not found!" });
        }

    } catch (error) {
        console.log('Error occure in userRaiseQueryController : ', error)
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong ..!" });
    }
}

export const adminViewUserListController = async (request: express.Request, response: express.Response) => {
    try {
        const userList = await userModel.find();
        const totalNumberOfUser = await userModel.countDocuments();
        // console.log(`userList: ${userList}`);
        console.log(`Total number of user: ${totalNumberOfUser}`);

        if (userList && userList.length > 0) {
            response.status(StatusCodes.OK).json({
                userList: userList,
                totalNumberOfUser: totalNumberOfUser,
                message: "These are the registered Users ..!"
            });
        } else {
            response.status(StatusCodes.NOT_FOUND).json({ message: "User list not found ..!" });
        }

    } catch (error) {
        console.log('Error occure in adminViewUserListController : ', error)
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong ..!" });
    }
}

export const adminManageStudentStatusController = async (request: any, response: express.Response) => {
    try {
        const { studentId, action } = request.params;
        console.log('student id : ', studentId, '  action : ', action)
        if (!studentId || !action) {
            return response.status(StatusCodes.BAD_REQUEST).json({ error: 'Student ID and action are required' });
        }

        const status = (action === 'true') ? true : (action === 'false') ? false : null;
        if (status === null) {
            return response.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid action. Use true or false.' });
        }

        const studentData = await userModel.findOneAndUpdate(
            { _id: Object(studentId), role: "Student" },
            { status: action },
            { new: true }
        );
        // const studentData = await userModel.findOne({ _id: Object(studentId) })
        if (studentData) {
            console.log('Student Status updated  :', studentData?.status)
            const studentList = await userModel.find({ role: "Student" });
            response.status(StatusCodes.CREATED).json({ studentList: studentList, studentData: studentData, message: "Student status updated successfully here is the Student List" });
        } else {
            return response.status(StatusCodes.NOT_FOUND).json({ error: 'Student not found or _id mismatch' });
        }
    } catch (error) {
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to find query' });
    }
};

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


export const adminRaiseQueryController = async (request: any, response: express.Response) => {
    try {
        const { name, email, role } = request.payload;
        const { subject, message } = request.body;

        if (!subject || !message) {
            return response.status(StatusCodes.BAD_REQUEST).json({ message: "Subject and Message are required  ..!" });
        }
        const similaryExistingQuery = await queryModel.findOne({ userEmail: email, userRole: role, subject, message });
        if (!similaryExistingQuery) {
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
            return response.status(StatusCodes.CREATED).json({ updatedQuery, message: "Your query has been successfully published ..!" });
        } else {
            return response.status(StatusCodes.ALREADY_EXIST).json({ message: "A similar query has already been added by you ..!" });
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
            console.log('Name ==> ', request.payload.name);
            console.log('Email ==> ', request.payload.email);
            console.log('Query ', query);
            query.conversation.push({
                sender: name,
                email: email,
                message,
                role: role,
                timestamp: new Date()
            });
            await query.save();
            console.log('After conversation.push:', query.conversation);

            // student's should not see the admin's email or role instead "Support Admin" will be shown in sender and email
            const queryResponse = query.toObject();
            queryResponse.conversation = queryResponse.conversation.map((conv: any) => ({
                sender: conv.role === "SupportAdmin" ? "Support Admin" : conv.sender,
                email: conv.role === "SupportAdmin" ? "Support Admin" : conv.email,
                message: conv.message,
                role: conv.role,
                timestamp: conv.timestamp
            }));

            response.status(StatusCodes.CREATED).json({ query: queryResponse, message: "Your response has been sent to the Inquirer successfully!" });
        } else {
            response.status(StatusCodes.BAD_REQUEST).json({ error: 'Query has been closed by the user!' });
        }
        console.log('Query in adminResponseController : ', query);

    } catch (error) {
        console.log(error);
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to find query' });
    }
};




export const adminManageQueryStatusController = async (
  request: any,
  response: express.Response
) => {
  try {
    const { name, email, role } = request.payload;
    const { queryId, status } = request.params;
    const { userEmail } = request.body;
    console.log("query id : ", queryId, userEmail);
    if (!queryId || !status) {
      return response
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Query ID and status are required" });
    }

    const query = await queryModel.findOneAndUpdate(
      { _id: Object(queryId), userEmail: userEmail },
      { status: status },
      { new: true }
    );
    console.log("Query :", query);

    if (!query) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Query not found or email mismatch" });
    }

    console.log("Query status updated successfully");
    response
      .status(StatusCodes.CREATED)
      .json({ message: "Query status updated to Closed successfully", query });
  } catch (error) {
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to find query" });
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