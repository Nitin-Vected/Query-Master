import { Request, Response } from "express";

import {
  CustomRequest,
  generateUniqueId,
  Messages,
  StatusCodes,
} from "../config";
import productModel from "../model/productModel";

export const addNewProductController = async (
  request: CustomRequest,
  response: Response
) => {
  try {
    if (!request.payload) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: Messages.PAYLOAD_MISSING_OR_INVALID });
    }

    const { email, roleName } = request.payload;

    const { productName, productCategory, productFees, productDescription } =
      request.body;

    const files = request.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;

    const image = files?.["image"] ? files["image"][0].path : null;
    const document = files?.["document"] ? files["document"][0].path : null;

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
      return response.status(StatusCodes.ALREADY_EXIST).json({
        message: "Product " + Messages.ALREADY_EXIST,
      });
    }

    const newProduct = await productModel.create(data);
    if (newProduct) {
      return response.status(StatusCodes.CREATED).json({
        message: "Product " + Messages.CREATED_SUCCESSFULLY,
      });
    } else {
      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: Messages.SOMETHING_WENT_WRONG
      });
    }
  } catch (error) {
    console.log("Error occurred in addNewProductController: ", error);
    return response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: Messages.SOMETHING_WENT_WRONG });
  }
};

export const getAllProductController = async (
  request: CustomRequest,
  response: Response
) => {
  const page = parseInt(request.query.page as string) || 1;
  const limit = parseInt(request.query.limit as string) || 0;
  const skip = (page - 1) * limit;

  try {
    const productList = await productModel
      .find()
      .select("-_id id name category price discountPrice description assets")
      .sort({ id: -1 })
      .skip(skip)
      .limit(limit || 0);

    const totalProducts = await productModel.countDocuments();

    const totalPages = limit ? Math.ceil(totalProducts / limit) : 1;

    if (productList && productList.length > 0) {
      response.status(StatusCodes.OK).json({
        productList: productList,
        totalPages: totalPages,
        message: "Products " + Messages.FETCHED_SUCCESSFULLY,
      });
    } else {
      response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Product list " + Messages.THIS_NOT_FOUND });
    }
  } catch (error) {
    console.log("Error occurred in getAllProductController: ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: Messages.SOMETHING_WENT_WRONG });
  }
};

export const getProductByIdController = async (
  request: Request,
  response: Response
) => {
  const { productId } = request.params;
  try {
    const product = await productModel.findOne({ id: productId })
      .select("-_id id name category price discountPrice description assets");
    if (!product) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Product " + Messages.THIS_NOT_FOUND });
    }
    response
      .status(StatusCodes.OK)
      .json({ data: product, message: "Product " + Messages.FETCHED_SUCCESSFULLY });
  } catch (error) {
    console.log("Error occured in getProductById : ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: Messages.SOMETHING_WENT_WRONG });
  }
};

export const updateProductController = async (
  request: CustomRequest,
  response: Response
) => {
  try {
    if (!request.payload) {
      return response
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: Messages.PAYLOAD_MISSING_OR_INVALID });
    }

    const { email, roleName } = request.payload;
    const { productId } = request.params;
    const { productName, productCategory, productFees, productDescription } =
      request.body;

    const files = request.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;

    const image = files?.["image"] ? files["image"][0].path : null;
    const document = files?.["document"] ? files["document"][0].path : null;

    const existingProduct = await productModel.findOne({ id: productId });

    if (!existingProduct) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Product " + Messages.THIS_NOT_FOUND });
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

    const updatedProduct = await productModel.findOneAndUpdate(
      { id: productId },
      updatedFields,
      { new: true }
    );

    if (updatedProduct) {
      return response.status(StatusCodes.OK).json({
        message: "Product " + Messages.UPDATED_SUCCESSFULLY,
        updatedProduct,
      });
    } else {
      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Product " + Messages.UPDATION_FAILED,
      });
    }
  } catch (error) {
    console.log("Error occurred in updateProductController: ", error);
    return response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: Messages.SOMETHING_WENT_WRONG });
  }
};
