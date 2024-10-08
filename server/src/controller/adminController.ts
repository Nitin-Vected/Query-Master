import { tokenVerifier } from "../utilities/jwt";
import { Request, Response } from "express";

import {
  ADMIN_SECRET_KEY,
  CustomRequest,
  generateUniqueId,
  StatusCodes,
  STUDENT_ROLE_ID,
  COUNSELLOR_ROLE_ID,
} from "../config";
import userModel from "../model/userModel";
import roleModel from "../model/roleModel";
import statusModel from "../model/statusModel";
import studentModel from "../model/studentModel";
import channelModel from "../model/channelModel";
import productModel from "../model/productModel";
import accessRights from "../model/accessRightsModel";

export const adminAuthenticationController = async (
  request: Request,
  response: Response
) => {
  try {
    const authHeader = request.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return response
        .status(401)
        .json({ message: "Authorization token is missing or invalid" });
    }
    const token = authHeader.split(" ")[1];
    const payload = await tokenVerifier(token, ADMIN_SECRET_KEY);
    const result = await userModel.findOne({
      email: payload.email,
      role: payload.roleName,
    });
    const adminData = {
      name: result?.firstName + " " + result?.lastName,
      email: result?.email,
      contactNumber: result?.contactNumber,
      role: payload?.roleName,
      profileImg: result?.profileImg,
    };
    if (result?.status) {
      response.status(StatusCodes.OK).json({
        userData: adminData,
        token: token,
        message: "Authenntication Successfull ..!",
      });
    } else {
      response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Something went wrong ..!" });
    }
  } catch (err) {
    console.log("Error while admin authentication Controller", err);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Token Not verify please login then try to access ..!",
    });
  }
};

