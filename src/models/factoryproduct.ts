import pool from "../db/db";
import { factoryProductQuery } from "../helpers/queries/products";
import { uploadImageToS3 } from "../helpers/uploadImage/s3bucket";
import { FactoryProductCategory } from "../types/product";

export const AddFactoryHelpProductDb = async (product: any) => {
    const { name, permalink, price, categories, images } = product;
    try {
        const existingProduct = await pool.query('SELECT * FROM factoryProduct WHERE name = $1', [name]);
        if (existingProduct.rows.length === 0) {
            const insertResult = await pool.query(factoryProductQuery, [name, permalink, price, categories, images]);
            const imageUrlPromises = images.map(async (image: string, index: number) => {
                const imageKey = `products/${insertResult.rows[0].id}/image${index + 1}.jpg`;
                return uploadImageToS3(image, imageKey);
            });
            const imageUrls = await Promise.all(imageUrlPromises);

            await pool.query('UPDATE factoryProduct  SET images = $1 WHERE id = $2', [imageUrls, insertResult.rows[0].id]);

            console.log('Product added successfully:', insertResult.rows[0]);
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
