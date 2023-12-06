import express from "express";
import { addAcessiories, addDetailsDb, addLists, addSubCategory } from "../controllers/products/addscrapingproduct";
import { addFactoryCategeory, addFactoryProduct } from "../controllers/products/addFactoryHelpProduct";
const addProduct = express.Router();

addProduct.get("/add/lists", addLists);
addProduct.post("/add/subCategeory", addSubCategory);
addProduct.get("/add/details", addDetailsDb);
addProduct.get("/add/acessories", addAcessiories);
addProduct.get("/add/factoryproduct", addFactoryProduct)
addProduct.get("/add/categeory", addFactoryCategeory);

export default addProduct;