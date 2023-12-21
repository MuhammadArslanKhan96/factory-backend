import express from "express";
import { getCategory, getCategoryPage, getProductbyCategeory, } from "../controllers/categeories";
const routes = express.Router();

routes.get("/category/:slug", getProductbyCategeory)
routes.get("/get/categeories", getCategory)
routes.get("/categeory/:page", getCategoryPage)

export default routes