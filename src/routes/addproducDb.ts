import express from "express";
import { addAcessiories, addDetailsDb, addFactoryProduct, addLists, addSubCategory } from "../controllers/products/addscrapingproduct";
const addProduct = express.Router();

addProduct.get("/add/lists", addLists);
addProduct.post("/add/subCategeory", addSubCategory);
addProduct.get("/add/details", addDetailsDb);
addProduct.get("/add/acessories", addAcessiories);
addProduct.get("/add/factoryproduct", addFactoryProduct)

export default addProduct;