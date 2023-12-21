import express from "express";
import pool from "../../db/db";

export const getProductbyCategeory = async (req: express.Request, res: express.Response) => {
    const { slug } = req.params;
    try {
        const response = await pool.query(`
            SELECT * 
            FROM factoryProductsAll 
            JOIN unnest(categories) cat ON true
            WHERE cat->>'slug' = $1
        `, [slug]);
        const products = response.rows;

        res.send(products);
    } catch (error) {
        console.log("🚀 ~ file: getproductdb.ts:296 ~ getAllProductsByCategory ~ error:", error);
        res.send({ message: "Server error" });
    }
};

export const getCategory = async (req: express.Request, res: express.Response) => {
    try {
        const categoryResponse = await pool.query(`
            SELECT
                cat->>'slug' as category_slug,
                cat->>'name' as category_name,
                MIN(product.id) as id,
                MIN(product.name) as name,
                MIN(product.price) as price,
                MIN(product.sku) as sku,
                MIN(image->>'src') as image_src
            FROM
                factoryProductsAll AS product
            JOIN
                unnest(categories) cat ON true
            JOIN
                unnest(images) image ON true
            GROUP BY
                category_slug, category_name;
        `);

        const categoriesWithDetails = categoryResponse.rows;
        res.send(categoriesWithDetails);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ message: "Server error" });
    }
};

export const getCategoryPage = () => {

}
