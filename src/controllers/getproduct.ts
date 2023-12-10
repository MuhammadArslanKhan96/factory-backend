import * as express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';
//@ts-ignore
import * as he from 'he';

export const getdata = async (req: express.Request, res: express.Response) => {
    const baseUrl = "https://www.festo.com/gb/en/a/569800/?q=%7E%3AsortByCoreRangeAndSp2020";

    try {
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

        const html = response.data;
        const $ = cheerio.load(html);
        const containerContent = $('.container-fluid.product-summary-article');
        const innerContent = containerContent.find('container-fluid');
        const h1Text = $('.row.product-summary-article__description h1').text();
        const short_description = $(".product-summary-article__title p").text();
        const sku = $(".product-summary-article__part-number").text();
        const contentWrapper = $('.row.product-summary-article__content-wrapper');

        const jsxDownloadDropdownHTML = $('.jsx-download-dropdown').html();

        const combinedData = {
            name: h1Text,
            summarycode: short_description,
            sku: sku,
            pdf: jsxDownloadDropdownHTML
        };

        res.send(innerContent);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send("Internal Server Error");
    }
};
