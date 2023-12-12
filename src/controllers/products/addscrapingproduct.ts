import axios from "axios";
import express from "express"
import dotenv from "dotenv"
//@ts-ignore
dotenv.config("dotenv");
import { insertAccessoryIntoDatabase, insertDetailsOnDb, insertListsOndDb, insertSubCategeoryOnDb, } from "../../models/productscraping";
import { getListCode, getPimId, getShortCodesFromDb, } from "./getproductdb";
import * as xlsx from 'xlsx';
import { uploadImageToS3 } from "../../helpers/uploadImage/s3bucket";

// const apiKey = process.env.Api_Key_S3;
// const apiSecret = process.env.API_SECRET_S3;
// const authHeader = `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")}`;

export const addSubCategory = async (req: express.Request, res: express.Response) => {
    const { baseUrl } = req.body;
    try {
        if (!baseUrl) {
            res.status(401).json({ message: "Please enter the url" });
            return;
        }

        const response = await axios.get(baseUrl, {
            headers: {
                "Cookie": "LastSite=gb-en-001; JHYSESSIONID=Y12-93031766-97bc-4273-85a7-df5407852ba7.accstorefront-595b85f95c-lqqbj; ROUTE=.accstorefront-595b85f95c-lqqbj",
                "Cache-Control": "no-cache",
                "User-Agent": "Your-User-Agent",
                "Accept": "*/*",
                "Accept-Encoding": "gzip, deflate, br",
                "Connection": "keep-alive",
            },
        });
        const subCategoryData = response.data.subCategories;
        if (!subCategoryData) {
            res.status(401).json({ status: "Error", message: "This does not have data" });
            return;
        }
        const dataToInsert = subCategoryData.map((item: any) => ({
            name: item.name,
            pimId: item.pimId,
            url: item.url,
            image_src: item.image.src,
            image_alt: item.image.alt,
            description_elements: JSON.stringify(item.descriptionElements),
        }));
        const data = await insertSubCategeoryOnDb(dataToInsert);
        res.status(200).json({ message: "Product added sucessfully", data });
    } catch (error) {
        console.log("🚀 ~ file: addscrapingproduct.ts:45 ~ addSubCategory ~ error:", error);
        res.status(500).json({ status: "Error", message: "Server Error" });
    }
};

export const addDetailsDb = async () => {
    try {
        const pimIds = await getPimId();
        const baseUrl = "https://www.festo.com/gb/en/search/categories/";
        for (const pimId of pimIds) {
            const url = `${baseUrl}${pimId}/products/`;
            let currentPage = 0;

            while (true) {
                const pageUrl = `${url}?page=${currentPage}`;
                const response = await axios.get(pageUrl, {
                    headers: {
                        "Cookie": "LastSite=gb-en-001; JHYSESSIONID=Y12-93031766-97bc-4273-85a7-df5407852ba7.accstorefront-595b85f95c-lqqbj; ROUTE=.accstorefront-595b85f95c-lqqbj",
                        "Cache-Control": "no-cache",
                        "User-Agent": "Your-User-Agent",
                        "Accept": "*/*",
                        "Accept-Encoding": "gzip, deflate, br",
                        "Connection": "keep-alive",
                    },
                });

                const productDetails = response.data.productList as string[];

                if (productDetails.length === 0) {
                    break;
                }

                for (const accessory of productDetails) {
                    await insertDetailsOnDb(accessory);
                }

                currentPage++;
            }
        }
        return { message: "Successfully got all details" };
    } catch (error) {
        console.log("🚀 ~ file: addscrapingproduct.ts:89 ~ addDetailsDb ~ error:", error);
    }
};

export const addLists = async () => {
    try {
        const shortcodes = await getShortCodesFromDb() as any;
        for (const shortcode of shortcodes) {
            const sanitizedShortCode = shortcode?.replace(/[-\/]/g, '_');
            let currentPage = 0;
            while (true) {
                try {
                    const baseUrl = `https://www.festo.com/gb/en/search/automation/products/${sanitizedShortCode}/articles/?page=${currentPage}`;
                    const response = await axios.get(baseUrl, {
                        headers: {
                            "Cookie": "LastSite=gb-en-001; JHYSESSIONID=Y14-fe3a42fd-9068-40c6-9a33-f00f93d7b72b; ROUTE=.accstorefront-595b85f95c-5d28z",
                            "Cache-Control": "no-cache",
                            "User-Agent": "Your-User-Agent",
                            "Accept": "*/*",
                            "Accept-Encoding": "gzip, deflate, br",
                            "Connection": "keep-alive",
                        },
                    });

                    const productList = response.data.productList as string[];
                    if (productList.length === 0) {
                        break;
                    }

                    const insertPromises = productList.map(async (product: any) => {
                        try {
                            await insertListsOndDb(product);
                        } catch (error) {
                            console.error("Error inserting product into the database:", error);
                        }
                    });

                    await Promise.all(insertPromises);
                    currentPage++;
                } catch (error) {
                    break;
                }
            }
        }

        return { message: "All Products added Successfully" };
    } catch (error) {
        console.error("Server Error:", error);
        return { message: "Server Error" };
    }
};



export const addAccessories = async (req: express.Request, res: express.Response) => {

    try {
        const products2 = [] as any
        const codes = await getListCode();
        for (const code of codes) {
            const baseUrl = `https://www.festo.com/gb/en/json/articles/${code}/accessories/?recommendedAccessories=false`
            const response = await axios.get(baseUrl, {
                headers: {
                    "Cookie": "LastSite=gb-en-001; JHYSESSIONID=Y14-fe3a42fd-9068-40c6-9a33-f00f93d7b72b; ROUTE=.accstorefront-595b85f95c-5d28z",
                    "Cache-Control": "no-cache",
                    "User-Agent": "Your-User-Agent",
                    "Accept": "*/*",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Connection": "keep-alive",
                }
            });

            const products = await response.data as any[];
            products2.push(products)
        }

        res.send(products2);
    } catch (error) {
        console.log("🚀 ~ file: addscrapingproduct.ts:199 ~ addAccessories ~ error:", error);
        res.status(500).send("Internal Server Error");
    }
};