export const adminViewProfileController = async (
  request: CustomRequest,
  response: Response
) => {
  try {
    if (!request.payload) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "User payload is missing or invalid." });
    }
    const { userId, roleName } = request.payload;
    if (!userId) {
      response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Token not found" });
    } else {
      const result = await userModel.findOne({ id: userId });
      console.log("result : ", result);
      const adminData = {
        name: result?.firstName + " " + result?.lastName,
        email: result?.email,
        contactNumber: result?.contactNumber,
        role: roleName,
        profileImg: result?.profileImg,
      };
      if (result?.status) {
        response.status(StatusCodes.OK).json({
          adminData: adminData,
          message: "This is your dersired data ..!",
        });
      } else {
        response.status(StatusCodes.NOT_FOUND).json({
          adminData: null,
          message:
            "The Account You are Trying to Acces has been Deactivated ..!",
        });
      }
    }
  } catch (error) {
    console.log(error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};

export const adminViewStudentListController = async (
  request: Request,
  response: Response
) => {
  try {
    const studentList = await studentModel.aggregate([
      {
        $lookup: {
          from: "user",
          localField: "userId",
          foreignField: "userId",
          as: "profileDetails",
        },
      },
      { $unwind: "$profileDetails" },
      {
        $project: {
          _id: 0,
          "profileDetails._id": 0,
          "profileDetails.userId": 0,
          "profileDetails.createdAt": 0,
          "profileDetails.updatedAt": 0,
        },
      },
    ]);
    if (studentList && studentList.length > 0) {
      response.status(StatusCodes.OK).json({
        studentList,
        message: "These are the registered students!",
      });
    }
    response.status(StatusCodes.OK).json({
      studentList,
      message: "There are no registered students!",
    });
  } catch (error) {
    console.log("Error occurred in adminViewStudentListController: ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};

export const adminViewConsellorListController = async (
  request: Request,
  response: Response
) => {
  try {
    const consellorList = await userModel
      .find({ roleId: COUNSELLOR_ROLE_ID }, { _id: 0 })
      .select("name email contactNumber role profileImg status")
      .sort({ updatedAt: -1, createdAt: -1 });

    if (consellorList && consellorList.length > 0) {
      response.status(StatusCodes.OK).json({
        consellorList: consellorList,
        message: "These are the registered consellors..!",
      });
    } else {
      response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "consellor list not found!" });
    }
  } catch (error) {
    console.log("Error occure in adminViewConsellorListController : ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};

export const adminViewUserListController = async (
  request: Request,
  response: Response
) => {
  try {
    const userList = await userModel
      .find({}, { _id: 0 })
      .select("name email contactNumber role profileImg status")
      .sort({ updatedAt: -1, createdAt: -1 });

    if (userList && userList.length > 0) {
      response.status(StatusCodes.OK).json({
        userList: userList,
        message: "Registered user fetched successfully  ..!",
      });
    } else {
      response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User list not found ..!" });
    }
  } catch (error) {
    console.log("Error occure in adminViewUserListController : ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};

export const adminAddNewRoleController = async (
  request: CustomRequest,
  response: Response
) => {
  try {
    if (!request.payload) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "User payload is missing or invalid." });
    }
    const { email, roleName } = request.payload;
    console.log("request.payload ", request.payload);

    const { userRole, access } = request.body;
    const roleId = await generateUniqueId(roleModel, "ROLE");
    const data = {
      id: roleId,
      name: userRole,
      access,
      createdBy: email,
      updatedBy: email,
      createrRole: roleName,
      updaterRole: roleName,
    };
    console.log("data ", data);

    const newRole = await roleModel.create(data);
    if (newRole) {
      response.status(StatusCodes.CREATED).json({
        message: "Role Added successfully ..!",
      });
    } else {
      response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something Went Wrong ..!",
      });
    }
  } catch (error) {
    console.error("Error in adminAddNewRoleController:", error);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong!",
    });
  }
};

export const adminGetAllRolesController = async (
  request: CustomRequest,
  response: Response
) => {
  try {
    const roleList = await roleModel
      .find({}, { _id: 0 })
      .select("id name access")
      .sort({ updatedAt: -1, createdAt: -1 });

    if (roleList && roleList.length > 0) {
      response.status(StatusCodes.OK).json({
        roleList: roleList,
        message: "Roles fetched successfully  ..!",
      });
    } else {
      response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Role list not found ..!" });
    }
  } catch (error) {
    console.log("Error occure in adminGetAllRolesController : ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};

export const adminGetRoleByIdController = async (
  request: Request,
  response: Response
) => {
  const { roleId } = request.params;
  try {
    const role = await roleModel.findOne({ id: roleId });
    if (!role) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Role not found" });
    }
    response
      .status(StatusCodes.OK)
      .json({ data: role, message: "Role of given roleId : " });
  } catch (error) {
    console.log("Error occured in getRoleById : ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};

export const adminAddNewStatusController = async (
  request: CustomRequest,
  response: Response
) => {
  try {
    if (!request.payload) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "User payload is missing or invalid." });
    }
    const { email, roleName } = request.payload;
    console.log("request.payload ", request.payload);

    const { statusName } = request.body;
    const statusId = await generateUniqueId(statusModel, "STATUS");
    const data = {
      id: statusId,
      name: statusName,
      createdBy: email,
      updatedBy: email,
      createrRole: roleName,
      updaterRole: roleName,
    };

    const newStatus = await statusModel.create(data);
    if (newStatus) {
      response.status(StatusCodes.CREATED).json({
        message: "Status Added successfully ..!",
      });
    } else {
      response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something Went Wrong ..!",
      });
    }
  } catch (error) {
    console.error("Error in adminAddNewStatusController:", error);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong!",
    });
  }
};

export const adminGetAllStatusController = async (
  request: CustomRequest,
  response: Response
) => {
  try {
    const statusList = await statusModel
      .find({}, { _id: 0 })
      .select("id name")
      .sort({ updatedAt: -1, createdAt: -1 });

    if (statusList && statusList.length > 0) {
      response.status(StatusCodes.OK).json({
        statusList: statusList,
        message: "Status fetched successfully  ..!",
      });
    } else {
      response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Status list not found ..!" });
    }
  } catch (error) {
    console.log("Error occure in adminGetAllStatusController : ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};

export const adminGetStatusByIdController = async (
  request: Request,
  response: Response
) => {
  const { statusId } = request.params;
  try {
    const status = await statusModel.findOne({ id: statusId });
    if (!status) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Status not found" });
    }
    response
      .status(StatusCodes.OK)
      .json({ data: status, message: "Status of given statusId : " });
  } catch (error) {
    console.log("Error occured in getStatusById : ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};

export const adminAddNewChannelController = async (
  request: CustomRequest,
  response: Response
) => {
  try {
    if (!request.payload) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "User payload is missing or invalid." });
    }
    const { email, roleName } = request.payload;
    const { channelName } = request.body;

    const channelId = await generateUniqueId(channelModel, "CHANNEL");
    const data = {
      id: channelId,
      name: channelName,
      createdBy: email,
      updatedBy: email,
      createrRole: roleName,
      updaterRole: roleName,
    };

    const newChannel = await channelModel.create(data);
    if (newChannel) {
      response.status(StatusCodes.CREATED).json({
        message: "Channel Added successfully ..!",
      });
    } else {
      response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something Went Wrong ..!",
      });
    }
  } catch (error) {
    console.error("Error in adminAddNewChannelController:", error);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong!",
    });
  }
};

