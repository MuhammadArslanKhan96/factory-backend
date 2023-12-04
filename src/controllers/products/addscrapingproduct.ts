import axios from "axios";
import express from "express"
import { insertAccessoryIntoDatabase, insertDataIntoDatabase, insertDetailsOnDb, insertUniqueProduct } from "../../models/productscraping";
import { getListsCode, getPimId, getShortCodesFromDb, } from "./getproductdb";

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

        const data = await insertDataIntoDatabase(dataToInsert);
        if (data) {
            await addDetailsDb()
            console.log("sucess");
        } else {
            console.log("failed");
        }
        res.status(2000).json({ message: "Product added sucessfully", data });
    } catch (error) {
        console.log("🚀 ~ file: addscrapingproduct.ts:45 ~ addSubCategory ~ error:", error);
        res.status(500).json({ status: "Error", message: "Server Error" });
    }
};

export const addDetailsDb = async () => {
    try {
        const pimIds = await getPimId();
        const baseUrl = "https://www.festo.com/gb/en/search/categories/";

        // const url = `${baseUrl}${pimId}/products/`;
        const url = "https://www.festo.com/gb/en/search/categories/pim227/products/";
        let currentPage = 0;
        console.log("🚀 ~ file: addscrapingproduct.ts:63 ~ addDetailsDb ~ url:", url)
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
        await addLists();
        return ({ message: "Successfully got all details" });
    } catch (error) {
    }
};

export const addLists = async () => {
    try {
        const shortCodes = await getShortCodesFromDb();
        // const sanitizedShortCode = shortCode.replace(/[-\/]/g, '_');
        const baseUrl = `https://www.festo.com/gb/en/search/automation/products/BUB/articles/`;
        console.log("🚀 ~ file: addscrapingproduct.ts:87 ~ addLists ~ baseUrl:", baseUrl);
        try {
            let currentPage = 0;

            while (true) {
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
                        await insertUniqueProduct(product);
                    } catch (error) {
                        console.error("Error inserting product into the database:", error);
                    }
                });

                await Promise.all(insertPromises);
                currentPage++;
            }
        } catch (error) {
        }

        addAcessiories();
        return { message: "All Products added Successfully" };
    } catch (error) {
        console.error("Server Error:", error);
        return { message: "Server Error" };
    }
};

export const addAcessiories = async () => {
    try {
        const orderCode = await getListsCode();

        const responses = await Promise.all(
            orderCode.map(async (item) => {
                const url = `https://www.festo.com/gb/en/json/articles/${item}/accessories/?recommendedAccessories=false`;
                console.log("🚀 ~ file: addscrapingproduct.ts:125 ~ orderCode.map ~ url:", url)
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
        return { responses }
    } catch (error) {
        return { meeage: "Some thing Went wrong" };
    }

}

export const getShortCodesFromDbMain = async (req: express.Request, res: express.Response) => {
    try {
        const response = await getShortCodesFromDb()
        res.json(response);
    } catch (error) {
        res.status(500).json({ message: "Server Error" })
    }
}