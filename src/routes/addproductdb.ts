import express from "express";
import { addDetailsDb, addLists, addSubCategory } from "../controllers/products/scraping/addscrapingproduct";
import { addAllProduct, addFactoryProduct, } from "../controllers/products/scraping/addFactoryHelpProduct";
import { FestoProduct } from "../controllers/products/scraping/festo";
const routes = express.Router();

routes.get("/add/lists", addLists);
routes.get("/add/subCategeory", addSubCategory);
routes.get("/add/details", addDetailsDb);
routes.get("/add/festo", FestoProduct)
routes.get("/add/factoryproduct", addFactoryProduct)
routes.get("/add/alldata", addAllProduct)

export default routes;