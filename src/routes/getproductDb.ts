import express from "express";

import {
    getAllAccessoriesInDb,
    getDetailsInDb,
    getFactoryCategeory,
    getFactoryProduct,
    getFestoProductByCode,
    getFestoProductsPerPage,
    getListByCode,
    getListsInDb,
    getShortCodesFromDb,
    getSubCategeory,
    getfestoProducts,
    searchProductFesto,
} from "../controllers/products/getproduct/getproductdb";

import { getProductDetails } from "../controllers/products/scraping/addFactoryHelpProduct";

const products = express.Router();

products.get("/get/subCategeory", getSubCategeory)
products.get("/get/details", getDetailsInDb);
products.get("/get/lists", getListsInDb)
products.get("/get/acessories", getAllAccessoriesInDb);
products.get("/get/shortcode", getShortCodesFromDb)
products.get("/get/factoryproduct", getFactoryProduct)
products.get("/get/categeory", getFactoryCategeory)
products.get("/get/details", getProductDetails)
products.get("/get/festo/:page", getFestoProductsPerPage)
products.get("/festo/:query", searchProductFesto)
products.get("/get/festo", getfestoProducts)
products.get("/get/code/:code", getFestoProductByCode)
products.get("/get/lists/:code", getListByCode)

export default products;
