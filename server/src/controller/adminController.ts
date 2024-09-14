import express from 'express';
import axios from 'axios';
import { tokenGenerator, tokenVerifier } from '../utilities/jwt';
import { ADMIN_SECRET_KEY } from '../config';
import queryModel from '../model/queryModel';
import adminModel from '../model/adminModel';

interface TokenResponse {
    access_token: string;
}

const verifyGoogleToken = async (tokenResponse: TokenResponse) => {
    try {
        const result = await axios.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
                headers: {
                    Authorization: `Bearer ${tokenResponse.access_token}`,
                },
            }
        );
        console.log("result.data : ", result);
        if (result.data) {
            console.log("result.data : ", result.data);

            return result.data;
        }
        return null;
    } catch (error) {
        console.log(error);
    }
}

export const adminLoginController = async (request: express.Request, response: express.Response) => {
    try {
        const { tokenResponse } = request.body
        console.log("token : ", tokenResponse);
        const decodedToken = await verifyGoogleToken(tokenResponse);
        console.log('Decoded Token : ', decodedToken);

        if (decodedToken) {
            const { name, given_name, family_name, picture, email, email_verified } = decodedToken;
            let adminData = await adminModel.findOne({ email: email });
            console.log('adminData : ', adminData);
            if (adminData) {
                adminData.email = email;
                adminData.name = name;
                adminData.profileImg = picture;
                adminData.firstName = given_name;
                adminData.lastName = family_name;
                adminData.status = email_verified;
                await adminData.save();
                console.log('User Data Updated')
                const token = tokenGenerator({ email: adminData.email, role: adminData.role }, ADMIN_SECRET_KEY);
                console.log('Admin Token inside adminController ==> ',token);
                response.status(201).json({ userData: adminData, token: token, msg: "Logged in  Successfull ..!" });
            }
            else {
                response.status(500).json({ msg: "Wrong Admin Credentials  ..!" });
                // adminData = await adminModel.create({
                //     name: name,
                //     firstName: given_name,
                //     lastName: family_name,
                //     email: email,
                //     profileImg: picture,
                //     role: 'supportAdmin',
                //     status: email_verified,
                // });
                // console.log('user has been registered successfully ..!', adminData);
            }
        }

    } catch (error) {
        console.log(error);
        response.status(500).json({ msg: "Account Not Exist ..!" });
    }
}


export const adminViewProfileController = async (request: express.Request, response: express.Response) => {
    try {
        const email = request.body.email;
        if (!email) {
            response.status(404).json({ message: "Token not found" });
        } else {
            const adminData = await adminModel.findOne({ email });
            if (adminData?.status) {
                response.status(201).json({ adminData: adminData, msg: "This is your dersired data ..!" })
            } else {
                response.status(404).json({ adminData: null, msg: "The Account You are Trying to Acces has been Deactivated ..!" })
            }
            response.status(200).json({ adminData: adminData, msg: "Authenntication Successfull ..!" });
        }
    } catch (error) {
        console.log(error);
        response.status(500).json({ msg: "Something went wrong ..!" });
    }
}


export const adminAddContactNumberController = async (request: any, response: express.Response) => {
    try {
        const { adminEmail } = request.payload;
        const { contactNumber } = request.body;
        console.log('Hello from adminAddContactNumberController ..!');
        if (!adminEmail) {
            response.status(404).json({ message: "Token not found" });
        } else {
            const adminData = await adminModel.findOneAndUpdate(
                { email:adminEmail },
                { contactNumber },
                { new: true }
            );
            if (adminData?.status) {
                return response.status(201).json({ adminData: adminData, msg: "Contact number updated successfully!" });
            } else {
                return response.status(404).json({ adminData: null, msg: "The account you are trying to access has been deactivated!" });
            }
        }
    } catch (error) {
        console.log(error);
        response.status(500).json({ msg: "Something went wrong ..!" });

    }
}


export const adminViewRaisedQueryListController = async (request: express.Request, response: express.Response) => {
    try {
        const raisedQueries = await queryModel.find();
        console.log(`RaisedQuery by  ${raisedQueries} : `);
        if (raisedQueries) {
            return response.status(201).json({ raisedQueries: raisedQueries, msg: "Contact number updated successfully!" });
        } else {
            throw new Error('Queries not found ..!')
        }
    } catch (error) {
        console.log('Error occure in userRaiseQueryController : ', error)
        response.status(500).json({ msg: "Something went wrong ..!" });
    }
}

export const adminAddResponseToParticularQueryController = async (request: express.Request, response: express.Response) => {
    try {
        console.log('Hello from adminAddResponseToParticularQueryController');
        
        // const { userEmail, adminResponse } = request.body;
        const { queryId, adminResponse } = request.body;
        const updatedRaisedQuery = await queryModel.findOneAndUpdate(
            { _id: Object(`${queryId}`) },
            {
                $set: {
                    adminResponse: adminResponse,
                    status: 'Resolved',
                    respondedAt: new Date().toLocaleString(),
                },
            },
            { new: true }
        );
        if (!updatedRaisedQuery) {
            return response.status(404).json({ msg: "Something Went Wrong ..!" });
        }
        console.log(`Query responded by admin: ${updatedRaisedQuery}`);
        response.status(200).json({ msg: "Response added successfully", updatedRaisedQuery });
    } catch (error) {
        console.log('Error occurred in adminAddResponseToParticularQueryController:', error);
        response.status(500).json({ msg: "Something went wrong..!" });
    }
};


export const adminAuthenticationController = async (request: express.Request, response: express.Response) => {
    try {
        const token = request.body.candidate_token;
        if (!token) {
            response.status(404).json({ message: "Token not found" });
        } else {
            const payload = await tokenVerifier(token, ADMIN_SECRET_KEY);
            console.log('Payload --> ', payload);
            var result = await adminModel.findOne({ email: payload.userEmail });
            console.log('Authenntication Successfull ..!', result)
            response.status(200).json({ adminData: result, token: token, msg: "Authenntication Successfull ..!" });
        }
    } catch (err) {
        console.log("Error while user authentication Controller", err);
        response.status(203).json({ message: 'Token Not verify please login then try to access ..!' });
    }
};

// for backend
export const adminAuthenticateJWT = async (request: any, response: express.Response, next: Function) => {
    const token = request.query.adminToken;
    console.log('Token inside adminAuthenticateJWT ==> ',request.query.adminToken);
    // console.log('candidate token --> ',token);
    if (!token) {
        return response.status(401).json({ message: "Token not found" });
    }
    try {
        const payload = await tokenVerifier(token, ADMIN_SECRET_KEY);
        request.payload = payload;
        next();
    } catch (error) {
        return response.status(500).json({ message: "Invalid or expired Candidate token" });
    }
};