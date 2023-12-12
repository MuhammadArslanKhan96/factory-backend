import express from "express";
import {
    getAllAccessoriesInDb,
    getAllProduct,
    getDetailsInDb,
    getFactoryCategeory,
    getFactoryProduct,
    getFactoryProductById,
    getFactoryProductsPerPage,
    getFestoProductByCode,
    getFestoProductsPerPage,
    getListByCode,
    getListsInDb,
    getShortCodesFromDb,
    getSubCategeory,
    getfestoProducts,
    searchProduct,
    searchProductFesto,
} from "../controllers/products/getproductdb";
import { getProductDetails } from "../controllers/products/addFactoryHelpProduct";

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
products.get("/get/festo/:page", getFestoProductsPerPage)
products.get('/product/:query', searchProduct);
products.get("/festo/:query", searchProductFesto)
products.get("/get/byid/:id", getFactoryProductById);
products.get("/get/allproduct", getAllProduct)
products.get("/get/festo", getfestoProducts)
products.get("/get/code/:code", getFestoProductByCode)
products.get("/get/lists/:code", getListByCode)

export default products;
