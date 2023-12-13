import express from "express";
import { addDetailsDb, addLists, addSubCategory } from "../controllers/products/addscrapingproduct";
import { addAllProduct, addFactoryProduct, } from "../controllers/products/addFactoryHelpProduct";
import { FestoProduct } from "../controllers/products/festo";
const addProduct = express.Router();

addProduct.get("/add/lists", addLists);
addProduct.get("/add/subCategeory", addSubCategory);
addProduct.get("/add/details", addDetailsDb);
addProduct.get("/add/festo", FestoProduct)
addProduct.get("/add/factoryproduct", addFactoryProduct)
addProduct.get("/add/alldata", addAllProduct)
export default addProduct;