export const adminGetAllChannelsController = async (
  request: CustomRequest,
  response: Response
) => {
  try {
    const chanelList = await channelModel
      .find({}, { _id: 0 })
      .select("id name")
      .sort({ updatedAt: -1, createdAt: -1 });

    if (chanelList && chanelList.length > 0) {
      response.status(StatusCodes.OK).json({
        chanelList: chanelList,
        message: "Channels fetched successfully  ..!",
      });
    } else {
      response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Channel list not found ..!" });
    }
  } catch (error) {
    console.log("Error occure in adminGetAllChannelsController : ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};

export const adminGetChannelByIdController = async (
  request: Request,
  response: Response
) => {
  const { channelId } = request.params;
  try {
    const channel = await channelModel.findOne({ id: channelId });
    if (!channel) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Channel not found" });
    }
    response
      .status(StatusCodes.OK)
      .json({ data: channel, message: "Channel of given channelId : " });
  } catch (error) {
    console.log("Error occured in getChannelById : ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};

export const adminAddNewProductController = async (
  request: CustomRequest,
  response: Response
) => {
  try {
    if (!request.payload) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "User payload is missing or invalid." });
    }
    const { email, roleName } = request.payload;
    const {
      productName,
      productCategory,
      productFees,
      productDescription,
      image,
      document,
    } = request.body;
    const productId = await generateUniqueId(productModel, "PRODUCT");
    const data = {
      id: productId,
      name: productName,
      category: productCategory,
      price: productFees,
      discountPrice: productFees,
      description: productDescription,
      assets: {
        image,
        document,
      },
      createdBy: email,
      updatedBy: email,
      createrRole: roleName,
      updaterRole: roleName,
    };
    const existingProduct = await productModel.findOne({
      productName,
      productCategory,
    });
    if (existingProduct) {
      response.status(StatusCodes.ALREADY_EXIST).json({
        message: "Product Already exist with same name and category ..!",
      });
    }
    const newProduct = await productModel.create(data);
    if (newProduct) {
      response.status(StatusCodes.CREATED).json({
        message: "Product Added successfully ..!",
      });
    } else {
      response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something Went Wrong ..!",
      });
    }
  } catch (error) {
    console.log("Error occure in adminAddNewProductController : ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};

export const adminGetAllProductController = async (
  request: CustomRequest,
  response: Response
) => {
  try {
    const productList = await productModel
      .find({}, { _id: 0 })
      .select("productName productCategory productFees productDescription ")
      .sort({ updatedAt: -1, createdAt: -1 });
    console.log(productList);

    if (productList && productList.length > 0) {
      response.status(StatusCodes.OK).json({
        productList: productList,
        message: "Products fetched successfully  ..!",
      });
    } else {
      response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Product list not found ..!" });
    }
  } catch (error) {
    console.log("Error occure in adminGetAllProductController : ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};

export const adminGetProductByIdController = async (
  request: Request,
  response: Response
) => {
  const { productId } = request.params;
  try {
    const product = await productModel.findOne({ id: productId }, { _id: 0 });
    if (!product) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Product not found" });
    }
    response
      .status(200)
      .json({ data: product, message: "Product of given id" });
  } catch (error) {
    console.log("Error occured in getProductById : ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};

export const adminUpdateProductByIdController = async (
  request: CustomRequest,
  response: Response
) => {
  try {
    if (!request.payload) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "User payload is missing or invalid." });
    }

    const { email, roleName } = request.payload;
    const { productId } = request.params; // Your custom product ID, e.g., 'PRODUCT0001'
    const {
      productName,
      productCategory,
      productFees,
      productDescription,
      image,
      document,
    } = request.body;

    // Use findOne to query based on custom productId
    const existingProduct = await productModel.findOne({ id: productId });

    if (!existingProduct) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Product not found." });
    }

    const updatedFields: any = {};

    if (productName) updatedFields.name = productName;
    if (productCategory) updatedFields.category = productCategory;
    if (productFees) {
      updatedFields.price = productFees;
      updatedFields.discountPrice = productFees;
    }
    if (productDescription) updatedFields.description = productDescription;
    if (image || document) {
      updatedFields.assets = {
        image: image || existingProduct.assets.image,
        document: document || existingProduct.assets.document,
      };
    }

    updatedFields.updatedBy = email;
    updatedFields.updaterRole = roleName;

    // Update using the custom productId
    const updatedProduct = await productModel.findOneAndUpdate(
      { id: productId },
      updatedFields,
      { new: true }
    );

    if (updatedProduct) {
      return response.status(StatusCodes.OK).json({
        message: "Product updated successfully!",
        updatedProduct,
      });
    } else {
      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Failed to update the product.",
      });
    }
  } catch (error) {
    console.log("Error occurred in adminUpdateProductByIdController: ", error);
    return response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong!" });
  }
};

export const adminManageUsersAccessRightsController = async (
  request: CustomRequest,
  response: Response
) => {
  try {
    if (!request.payload) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "User payload is missing or invalid." });
    }
    const { email, roleName } = request.payload;
    const { userId, roleId, permissions } = request.body;
    if (!userId || !roleId || !(permissions.length > 0)) {
      response
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Please fill up all the required fields ..! " });
    } else {
      const accessRight = await accessRights.create({
        userId,
        roleId,
        permissions,
        createdBy: email,
        updatedBy: email,
        createrRole: roleName,
        updaterRole: roleName,
      });
      response.status(StatusCodes.CREATED).json({
        message: "Access rights assigned successfully",
        data: accessRight,
      });
    }
  } catch (error) {
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something Went Wrong" });
  }
};

