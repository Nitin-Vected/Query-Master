import express from 'express';
import axios from 'axios';
import userModel from '../model/userModel';
import { tokenGenerator, tokenVerifier } from '../utilities/jwt';
import { ADMIN_SECRET_KEY, USER_SECRET_KEY } from '../config';
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

export const loginController = async (request: express.Request, response: express.Response) => {
    try {
        const { tokenResponse } = request.body
        // console.log("tokenResponse token : ", tokenResponse);
        const decodedToken = await verifyGoogleToken(tokenResponse);
        console.log('Decoded Token : ', decodedToken);

        if (decodedToken) {
            const { name, given_name, family_name, picture, email, email_verified } = decodedToken;
            let userData = await userModel.findOne({ email: email });
            console.log('userData : ', userData);
            if (userData) {
                userData.email = email;
                userData.name = name;
                userData.profileImg = picture;
                userData.firstName = given_name;
                userData.lastName = family_name;
                userData.status = email_verified;
                await userData.save();
                console.log('User Data Updated');
                const payload = {
                    name,
                    email,
                    role: userData.role,
                    status: userData.status,
                }
                if(userData.role === "Student"){
                    const token = tokenGenerator(payload, USER_SECRET_KEY);
                    response.status(201).json({ userData: userData, token: token, message: "Logged in  Successfull ..!" });
                }else{
                    console.log('UserData checking : ',userData);
                    const token = tokenGenerator(payload, ADMIN_SECRET_KEY);
                    response.status(201).json({ userData: userData, token: token, message: "Logged in  Successfull ..!" });
                }
            }
            else {
                throw new Error('Account Not Exist ..!');
                // userData = await userModel.create({
                //     name: name,
                //     firstName: given_name,
                //     lastName: family_name,
                //     email: email,
                //     profileImg: picture,
                //     role: 'SupportAdmin',
                //     status: email_verified,
                // });
                // console.log('user has been registered successfully ..!', userData);
            }
        }

    } catch (error) {
        console.log(error);
        response.status(500).json({ message: "Account Not Exist ..!" });
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
            let adminData = await userModel.findOne({ email: email });
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
                const payload = {
                    name,
                    email,
                    role: adminData.role,
                    status: adminData.status,
                }
                const token = tokenGenerator(payload, ADMIN_SECRET_KEY);
                console.log('Admin Token inside adminController ==> ', token);
                response.status(201).json({ userData: adminData, token: token, message: "Logged in  Successfull ..!" });
            }
            else {
                response.status(500).json({ message: "Wrong Admin Credentials  ..!" });
                // adminData = await userModel.create({
                //     name: name,
                //     firstName: given_name,
                //     lastName: family_name,
                //     email: email,
                //     profileImg: picture,
                //     role: 'SupportAdmin',
                //     status: email_verified,
                // });
                // console.log('user has been registered successfully ..!', adminData);
                // const payload = {
                //     name,
                //     email,
                //     role: adminData.role,
                //     status: adminData.status,
                // }
                // const token = tokenGenerator(payload, ADMIN_SECRET_KEY);
                // response.status(201).json({ userData: adminData, token: token, message: "SupportAdmin has been Registered Successfully ..!" });
            }
        }

    } catch (error) {
        console.log(error);
        response.status(500).json({ message: "Account Not Exist ..!" });
    }
}