import axios from "axios";
import dotenv from "dotenv";
//@ts-ignore
dotenv.config("dotenv");
const apiKey = process.env.Api_Key_S3;
const apiSecret = process.env.API_SECRET_S3;
// const baseUrl = "https://factory-ambulance.online/wp-json/wc/v3/products";
const authHeader = `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")}`;

export async function scrapeProducts(url: any) {
    try {
        const response = await axios.get(url, {
            headers: {
                "Authorization": authHeader,
            },
        });

        const simplifiedProducts = response.data.map((product: any) => {
            return {
                id: product.id,
                name: product.name,
                permalink: product.permalink,
                price: product.price,
                categories: product.categories.map((category: any) => category.name),
                images: product.images.map((image: any) => image.src),
            };
        });
        console.log(simplifiedProducts);
        return simplifiedProducts;
    } catch (error: any) {
        throw new Error("Failed to fetch products");
    }
}