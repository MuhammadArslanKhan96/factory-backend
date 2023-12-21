import express from "express";
import { getCategory, getProductbyCategeory, } from "../controllers/categeories";
const routes = express.Router();

routes.get("/category/:slug", getProductbyCategeory)
routes.get("/get/categeories", getCategory)

export default routes