import express from "express";
import { addAcessiories, addDetailsDb, addLists, addSubCategory } from "../controllers/products/addscrapingproduct";
const addProduct = express.Router();

addProduct.get("/add/subCategeory", addSubCategory);
addProduct.get("/add/details", addDetailsDb);
addProduct.post("/add/lists", addLists);
addProduct.get("/add/acessories", addAcessiories);

export default addProduct;