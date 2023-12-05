import express from "express";
import { deleteDetail, deleteProduct, deleteAccessiories } from "../controllers/products/delete";

const deleteroutes = express.Router();

deleteroutes.delete("/delete/details/:shortCode", deleteDetail)
deleteroutes.delete("/delete/:code", deleteProduct)
deleteroutes.delete("/delete/accesiories/:code", deleteAccessiories)

export default deleteroutes;