import axios from "axios";
import express from "express"
import { AddFactoryHelpProductDb, insertAccessoryIntoDatabase, insertDetailsOnDb, insertListsOndDb, insertSubCategeoryOnDb, } from "../../models/productscraping";
import { getListsCode, getPimId, getShortCodesFromDb, } from "./getproductdb";
import { scrapeProducts } from "../../helpers/addproduct";
const apiKey = "ck_ff83bb9c3517e25c4ba66918a851bfd67d813085";
const apiSecret = "cs_7e9fd6b2f427175f0812875b3c2811edccca8c81";
const baseUrl = "https://factory-ambulance.online/wp-json/wc/v3/products";
const authHeader = `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")}`;

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
        if (data) {
            await addDetailsDb();
            console.log("success");
        } else {
            console.log("failed");
        }

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
            console.log("🚀 ~ file: addscrapingproduct.ts:67 ~ addDetailsDb ~ pimId:", pimId);
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

        await addLists();
        return { message: "Successfully got all details" };
    } catch (error) {
        console.log("🚀 ~ file: addscrapingproduct.ts:89 ~ addDetailsDb ~ error:", error);
    }
};

export const addLists = async () => {
    try {
        const shortcodes = await getShortCodesFromDb() as any;
        console.log("🚀 ~ file: addscrapingproduct.ts:107 ~ addLists ~ shortcodes:", shortcodes);

        for (const shortcode of shortcodes) {
            console.log("🚀 ~ file: addscrapingproduct.ts:109 ~ addLists ~ shortcode:", shortcode);
            const sanitizedShortCode = shortcode.replace(/[-\/]/g, '_');
            const baseUrl = `https://www.festo.com/gb/en/search/automation/products/${sanitizedShortCode}/articles/`;
            console.log("🚀 ~ file: addscrapingproduct.ts:87 ~ addLists ~ baseUrl:", baseUrl);
            let currentPage = 0;
            while (true) {
                try {
                    const url = `${baseUrl}?page=${currentPage}`;
                    const response = await axios.get(url, {
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
                    console.error("Error in loop iteration:", error);
                    break;
                }
            }
            // addAcessiories();
        }

        return { message: "All Products added Successfully" };
    } catch (error) {
        console.error("Server Error:", error);
        return { message: "Server Error" };
    }
};




export const addAcessiories = async () => {
    try {
        const orderCodes = await getListsCode();

        const responses = await Promise.all(
            orderCodes.map(async (orderCode) => {
                const url = `https://www.festo.com/gb/en/json/articles/${orderCode}/accessories/?recommendedAccessories=false`;
                console.log("🚀 ~ file: addscrapingproduct.ts:125 ~ orderCodes.map ~ url:", url);
                const response = await axios.get(url, {
                    headers: {
                        "Cookie": "LastSite=gb-en-001; JHYSESSIONID=Y14-fe3a42fd-9068-40c6-9a33-f00f93d7b72b; ROUTE=.accstorefront-595b85f95c-5d28z",
                        "Cache-Control": "no-cache",
                        "User-Agent": "Your-User-Agent",
                        "Accept": "*/*",
                        "Accept-Encoding": "gzip, deflate, br",
                        "Connection": "keep-alive",
                    },
                });
                await insertAccessoryIntoDatabase(response.data);
                return response.data;
            })
        );

        return { responses };
    } catch (error) {
        return { message: "Something went wrong" };
    }
};

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
                    await AddFactoryHelpProductDb(product);
                } catch (error: any) {
                    console.error('Error inserting product into the database:', error.message);

                }
            }
            allProducts = allProducts.concat(productsOnPage);
            page++;
        }
        res.status(200).json(allProducts);
    } catch (error: any) {
        console.error(error.response.data);
        res.status(500).json({ message: "Server Error" });
    }
}

