import express from "express";
import {
    getAllAccessoriesInDb,
    getAllProduct,
    getDetailsInDb,
    getFactoryCategeory,
    getFactoryProduct,
    getFactoryProductById,
    getFactoryProductsPerPage,
    getListsInDb,
    getShortCodesFromDb,
    getSubCategeory,
    searchProduct
} from "../controllers/products/getproductdb";
import { getProductDetails } from "../controllers/products/addFactoryHelpProduct";
import { getdata } from "../controllers/getproduct";

const products = express.Router();

products.get("/get/subCategeory", getSubCategeory)
products.get("/get/details", getDetailsInDb);
products.get("/get/lists", getListsInDb)
products.get("/get/acessories", getAllAccessoriesInDb);
products.get("/get/shortcode", getShortCodesFromDb)
products.get("/get/factoryproduct", getFactoryProduct)
products.get("/get/categeory", getFactoryCategeory)
products.get("/get/details", getProductDetails)
products.get("/get/product/:page", getFactoryProductsPerPage)
products.get('/product/:query', searchProduct);
products.get("/get/byid/:id", getFactoryProductById);
products.get("/get/allproduct", getAllProduct)
products.get("/get/html", getdata)
// products.get("/get/product",)

export default products;
