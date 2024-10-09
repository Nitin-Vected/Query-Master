import { Request, Response } from "express";

import {
  CustomRequest,
  generateUniqueId,
  StatusCodes,
  COUNSELLOR_ROLE_ID,
} from "../config";
import userModel from "../model/userModel";
import roleModel from "../model/roleModel";
import statusModel from "../model/statusModel";
import studentModel from "../model/studentModel";
import channelModel from "../model/channelModel";
import productModel from "../model/productModel";

export const viewStudentListController = async (
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
    console.log("Error occurred in viewStudentListController: ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};

export const viewConsellorListController = async (
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
    console.log("Error occure in viewConsellorListController : ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};

export const viewUserListController = async (
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
    console.log("Error occure in viewUserListController : ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};

export const addNewRoleController = async (
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
    console.error("Error in addNewRoleController:", error);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong!",
    });
  }
};

export const getAllRolesController = async (
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
    console.log("Error occure in getAllRolesController : ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};

export const getRoleByIdController = async (
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

export const updateRoleController = async (
  request: CustomRequest,
  response: Response
) => {
  try {
    const { roleId } = request.params;
    if (!request.payload) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "User payload is missing or invalid." });
    }

    const { email, roleName } = request.payload;
    const { userRole, access } = request.body;

    const updatedRole = await roleModel.findOneAndUpdate(
      { id: roleId },
      {
        ...(userRole && { name: userRole }),
        ...(access && { access }),
        updatedBy: email,
        updaterRole: roleName,
      },
      { new: true }
    );

    if (!updatedRole) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Role not found." });
    }

    response.status(StatusCodes.OK).json({
      message: "Role updated successfully!",
      role: updatedRole,
    });
  } catch (error) {
    console.error("Error in updateRoleController:", error);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong!",
    });
  }
};

export const addNewStatusController = async (
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
    console.error("Error in addNewStatusController:", error);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong!",
    });
  }
};

export const getAllStatusController = async (
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
    console.log("Error occure in getAllStatusController : ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};

export const getStatusByIdController = async (
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

export const updateStatusController = async (
  request: CustomRequest,
  response: Response
) => {
  try {
    const { statusId } = request.params;

    if (!request.payload) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "User payload is missing or invalid." });
    }

    const { email, roleName } = request.payload;
    const { statusName } = request.body;

    const updatedStatus = await statusModel.findOneAndUpdate(
      { id: statusId },
      {
        name: statusName,
        updatedBy: email,
        updaterRole: roleName,
      },
      { new: true }
    );

    if (!updatedStatus) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Status not found." });
    }

    response.status(StatusCodes.OK).json({
      message: "Status updated successfully!",
      status: updatedStatus,
    });
  } catch (error) {
    console.error("Error in updateStatusController:", error);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong!",
    });
  }
};

export const addNewChannelController = async (
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
    console.error("Error in addNewChannelController:", error);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong!",
    });
  }
};

export const getAllChannelsController = async (
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
    console.log("Error occure in getAllChannelsController : ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};

export const getChannelByIdController = async (
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

export const updateChannelController = async (
  request: CustomRequest,
  response: Response
) => {
  try {
    const { channelId } = request.params;

    if (!request.payload) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "User payload is missing or invalid." });
    }

    const { email, roleName } = request.payload;
    const { channelName } = request.body;

    const updatedChannel = await channelModel.findOneAndUpdate(
      { id: channelId },
      {
        name: channelName,
        updatedBy: email,
        updaterRole: roleName,
      },
      { new: true }
    );

    if (!updatedChannel) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Channel not found." });
    }

    response.status(StatusCodes.OK).json({
      message: "Channel updated successfully!",
      channel: updatedChannel,
    });
  } catch (error) {
    console.error("Error in updateChannelController:", error);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong!",
    });
  }
};

export const addNewProductController = async (
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
    console.log("Error occure in addNewProductController : ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};

export const getAllProductController = async (
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
    console.log("Error occure in getAllProductController : ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
  }
};

export const getProductByIdController = async (
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

export const updateProductByIdController = async (
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
    console.log("Error occurred in updateProductByIdController: ", error);
    return response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong!" });
  }
};
