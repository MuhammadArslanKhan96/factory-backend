import axios from "axios";
import express from "express"
import { insertAccessoryIntoDatabase, insertDataIntoDatabase, insertDetailsOnDb, insertUniqueProduct } from "../../models/productscraping";
import { getListsCode, getPimId, getShortCodesFromDb, } from "./getproductdb";
import { data } from "cheerio/lib/api/attributes";

export const addSubCategory = async (req: express.Request, res: express.Response) => {
    const baseUrl = "https://www.festo.com/gb/en/search/categories/pim2/"
    try {
        if (!baseUrl) {
            res.status(401).json({ message: "Please enter the url" })
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
        })
        const subCategoryData = response.data.subCategories
        if (!subCategoryData) {
            res.status(401).json({ status: "Error", message: "This is does not Data" })
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
        res.status(200).json({ message: "Sub Categroy added Sucessfully" });
    } catch (error) {
        res.json({ status: "Error", message: "Server Error" });
    }

}

export const addDetailsDb = async (req: express.Request, res: express.Response) => {
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
        res.json({ message: "Successfully got all details" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// export const addLists = async (req: express.Request, res: express.Response) => {
//     try {
//         const shortCodes = await getShortCodesFromDb();


//         for (const shortCode of shortCodes) {
//             const { baseUrl } = req.body;
//             console.log("🚀 ~ file: addscrapingproduct.ts:87 ~ addLists ~ baseUrl:", baseUrl);
//             let currentPage = 0;

//             try {
//                 while (true) {
//                     const url = `${baseUrl}?page=${currentPage}`;
//                     const response = await axios.get(url, {
//                         headers: {
//                             "Cookie": "LastSite=gb-en-001; JHYSESSIONID=Y12-93031766-97bc-4273-85a7-df5407852ba7.accstorefront-595b85f95c-lqqbj; ROUTE=.accstorefront-595b85f95c-lqqbj",
//                             "Cache-Control": "no-cache",
//                             "User-Agent": "Your-User-Agent",
//                             "Accept": "*/*",
//                             "Accept-Encoding": "gzip, deflate, br",
//                             "Connection": "keep-alive",
//                         },
//                     });

//                     const productList = response.data.productList as string[];

//                     if (productList.length === 0) {
//                         break;
//                     }


//                     const insertPromises = productList.map(async (product: any) => {
//                         try {
//                             const addedToDb = await insertUniqueProduct(product);
//                         } catch (error) {
//                             console.error("Error inserting product into the database:", error);
//                         }
//                         await Promise.all(insertPromises);
//                     })

//                     currentPage++;
//                 }
//             } catch (error) {
//                 console.error(`Error processing shortCode: ${shortCode}`, error);
//             }
//         }
//         res.status(200).json({ message: "All Product added Successfully" });
//     } catch (error) {
//         console.error("Server Error:", error);
//         res.status(500).json({ message: "Server Error" });
//     }
// };

export const addLists = async (req: express.Request, res: express.Response) => {
    const { baseUrl } = req.body;
    try {
        let page = 1;
        let hasMoreData = true;
        const allProductList: string[] = [];
        while (hasMoreData) {
            const pageUrl = `${baseUrl}?page=${page}`;
            const result = await axios.get(pageUrl, {
                headers: {
                    "Cookie": "LastSite=gb-en-001; JHYSESSIONID=Y12-93031766-97bc-4273-85a7-df5407852ba7.accstorefront-595b85f95c-lqqbj; ROUTE=.accstorefront-595b85f95c-lqqbj",
                    "Cache-Control": "no-cache",
                    "User-Agent": "Your-User-Agent",
                    "Accept": "*/*",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Connection": "keep-alive",
                },
            });
            const productList = result.data.productList as string[];
            if (productList.length > 0) {
                allProductList.push(...productList);
                const inserdataInDb = await Promise.all(productList.map(async (item: any) => {
                    return insertUniqueProduct(item);
                }));
            } else {
                hasMoreData = false;
            }
            page++;
        }

        const responseData = {
            productList: allProductList,
        };
        res.json(responseData);

    } catch (error) {
        console.error("Error in addLists:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const addAcessiories = async (req: express.Request, res: express.Response) => {
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

        res.json(responses);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
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