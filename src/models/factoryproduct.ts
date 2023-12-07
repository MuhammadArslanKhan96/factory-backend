import pool from "../db/db";
import { allFactoryProduct, factoryProductQuery } from "../helpers/queries/products";

import { uploadImageToS3 } from "../helpers/uploadImage/s3bucket"; export const addFactoryHelpProductDb = async (product: any) => {
    const { name, permalink, price, dimensions, categories, images, short_description } = product;
    const categoryArray = categories.map((category: any) => category);
    const imageArray = images.map((image: any) => image);
    try {
        const existingProduct = await pool.query('SELECT * FROM factoryProduct WHERE name = $1', [name]);

        if (existingProduct.rows.length === 0) {
            const insertResult = await pool.query(factoryProductQuery, [
                name,
                permalink,
                price,
                JSON.stringify(dimensions),
                categoryArray,
                imageArray,
                short_description
            ]);

            const imageUrlPromises = images.map(async (image: string, index: number) => {
                const imageKey = `products/${insertResult.rows[0].id}/image${index + 1}.jpg`;
                return uploadImageToS3(image, imageKey);
            });

            const imageUrls = await Promise.all(imageUrlPromises);

            await pool.query('UPDATE factoryProduct SET images = $1 WHERE id = $2', [imageUrls, insertResult.rows[0].id]);

            console.log('Product added successfully:', insertResult.rows[0].id);
            return insertResult.rows[0];
        } else {
            console.log('Duplicate entry: Product not added.');
            return null;
        }
    } catch (error: any) {
        throw error;
    }
};


export const addAlldata = async (product: any) => {
    const { name, slug, permalink, price, dimensions, categories, images, short_description, date_created,
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
        manage_stock,
        stock_quantity,
        backorders,
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
        sku
    } = product;
    if (!sku || sku.trim() === '') {
        console.log('SKU is empty. Product not added.');
        return null;
    }
    const categoryArray = categories.map((category: any) => category);
    const imageArray = images.map((image: any) => image);
    try {
        const existingProduct = await pool.query('SELECT * FROM factoryProductsAll WHERE name = $1', [name]);
        if (existingProduct.rows.length === 0) {
            const insertResult = await pool.query(allFactoryProduct, [
                name,
                slug,
                permalink,
                price,
                JSON.stringify(dimensions),
                categoryArray,
                imageArray,
                short_description,
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
                manage_stock,
                stock_quantity,
                backorders,
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
                sku
                ,
            ]);

            const imageUrlPromises = images.map(async (image: string, index: number) => {
                const imageKey = `products/${insertResult.rows[0].id}/image${index + 1}.jpg`;
                //@ts-ignore
                return uploadImageToS3(image.src, imageKey);
            });

            const imageUrls = await Promise.all(imageUrlPromises);

            await pool.query('UPDATE factoryProductsAll SET images = $1 WHERE id = $2', [imageUrls, insertResult.rows[0].id]);

            console.log('Product added successfully:', insertResult.rows[0].id);
            return insertResult.rows[0];
        } else {
            console.log('Duplicate entry: Product not added.');
            return null;
        }
    } catch (error: any) {
        throw error;
    }
};

export const addFactoryCategeoryModel = async (data: any) => {
    const client = await pool.connect();
    try {
        for (const category of data) {
            if (!category || typeof category !== 'object') {
                console.error('Invalid category:', category);
                continue;
            }
            const {
                id,
                name,
                slug,
                parent,
                description,
                display,
                image,
                menu_order,
                count,
                _links,
            } = category;

            if (!_links || !_links.self || !_links.collection || !_links.up) {
                console.error('Invalid _links property in category:', category);
                continue;
            }
            await client.query(`
                INSERT INTO factoryCategeory
                (id, name, slug, parent, description, display, image, menu_order, count, self_href, collection_href, up_href)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);
            `, [
                id, name, slug, parent, description, display, image, menu_order, count,
                _links.self[0]?.href, _links.collection[0]?.href, _links.up[0]?.href,
            ]);
        }
    } finally {
        client.release();
    }
}
