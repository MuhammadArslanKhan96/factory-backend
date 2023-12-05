import axios from "axios";
const apiKey = "ck_ff83bb9c3517e25c4ba66918a851bfd67d813085";
const apiSecret = "cs_7e9fd6b2f427175f0812875b3c2811edccca8c81";
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

        return simplifiedProducts;
    } catch (error: any) {
        throw new Error("Failed to fetch products");
    }
}