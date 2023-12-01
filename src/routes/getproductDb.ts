import express from "express";
import { getDetailsInDb, getAlAcessioriesInDb, getListsInDb, getSubCategeory, deleteProduct } from "../controllers/products/getproductdb";
import { getShortCodesFromDbMain } from "../controllers/products/addscrapingproduct";
const products = express.Router();

products.get("/get/subCategeory", getSubCategeory)
products.get("/get/details", getDetailsInDb);
products.get("/get/lists", getListsInDb)
products.get("/get/acessories", getAlAcessioriesInDb);
products.get("/get/shortcode", getShortCodesFromDbMain)
products.delete("/delete/:code", deleteProduct)

export default products;
// 577297