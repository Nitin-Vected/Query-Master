import { Request, Response } from "express";
import { CustomRequest, generateUniqueId, StatusCodes } from "../config";
import productModel from "../model/productModel";

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
        message: "Product already exists with the same name and category!",
      });
    }

    const newProduct = await productModel.create(data);
    if (newProduct) {
      return response.status(StatusCodes.CREATED).json({
        message: "Product added successfully!",
      });
    } else {
      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong!",
      });
    }
  } catch (error) {
    console.log("Error occurred in addNewProductController: ", error);
    return response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong!" });
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
      .status(StatusCodes.OK)
      .json({ data: product, message: "Product of given id" });
  } catch (error) {
    console.log("Error occured in getProductById : ", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ..!" });
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
        .json({ message: "User payload is missing or invalid." });
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
    console.log("Error occurred in updateProductController: ", error);
    return response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong!" });
  }
};
