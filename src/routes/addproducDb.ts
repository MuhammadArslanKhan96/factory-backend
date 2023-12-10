import express from "express";
import { addAccessories, addDetailsDb, addLists, addSubCategory } from "../controllers/products/addscrapingproduct";
import { addAllProduct, addFactoryProduct, check } from "../controllers/products/addFactoryHelpProduct";
const addProduct = express.Router();

addProduct.get("/add/lists", addLists);
addProduct.post("/add/subCategeory", addSubCategory);
addProduct.get("/add/details", addDetailsDb);
addProduct.get("/add/acessories", addAccessories);
addProduct.get("/add/factoryproduct", addFactoryProduct)
// addProduct.get("/add/categeory", addFactoryCategeory);
addProduct.get("/add/alldata", addAllProduct)
addProduct.get("/check", check)
export default addProduct;