export const adminAuthenticateJWT = async (
  request: CustomRequest,
  response: Response,
  next: Function
) => {
  try {
    const authHeader = request.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Authorization token is missing or invalid" });
    }
    const token = authHeader?.split(" ")[1];
    const payload = await tokenVerifier(token, ADMIN_SECRET_KEY);
    request.payload = payload;
    next();
  } catch (error) {
    response
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Invalid or expired admin token" });
  }
};

// export const adminGetAlltransactionListController = async (
//   request: Request,
//   response: Response
// ) => {
//   try {
//     const paymentsWithUserDetails = await paymentModel.aggregate([
//       {
//         $lookup: {
//           from: "orders",
//           localField: "orderId",
//           foreignField: "orderId",
//           as: "orderDetails",
//         },
//       },
//       { $unwind: "$orderDetails" },
//       {
//         $lookup: {
//           from: "transactions",
//           localField: "orderDetails.transactionId",
//           foreignField: "transactionId",
//           as: "transactionDetails",
//         },
//       },
//       {
//         $unwind: "$transactionDetails",
//       },
//       {
//         $lookup: {
//           from: "user",
//           localField: "orderDetails.userId",
//           foreignField: "userId",
//           as: "userDetails",
//         },
//       },
//       {
//         $unwind: "$userDetails",
//       },
//       {
//         $lookup: {
//           from: "student",
//           localField: "userDetails.userId",
//           foreignField: "userId",
//           as: "studentDetails",
//         },
//       },
//       {
//         $unwind: "$studentDetails",
//       },
//       {
//         $lookup: {
//           from: "products",
//           localField: "studentDetails.productsEnrolled",
//           foreignField: "productId",
//           as: "productDetails",
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           "orderDetails._id": 0,
//           "orderDetails.createdAt": 0,
//           "orderDetails.updatedAt": 0,
//           "orderDetails.createdBy": 0,
//           "orderDetails.updatedBy": 0,
//           "orderDetails.createrRole": 0,
//           "orderDetails.updaterRole": 0,
//           "userDetails._id": 0,
//           "userDetails.createdAt": 0,
//           "userDetails.updatedAt": 0,
//           "transactionDetails._id": 0,
//           "transactionDetails.createdAt": 0,
//           "transactionDetails.updatedAt": 0,
//           "transactionDetails.createdBy": 0,
//           "transactionDetails.updatedBy": 0,
//           "transactionDetails.createrRole": 0,
//           "transactionDetails.updaterRole": 0,
//           "studentDetails._id": 0,
//           "studentDetails.createdAt": 0,
//           "studentDetails.updatedAt": 0,
//           "studentDetails.createdBy": 0,
//           "studentDetails.updatedBy": 0,
//           "studentDetails.createrRole": 0,
//           "studentDetails.updaterRole": 0,
//           "studentDetails.userId": 0,
//         },
//       },
//     ]);
//     // console.log(paymentsWithUserDetails);

