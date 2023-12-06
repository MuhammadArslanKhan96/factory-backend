import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.API_KEY_F;
const apiSecret = process.env.API_SECRET_F;
const authHeader = `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")}`;
export async function scrapeProducts(url: any) {
    try {
        const response = await axios.get(url, {
            headers: {
                "Authorization": authHeader,
            },
        });

        const extractedProducts = response.data.map((product: any) => {
            const {
                id,
                name,
                permalink,
                short_description,
                price,
                sku,
                dimensions,
                weight,
                categories,
                images,
                date_created,
                date_modified,
            } = product;
            const textOnlyDescription = short_description.replace(/<[^>]+>/g, '');
            const textDescritpion = textOnlyDescription.replace(/\n/g, '');
            return {
                id,
                name,
                permalink,
                short_description: textDescritpion,
                price,
                sku,
                dimensions,
                weight,
                categories: categories.map((category: any) => category.name),
                images: images.map((image: any) => image.src),
                date_created,
                date_modified,
            };
        });

        console.log(extractedProducts.id);
        return extractedProducts;
    } catch (error: any) {
        throw error;
    }
}
