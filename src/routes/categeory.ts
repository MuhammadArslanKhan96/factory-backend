import express from "express";
import { getCategory, getCategoryPage, getProductByCategory, } from "../controllers/categeories";
const routes = express.Router();

routes.get("/category/:slug/products/:page", getProductByCategory)
routes.get("/get/categeories", getCategory)
routes.get("/categeory/:page", getCategoryPage)

export default routes