//     const transactionList = paymentsWithUserDetails.map((payment) => ({
//       name: `${payment.userDetails.firstName} ${payment.userDetails.lastName}`,
//       email: payment.userDetails.email,
//       enrollmentNumber: payment.studentDetails.enrollmentNumber,
//       contactNumber: payment.userDetails.contactNumber,
//       userAccountStatus: payment.userDetails.status,
//       productsEnrolled: payment.productDetails.map(
//         (product: { productName: string; productCategory: string }) => ({
//           productName: product.productName,
//           productCategory: product.productCategory,
//         })
//       ),
//       paymentId: payment.paymentId,
//       transactionId: payment.transactionDetails.transactionId,
//       transactionProof: payment.transactionDetails.transactionProof,
//       transactionAmount: payment.transactionDetails.transactionAmount,
//       transactionDate: payment.transactionDetails.transactionDate,
//       paymentMode: payment.transactionDetails.paymentMode,
//       paymentType: payment.transactionDetails.paymentType,

//       createdBy: payment.createdBy,
//       updatedBy: payment.updatedBy,
//       createrRole: payment.createrRole,
//       updaterRole: payment.updaterRole,
//       createdAt: payment.createdAt,
//       updatedAt: payment.updatedAt,
//     }));

//     response.status(200).json({ success: true, data: transactionList });
//   } catch (error) {
//     console.error("Error fetching payment details:", error);
//     response
//       .status(500)
//       .json({
//         success: false,
//         message: "Error fetching payment details",
//         error,
//       });
//   }
// };

// export const adminAddNewBatchController = async (
//   request: CustomRequest,
//   response: Response
// ) => {
//   try {
//     if (!request.payload) {
//       return response
//         .status(StatusCodes.UNAUTHORIZED)
//         .json({ message: "User payload is missing or invalid." });
//     }
//     const { email, roleName } = request.payload;
//     const { batchName, startDate, endDate, trainerId, productId, students } =
//       request.body;
//     const batchId = await generateUniqueId("batch");
//     const data = {
//       batchId,
//       productId: productId,
//       trainerId: trainerId,
//       batchName: batchName,
//       startDate: startDate,
//       students: students,
//       endDate: endDate,
//       createdBy: email,
//       updatedBy: email,
//       createrRole: roleName,
//       updaterRole: roleName,
//     };
//     console.log(data);
//     const newBatch = await batchModel.create(data);
//     if (newBatch) {
//       response.status(StatusCodes.CREATED).json({
//         message: "Batch Added successfully ..!",
//       });
//     } else {
//       response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//         message: "Something Went Wrong ..!",
//       });
//     }
//   } catch (error) {
//     console.log("Error occure in adminAddNewBatchController : ", error);
//     response
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ message: "Something went wrong ..!" });
//   }
// };

// export const adminGetAllBatchController = async (
//   request: CustomRequest,
//   response: Response
// ) => {
//   try {
//     const batchList = await batchModel
//       .find({}, { _id: 0 })
//       .select("batchId batchName productId trainerId startDate endDate")
//       .sort({ updatedAt: -1, createdAt: -1 });
//     console.log(batchList);

