import express from "express";
import { getAllAccessoriesInDb, getDetailsInDb, getFactoryProduct, getListsInDb, getShortCodesFromDb, getSubCategeory } from "../controllers/products/getproductdb";
const products = express.Router();

products.get("/get/subCategeory", getSubCategeory)
products.get("/get/details", getDetailsInDb);
products.get("/get/lists", getListsInDb)
products.get("/get/acessories", getAllAccessoriesInDb);
products.get("/get/shortcode", getShortCodesFromDb)
products.get("/get/factoryproduct", getFactoryProduct)

export default products;
