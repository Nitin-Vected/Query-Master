import express from "express";
import axios from "axios";
import userModel from "../model/userModel";
import { tokenGenerator } from "../utilities/jwt";
import {
  generateUniqueId,
  GOOGLE_DECODE_TOKEN_API,
  StatusCodes,
} from "../config";
import roleModel from "../model/roleModel";

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
    return result.data || null;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
};

// export const loginController = async (
//   request: express.Request,
//   response: express.Response
// ) => {
//   try {
//     const { tokenResponse } = request.body;
//     const decodedToken = await verifyGoogleToken(tokenResponse);
//     if (decodedToken) {
//       const { given_name, family_name, picture, email, email_verified } = decodedToken;
//       const user = await userModel.findOne({ email: email }, { _id: 0 });
//       if (user && user?.status) {
//         user.email = email;
//         user.profileImg = picture;
//         user.firstName = given_name;
//         user.lastName = family_name;
//         user.status = email_verified;
//         await user.save();

//         const roleDetails = await roleModel.findOne({ roleId: user.roleId });
//         const result = {
//           name: given_name + " " + family_name,
//           email: user.email,
//           contactNumber: user.contactNumber,
//           profileImg: user.profileImg,
//           role: roleDetails ? roleDetails.roleName : null,
//         };

//         console.log("result ==> ", result);

//         const payload = {
//           name: given_name + " " + family_name,
//           email,
//           roleId: user?.roleId,
//           roleName: roleDetails ? roleDetails.roleName : "Not mentioned",
//           googleToken: tokenResponse?.access_token,
//           status: user?.status,
//         };

//         let token = tokenGenerator(payload);

//         response.status(StatusCodes.CREATED).json({
//           userData: result,
//           token: token,
//           message: "Login Successful!",
//         });
//       } else {
//         response.status(StatusCodes.NOT_FOUND).json({ message: "Account Not Exist!" });
//       }
//     }
//   } catch (error) {
//     console.error(error);
//     response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
//   }
// };

export const loginController = async (
  request: express.Request,
  response: express.Response
) => {
  try {
    const { tokenResponse } = request.body;
    const decodedToken = await verifyGoogleToken(tokenResponse);

    if (decodedToken) {
      const { given_name, family_name, picture, email, email_verified } = decodedToken;

      let user = await userModel.findOne({ email: email }, { _id: 0 });

      if (user && user?.status) {
        user.email = email;
        user.profileImg = picture;
        user.firstName = given_name;
        user.lastName = family_name;
        user.status = email_verified;
        await user.save();
      } else {
        const userId = await generateUniqueId('user');
        user = await userModel.create({
          userId,
          email,
          firstName: given_name,
          lastName: family_name,
          profileImg: picture,
          status: email_verified,
          roleId: "ROLEGnd3oTjQX01", 
          contactNumber: "6260658118", 
        });
      }

      const roleDetails = await roleModel.findOne({ roleId: user.roleId });
      const result = {
        name: given_name + " " + family_name,
        email: user.email,
        contactNumber: user.contactNumber,
        profileImg: user.profileImg,
        role: roleDetails ? roleDetails.roleName : null,
      };

      console.log("result ==> ", result);

      const payload = {
        name: given_name + " " + family_name,
        email,
        roleId: user?.roleId,
        roleName: roleDetails ? roleDetails.roleName : "Not mentioned",
        googleToken: tokenResponse?.access_token,
        status: user?.status,
      };

      let token = tokenGenerator(payload);

      response.status(StatusCodes.CREATED).json({
        userData: result,
        token: token,
        message: "Login Successful!",
      });
    } else {
      response.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid Google token!" });
    }
  } catch (error) {
    console.error(error);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
  }
};
