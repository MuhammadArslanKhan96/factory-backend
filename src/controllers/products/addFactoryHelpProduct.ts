import axios from "axios";
import { scrapeProducts } from "../../helpers/addproduct";
import express from "express";
import dotenv from "dotenv"
import { addFactoryCategeoryModel, addFactoryHelpProductDb } from "../../models/factoryproduct";
//@ts-ignore
dotenv.config("dotenv");

const baseUrl = "https://help-factory.com/wp-json/wc/v3/products";
const categeoryBaseUrl = "https://factory-ambulance.online/wp-json/wc/v3/products/categories";
const apiKey = process.env.API_KEY_F;
const apiSecret = process.env.API_SECRET_F;
// const baseUrl = "https://factory-ambulance.online/wp-json/wc/v3/products";
const authHeader = `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")}`;


export const addFactoryProduct = async (req: express.Request, res: express.Response) => {
    const perPage = 100;
    let page = 1;
    let allProducts = [] as any;

    try {
        while (true) {
            const apiUrl = `${baseUrl}?page=${page}&per_page=${perPage}`;
            const productsOnPage = await scrapeProducts(apiUrl);

            if (productsOnPage.length === 0) {
                break;
            }
            for (const product of productsOnPage) {
                try {
                    await addFactoryHelpProductDb(product);
                } catch (error: any) {
                    console.error('Error inserting product into the database:', error.message);
                }
            }
            allProducts = allProducts.concat(productsOnPage);
            page++;
        }

        res.status(200).json(allProducts.length);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}


export const getProductDetails = async (req: express.Request, res: express.Response) => {
    const productName = "multitask-photoelectric-sensorspowerprox-10/";
    const DetailsUrl = `${baseUrl}/${productName}`;
    try {
        const response = await axios.get(DetailsUrl, {
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json',
            },
        })
        res.json(response.data);
    } catch (error) {
        console.log("🚀 ~ file: addFactoryHelpProduct.ts:57 ~ getProductDetails ~ error:", error)
    }
}

export const addFactoryCategeory = async (req: express.Request, res: express.Response) => {
    try {
        const perPage = 10;
        let page = 1;
        let allCategories = [] as any;
        while (true) {
            const apiUrl = `${categeoryBaseUrl}?page=${page}&per_page=${perPage}`;
            const response = await axios.get(apiUrl, {
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/json',
                },
            });
            const categories = response.data as any[];
            if (categories.length === 0) {
                break;
            }
            console.log("🚀 ~ file: addFactoryHelpProduct.ts:71 ~ addFactoryCategeory ~ allCategories:", allCategories);
            await addFactoryCategeoryModel(allCategories);
            allCategories = allCategories.concat(categories);
            page++;
        }
        res.status(200).json(allCategories);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};


// export const ProductAttribute = async (req: express.Request, res: express.Response) => {
//     let baseUrlAttribute = ""
//     try {
//         const response = await axios.get()
//     } catch (error) {

//     }
// }

