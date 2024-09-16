import express from 'express';
import axios from 'axios';
import userModel from '../model/userModel';
import { tokenGenerator, tokenVerifier } from '../utilities/jwt';
import { USER_SECRET_KEY } from '../config';
import queryModel from '../model/queryModel';
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

export const userLoginController = async (request: express.Request, response: express.Response) => {
    try {
        const { tokenResponse } = request.body
        console.log("tokenResponse token : ", tokenResponse);
        const decodedToken = await verifyGoogleToken(tokenResponse);
        console.log('Decoded Token : ', decodedToken);
        4
        if (decodedToken) {
            const { name, given_name, family_name, picture, email, email_verified } = decodedToken;
            let userData = await userModel.findOne({ email: email });
            console.log('userData : ', userData);
            if (userData) {
                userData.email = email;
                userData.userName = name;
                userData.profileImg = picture;
                userData.firstName = given_name;
                userData.lastName = family_name;
                userData.status = email_verified;
                await userData.save();
                console.log('User Data Updated')
                const token = tokenGenerator({ email: userData.email, role: userData.role }, USER_SECRET_KEY);
                response.status(201).json({ userData: userData, token: token, msg: "Logged in  Successfull ..!" });

            }
            else {
                throw new Error('Account Not Exist ..!');
                // userData = await userModel.create({
                //     userName: name,
                //     firstName: given_name,
                //     lastName: family_name,
                //     email: email,
                //     profileImg: picture,
                //     role: 'Student',
                //     status: email_verified,
                // });
                // console.log('user has been registered successfully ..!', userData);
            }
        }

    } catch (error) {
        console.log(error);
        response.status(500).json({ msg: "Account Not Exist ..!" });
    }
}

export const userViewProfileController = async (request: express.Request, response: express.Response) => {
    try {
        const email = request.body.email;
        if (!email) {
            response.status(404).json({ message: "Token not found" });
        } else {
            const userData = await userModel.findOne({ email });
            if (userData?.status) {
                response.status(201).json({ userData: userData, msg: "This is your dersired data ..!" })
            } else {
                response.status(404).json({ userData: null, msg: "The Account You are Trying to Acces has been Deactivated ..!" })
            }
        }
    } catch (error) {
        console.log(error);
        response.status(500).json({ msg: "Something went wrong ..!" });

    }
}

export const userAddContactNumberController = async (request: any, response: express.Response) => {
    try {
        const { userEmail } = request.payload;
        const { contactNumber } = request.body;
        console.log('Hello from userAddContactNumberController ..!');

        if (!userEmail) {
            response.status(404).json({ message: "Token not found" });
        } else {
            const userData = await userModel.findOneAndUpdate(
                { email:userEmail },
                { contactNumber },
                { new: true }
            );
            if (userData?.status) {
                return response.status(201).json({ userData: userData, msg: "Contact number updated successfully!" });
            } else {
                return response.status(404).json({ userData: null, msg: "The account you are trying to access has been deactivated!" });
            }
        }
    } catch (error) {
        console.log(error);
        response.status(500).json({ msg: "Something went wrong ..!" });

    }
}

export const userRaiseQueryController = async (request: express.Request, response: express.Response) => {
    try {
        console.log('Hellow from userRaiseQueryController ..!')
        const { userName, email, contactNumber, subject, message } = request.body;
        const queryToRaise = {
            userName: userName,
            userEmail: email,
            userContactNumber: contactNumber,
            subject: subject,
            message: message,
            adminResponse: "",
            date: new Date().toLocaleString(),
            status: "Pending"
        };
        const raisedQuery = await queryModel.create(queryToRaise);
        console.log(`RaisedQuery by  ${userName} : ${raisedQuery}`);
        response.status(201).json({ raisedQuery: raisedQuery, msg: "Your query has been sent to admin successfully ..!" });

    } catch (error) {
        console.log('Error occure in userRaiseQueryController : ', error)
        response.status(500).json({ msg: "Something went wrong ..!" });
    }
}


export const userAuthenticationController = async (request: express.Request, response: express.Response) => {
    try {
        const token = request.body.user_token;
        if (!token) {
            response.status(404).json({ message: "Token not found" });
        } else {
            const payload = await tokenVerifier(token, USER_SECRET_KEY);
            console.log('Payload --> ', payload);
            var result = await userModel.findOne({ email: payload.userEmail });
            console.log('Authenntication Successfull ..!', result)
            response.status(200).json({ userData: result, token: token, msg: "Authenntication Successfull ..!" });
        }
    } catch (err) {
        console.log("Error while user authentication Controller", err);
        response.status(203).json({ message: 'Token Not verify please login then try to access ..!' });
    }
};

// for backend
export const userAuthenticateJWT = async (request: any, response: express.Response, next: Function) => {
    const token = request.query.userToken;
    // console.log('candidate token --> ',token);
    if (!token) {
        return response.status(401).json({ message: "Token not found" });
    }
    try {
        const payload = await tokenVerifier(token, USER_SECRET_KEY);
        request.payload = payload;
        next();
    } catch (error) {
        return response.status(500).json({ message: "Invalid or expired Candidate token" });
    }
};