//     if (batchList && batchList.length > 0) {
//       response.status(StatusCodes.OK).json({
//         batchList: batchList,
//         message: "Batches fetched successfully  ..!",
//       });
//     } else {
//       response
//         .status(StatusCodes.NOT_FOUND)
//         .json({ message: "Batch list not found ..!" });
//     }
//   } catch (error) {
//     console.log("Error occure in adminGetAllBatchController : ", error);
//     response
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ message: "Something went wrong ..!" });
//   }
// };

// export const adminGetBatchByIdController = async (
//   request: Request,
//   response: Response
// ) => {
//   const { batchId } = request.params;
//   try {
//     const batch = await batchModel.findOne(
//       { batchId: batchId },
//       { "students._id": 0, _id: 0 }
//     );
//     console.log(batch);

//     if (!batch) {
//       return response
//         .status(StatusCodes.NOT_FOUND)
//         .json({ message: "Batch not found" });
//     }
//     console.log(batch);

//     response.status(200).json({ data: batch, message: "Batch of given id" });
//   } catch (error) {
//     console.log("Error occured in getBatchById : ", error);
//     response
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ message: "Something went wrong ..!" });
//   }
// };

// export const adminRegisterEmployeesController = async (
//   request: CustomRequest,
//   response: Response
// ) => {
//   try {
//     if (!request.payload) {
//       return response
//         .status(StatusCodes.UNAUTHORIZED)
//         .json({ message: "User payload is missing or invalid." });
//     }
//     const { email: adminEmail, roleName: adminRoleName } = request.payload;
//     const { name, email, contactNumber, roleId } = request.body;
//     const [firstName, lastName] = name.split(" ");
//     const userId = await generateUniqueId("user");
//     if (userData) {
//       const employeeId = await generateUniqueId("employee");
//       const employeeData = await employeeModel.create({
//         employeeId,
//         userId: userData.userId,
//         createdBy: adminEmail,
//         updatedBy: adminEmail,
//         createrRole: adminRoleName,
//         updaterRole: adminRoleName,
//       });
//       if (employeeData) {
//         response.status(StatusCodes.CREATED).json({
//           message: "Employee registered successfully",
//         });
//       } else {
//         response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//           message: "Employee not registered Something Went Wrong ..!",
//         });
//       }
//     } else {
//       response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//         message: "Employee not registered Something Went Wrong ..!",
//       });
//     }
//   } catch (error) {
//     console.log("Error occured in addNewLeads : ", error);
//     response
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ message: "Something went wrong ..!" });
//   }
// };

export const adminManageStudentStatusController = async (
  request: CustomRequest,
  response: Response
) => {
  try {
    const { email, action } = request.params;
    console.log("student id : ", email, "  action : ", action);
    if (!email || !action) {
      response
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Student ID and action are required" });
    }

    const status = action === "true" ? true : action === "false" ? false : null;
    if (status === null) {
      response
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Invalid action. Use true or false." });
    }

    const result = await userModel.findOneAndUpdate(
      { email: email, roleId: STUDENT_ROLE_ID },
      { $set: { status: action } },
      { new: true }
    );
    if (result) {
      console.log(`Student Status updated to ${action} successfully`);
      response.status(StatusCodes.OK).json({
        message: `Student Status updated to ${action} successfully ..!`,
      });
    } else {
      response
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Student not found or email mismatch" });
    }
  } catch (error) {
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Something went wrong" });
  }
};

export const adminAddContactNumberController = async (
  request: CustomRequest,
  response: Response
) => {
  try {
    if (!request.payload) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "User payload is missing or invalid." });
    }
    const { email } = request.payload;
    const { contactNumber } = request.body;
    console.log("Hello from adminAddContactNumberController ..!");
    if (!email) {
      response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Token not found" });
    } else {
      const result = await userModel.updateOne(
        { email },
        { $set: { contactNumber: contactNumber } }
      );
      if (result?.acknowledged) {
        console.log("Contact Number added successfully ..!");
        response
          .status(StatusCodes.OK)
          .json({ message: "Contact number updated successfully!" });
      } else {
        response
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Something went wrong ..!" });
      }
    }
  } catch (error) {
    console.log(error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};
