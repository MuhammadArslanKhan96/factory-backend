import express from "express";
import puppeteer from "puppeteer";
import { insertProductsFesto } from "../../../models/productscraping";
import { getUrlCode } from "../getproduct/getproductdb";

export const FestoProduct = async (req: express.Request, res: express.Response) => {
    const urls = await getUrlCode()

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setExtraHTTPHeaders({
            Cookie:
                "LastSite=gb-en-001; JHYSESSIONID=Y12-93031766-97bc-4273-85a7-df5407852ba7.accstorefront-595b85f95c-lqqbj; ROUTE=.accstorefront-595b85f95c-lqqbj",
            "Cache-Control": "no-cache",
            "User-Agent": "Your-User-Agent",
            Accept: "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            Connection: "keep-alive",
        });
        const products = [];
        for (const url of urls) {
            await page.goto(url, {
                waitUntil: "networkidle2",
            });

            const product = await page.evaluate(() => {
                const GTIN = (
                    document.querySelector("div.jsx-gtin-info") as HTMLElement
                )?.getAttribute("data-gtin");

                const pdf = JSON.parse(
                    (
                        document.querySelector("div.jsx-download-dropdown") as HTMLElement
                    )?.getAttribute("data-documents") ?? ""
                )[0].link;

                const technicalData = (
                    document.querySelector("a.js-analytics-event") as HTMLElement
                )?.getAttribute("href");


                const reliabilityDatasheet = (
                    document.querySelector(
                        "div.product-summary-article__data-link a.icon-document-pdf.icon-link"
                    ) as HTMLElement
                )?.getAttribute("href");

                const spareParts = (
                    document.querySelector("a.icon-connection.icon-link") as HTMLElement
                )?.getAttribute("href");


                const price = (
                    document.querySelector(
                        "div.jsx-price-wrapper div.price-text--SM3SD"
                    ) as HTMLElement

                )?.innerText.trim();

                const code = (
                    document.querySelector(
                        "p.product-summary-article__part-number"
                    ) as HTMLElement
                )?.innerText.trim();

                const allAccessoriesElements = document.querySelectorAll(
                    "span.radio-headline--kQbj0"
                );

                const allAccessories = (
                    allAccessoriesElements[0] as HTMLElement
                )?.innerText.trim();

                const onlyRecommended = (
                    allAccessoriesElements[allAccessoriesElements.length - 1] as HTMLElement
                )?.innerText.trim();

                const accessories = {
                    filterBy: (
                        document.querySelector(
                            "p.accessories-filter--label--vnD0L"
                        ) as HTMLElement
                    )?.innerText.trim(),

                    allAccessories: allAccessories,
                    onlyRecommended: onlyRecommended,

                    coreRange: (
                        document.querySelector(
                            "span.accessories-filter-selector-label-text--rB9_m"
                        ) as HTMLElement
                    )?.innerText.trim(),
                    items: Array.from(document.querySelectorAll("li.name--psYcK")).map((el) =>
                        (el as HTMLElement).getAttribute("title")
                    ),
                };

                const technicalDataDetails = Array.from(
                    document.querySelectorAll("li.technical-data-table-row--kNGPX")
                ).map((el) => el.outerHTML).join("");

                const images = Array.from(
                    document.querySelectorAll("div.image-wrapper--Dlz3R img")
                ).map((el) => (el as HTMLElement).getAttribute("src"));

                return {
                    code,
                    GTIN,
                    pdf,
                    technicalData,
                    reliabilityDatasheet,
                    spareParts,
                    price,
                    accessories,
                    technicalDataDetails,
                    images,
                };
            });

            insertProductsFesto(product);
            products.push(product);
        }
        await browser.close();

        res.json({ products: products });
    } catch (err) {
        res.status(500).json({ error: "An error occurred" });
    }
}
