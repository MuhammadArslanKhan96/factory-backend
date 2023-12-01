import express from "express";
const app = express();
import dotenv from "dotenv";
//@ts-ignore
import cors from "cors"
import addProduct from "./routes/addproducDb";
import products from "./routes/getproductDb";

require('dotenv').config();
dotenv.config({
    path: "./.env.local",
});

const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use("/", addProduct)
app.use("/", products)

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
}); 