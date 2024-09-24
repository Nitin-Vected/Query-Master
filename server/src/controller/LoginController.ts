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
      const { given_name, family_name, picture, email, email_verified } =
        decodedToken;
      let result = await userModel.findOne({ email: email });
      if (result) {
        result.email = email;
        result.profileImg = picture;
        result.firstName = given_name;
        result.lastName = family_name;
        result.status = email_verified;
        await result.save();
        if (result.status === "true") {
          const payload = {
            name: given_name + " " + family_name,
            email,
            role: result.role,
            googleToken: tokenResponse?.access_token,
            status: result.status,
          };

          let token;
          if (result.role === "Student") {
            token = tokenGenerator(payload, USER_SECRET_KEY);
          } else {
            token = tokenGenerator(payload, ADMIN_SECRET_KEY);
          }

          const userData = {
            name: given_name + " " + family_name,
            email: result?.email,
            contactNumber: result?.contactNumber,
            role: result?.role,
            profileImg: result?.profileImg,
          };

          response.status(StatusCodes.CREATED).json({
            userData: userData,
            token: token,
            message: "Login Successful!",
          });
        } else {
          response.status(StatusCodes.UNAUTHORIZED).json({
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
