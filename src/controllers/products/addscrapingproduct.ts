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
    const baseUrl = "https://www.festo.com/gb/en/search/categories/pim2/";
    try {
        if (!baseUrl) {
            res.status(401).json({ message: "Please enter the url" });
            return;
        }

        const response = await axios.get(baseUrl, {
            headers: {
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "en-US,en;q=0.9",
                "Cache-Control": "max-age=0",
                "Cookie": "kameleoonVisitorCode=zjnz1lkemir3fwur; ckns_policy=00000; emos_jcvid=AYv65wFam0Iy9pkksxfeygwtRmbOHcXi:1:0:0:0:true:1; _gcl_au=1.1.1152953692.1700724373; _fbp=fb.1.1700724374090.1978132665; ELOQUA=GUID=0258691933D441E08A6BD1E7B5772B8E; _hjSessionUser_3237644=eyJpZCI6IjJjZTllNDdlLWM4ZmQtNWQ5MS05ODg5LTM0YWJjMmJjNzg1ZiIsImNyZWF0ZWQiOjE3MDA5MTUzNDQ1MDYsImV4aXN0aW5nIjp0cnVlfQ==; fox_ae-cart=0ad05770-7649-49f3-8944-87cd747ea186; LastSite=gb-en-001; info_revision=291308; fox_gb-cart=1f33609c-aa92-4b77-ac76-f257b1b9d0df; ROUTE=.accstorefront-69777d9bcc-fxqk9; emos_jcsid=AYxh7mrx6*arP5_VeU4VGBxRNcvtksAS:t:1:0; JHYSESSIONID=Y12-96e7c77a-c6ae-4eaf-80f8-b1cd9a31a556; _uetsid=c277404098dd11eebfa3bff799d1588c; _uetvid=9547628089d111ee9b9357ff8cd1bc86; RT=\"z=1&dm=festo.com&si=9013aed3-d5a2-4abb-83a5-bb5e1144ae44&ss=lq3gbcsn&sl=0&tt=0&bcn=%2F%2F684d0d48.akstat.io%2F&ld=1heoq&ul=sag&hd=tcs\"",
                "Sec-Ch-Ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
                "Sec-Ch-Ua-Mobile": "?0",
                "Sec-Ch-Ua-Platform": "\"Windows\"",
                "Sec-Fetch-Dest": "document",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-Site": "none",
                "Sec-Fetch-User": "?1",
                "Upgrade-Insecure-Requests": "1",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
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

