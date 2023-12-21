import express from "express"
import {
    getAllProduct,
    getFactoryProductById,
    getFactoryProductsPerPage,
    searchProduct
} from "../controllers/products/getproduct/getfactoryproduct";
const routes = express.Router();

routes.get("/get/allproduct", getAllProduct)
routes.get("/get/product/:page", getFactoryProductsPerPage)
routes.get("/get/byid/:id", getFactoryProductById);
routes.get('/product/:query', searchProduct);

export default routes