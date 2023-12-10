//@ts-nocheck
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.API_KEY_F;
const apiSecret = process.env.API_SECRET_F;
const authHeader = `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")}`;

const stripHtmlTags = (htmlString) => {
    return htmlString.replace(/<[^>]+>/g, '');
};

export async function scrapeProducts(url: any) {
    try {
        const response = await axios.get(url, {
            headers: {
                "Authorization": authHeader,
            },
        });
        const extractedProducts = response.data.map((product: any) => {
            const {
                id,
                name,
                permalink,
                short_description,
                price,
                sku,
                dimensions,
                weight,
                categories,
                images,
                date_created,
                date_modified,
            } = product;
            const textOnlyDescription = short_description.replace(/<[^>]+>/g, '');
            const textDescritpion = textOnlyDescription.replace(/\n/g, '');
            return {
                id,
                name,
                permalink,
                short_description: textDescritpion,
                price,
                sku,
                dimensions,
                weight,
                categories: categories.map((category: any) => category.name),
                images: images.map((image: any) => image.src),
                date_created,
                date_modified,
            };
        });

        console.log(extractedProducts.id);
        return extractedProducts;
    } catch (error: any) {
        throw error;
    }
}
export async function scrapeProducts2(url: any) {
    try {
        const response = await axios.get(url, {
            headers: {
                "Authorization": authHeader,
            },
        });
        const extractedProducts = response.data.map((product: any) => {
            const {
                id,
                slug,
                name,
                permalink,
                short_description,
                price,
                sku,
                dimensions,
                weight,
                categories,
                images,
                date_created,
                date_created_gmt,
                date_modified,
                date_modified_gmt,
                type,
                status,
                featured,
                catalog_visibility,
                description,
                regular_price,
                sale_price,
                sku,
                regular_price,
                sale_price,
                date_on_sale_from,
                date_on_sale_from_gmt,
                date_on_sale_to,
                date_on_sale_to_gmt,
                on_sale,
                purchasable,
                total_sales,
                virtual,
                downloadable,
                downloads,
                download_limit,
                download_expiry,
                external_url,
                button_text,
                tax_status,
                tax_class,
                backorders_allowed,
                backordered,
                low_stock_amount,
                sold_individually,
                weight,
                shipping_required,
                shipping_taxable,
                shipping_class,
                shipping_class_id,
                reviews_allowed,
                average_rating,
                average_rating,
                rating_count,
                upsell_ids,
                cross_sell_ids,
                parent_id,
                purchase_note,
                tags,
                attributes,
                default_attributes,
                variations,
                grouped_products,
                menu_order,
                price_html,
                related_ids,
                meta_data,
                stock_status,
                has_options,
                _links,
            } = product;
            return {
                id,
                name,
                slug,
                permalink,
                short_description,
                price,
                sku,
                dimensions,
                weight,
                categories: categories.map((category: any) => category),
                images: images.map((category: any) => category),
                date_created,
                date_created_gmt,
                date_modified,
                date_modified_gmt,
                type,
                status,
                featured,
                catalog_visibility,
                description,
                sku,
                regular_price,
                sale_price,
                date_on_sale_from,
                date_on_sale_from_gmt,
                date_on_sale_to,
                date_on_sale_to_gmt,
                on_sale,
                purchasable,
                total_sales,
                virtual,
                downloadable,
                downloads,
                download_limit,
                download_expiry,
                external_url,
                button_text,
                tax_status,
                tax_class,
                backorders_allowed,
                backordered,
                low_stock_amount,
                sold_individually,
                weight,
                shipping_required,
                shipping_taxable,
                shipping_class,
                shipping_class_id,
                reviews_allowed,
                average_rating,
                rating_count,
                upsell_ids,
                cross_sell_ids,
                parent_id,
                purchase_note,
                tags,
                attributes,
                default_attributes,
                variations,
                grouped_products,
                menu_order,
                price_html,
                related_ids,
                meta_data,
                stock_status,
                has_options,
                _links,
            };
        });
        console.log(extractedProducts.id);
        const productsWithEmptySku = extractedProducts.filter(product => product.sku !== undefined && product.sku.trim() === '');
        console.log("Number of products with empty SKU:", productsWithEmptySku.length);
        return extractedProducts;
    } catch (error: any) {
        throw error;
    }
}

