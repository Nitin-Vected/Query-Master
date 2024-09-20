import express from "express";
import axios from "axios";
import userModel from "../model/userModel";
import { tokenGenerator } from "../utilities/jwt";
import {
  ADMIN_SECRET_KEY,
  GOOGLE_DECODE_TOKEN_API,
  StatusCodes,
  USER_SECRET_KEY,
} from "../config";
interface TokenResponse {
  access_token: string;
}
const verifyGoogleToken = async (tokenResponse: TokenResponse) => {
  try {
    const result = await axios.get(`${GOOGLE_DECODE_TOKEN_API}`, {
      headers: {
        Authorization: `Bearer ${tokenResponse.access_token}`,
      },
    });
    if (result.data) {
      return result.data;
    }
    return null;
  } catch (error) {
    console.log(error);
  }
};

export const loginController = async (
  request: express.Request,
  response: express.Response
) => {
  try {
    const { tokenResponse } = request.body;
    const decodedToken = await verifyGoogleToken(tokenResponse);

    if (decodedToken) {
      const { name, given_name, family_name, picture, email, email_verified } =
        decodedToken;
      let userData = await userModel.findOne({ email: email });
      if (userData) {
        userData.email = email;
        userData.name = name;
        userData.profileImg = picture;
        userData.firstName = given_name;
        userData.lastName = family_name;
        userData.status = email_verified;
        await userData.save();
        if (userData.status === "true") {
          const payload = {
            name,
            email,
            role: userData.role,
            googleToken: tokenResponse?.access_token,
            status: userData.status,
          };

          let token;
          if (userData.role === "Student") {
            token = tokenGenerator(payload, USER_SECRET_KEY);
          } else {
            token = tokenGenerator(payload, ADMIN_SECRET_KEY);
          }

          response.status(StatusCodes.CREATED).json({
            userData: userData,
            token: token,
            message: "Login Successful!",
          });
        } else {
          response
            .status(StatusCodes.UNAUTHORIZED)
            .json({
              message:
                "Account not verified. Please verify your account to login.",
            });
        }
      } else {
        throw new Error("Account Not Exist ..!");
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
};
