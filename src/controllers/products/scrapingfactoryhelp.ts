// import axios from "axios";
// import express from 'express';

// const scrapproduct = express.Router();

// const apiKey = "ck_ff83bb9c3517e25c4ba66918a851bfd67d813085";
// const apiSecret = "cs_7e9fd6b2f427175f0812875b3c2811edccca8c81";
// const baseUrl = "https://factory-ambulance.online/wp-json/wc/v3/products";
// const authHeader = `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")}`;

// async function scrapeProducts(url: any) {
//     try {
//         const response = await axios.get(url, {
//             headers: {
//                 "Authorization": authHeader,
//             },
//         });

//         const simplifiedProducts = response.data.map((product: any) => {
//             return {
//                 id: product.id,
//                 name: product.name,
//                 permalink: product.permalink,
//                 price: product.price,
//                 categories: product.categories.map((category: any) => category.name),
//                 images: product.images.map((image: any) => image.src),
//             };
//         });

//         return simplifiedProducts;
//     } catch (error: any) {
//         console.error(error.response.data);
//         throw new Error("Failed to fetch products");
//     }
// }

// scrapproduct.get("/scrape", async (req: any, res: any) => {
//     const perPage = 100;
//     let page = 1;
//     let allProducts = [] as any;

//     try {
//         while (true) {
//             const apiUrl = `${baseUrl}?page=${page}&per_page=${perPage}`;
//             const productsOnPage = await scrapeProducts(apiUrl);
//             console.log("🚀 ~ file: scrapingfactoryhelp.ts:46 ~ scrapproduct.get ~ productsOnPage:", productsOnPage);

//             if (productsOnPage.length === 0) {
//                 break;
//             }
//             console.log(`Products on Page ${page}:`, productsOnPage.length);
//             allProducts = allProducts.concat(productsOnPage);
//             page++;
//         }
//         res.status(200).json(allProducts);
//     } catch (error: any) {
//         console.error(error.response.data);
//         res.status(500).json({ message: "Server Error" });
//     }
// });


// export default scrapproduct;
