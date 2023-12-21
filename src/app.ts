import express from "express";
const app = express();
//@ts-ignore
import cors from "cors"
import products from "./routes/getproductDb";
import deleteroutes from "./routes/delete";
import routes from "./routes/categeory";
import addproductroutes from "./routes/addproductdb"
import factoryProductRoutes from "./routes/getproduct"
import { PORT } from "./config";

app.use(cors())

app.use(express.json())
app.use("/", addproductroutes)
app.use("/", products)
app.use("/", deleteroutes)
app.use("/", routes)
app.use("/", factoryProductRoutes)

// SSL Api
app.get(".well-known/acme-challenge/F-fULeEsBuNrsbMdKHw_phu5dEx2ZEPoenzC3zMm0hg", (req: any, res: any) => {
    res.send("F-fULeEsBuNrsbMdKHw_phu5dEx2ZEPoenzC3zMm0hg.CYTHMJrGlCx1-hjqEKeAXDFkyw7pIgW6oZImcJGKmJc");
})

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
}); 