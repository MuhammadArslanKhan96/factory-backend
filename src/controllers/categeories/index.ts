import express from "express";
import pool from "../../db/db";

export const getProductByCategory = async (req: express.Request, res: express.Response) => {
    const { slug, page } = req.params;

    try {
        const itemsPerPage = 100;
        const offset = (parseInt(page) - 1) * itemsPerPage;

        const productsQuery = `
            SELECT 
                product.id,
                product.name,
                product.price,
                product.sku,
                image->>'src' as image_src
            FROM factoryProductsAll AS product
            JOIN unnest(product.categories) cat ON true
            JOIN unnest(product.images) image ON true
            WHERE cat->>'slug' = $1
            ORDER BY product.name
            LIMIT $2 OFFSET $3;
        `;

        const countQuery = `
            SELECT COUNT(*) AS total
            FROM factoryProductsAll AS product
            JOIN unnest(product.categories) cat ON true
            WHERE cat->>'slug' = $1;
        `;

        const [productsResponse, countResponse] = await Promise.all([
            pool.query(productsQuery, [slug, itemsPerPage, offset]),
            pool.query(countQuery, [slug]),
        ]);

        const products = productsResponse.rows;
        const totalProducts = countResponse.rows[0].total;

        res.send({ total: totalProducts, data: products, });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error" });
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

export const getCategoryPage = async (req: express.Request, res: express.Response) => {
    try {
        const page = req.params.page ? parseInt(req.params.page) : 1;
        const itemsPerPage = 100;
        const offset = (page - 1) * itemsPerPage;

        const productsResponse = await pool.query(`
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
                unnest(product.categories) cat ON true
            JOIN
                unnest(product.images) image ON true
            GROUP BY
                cat->>'slug', cat->>'name'
            ORDER BY
                name
            LIMIT
                $1
            OFFSET
                $2;
        `, [itemsPerPage, offset]);

        const data = productsResponse.rows;

        const countQuery = 'SELECT COUNT(DISTINCT cat->>\'slug\') FROM factoryProductsAll, unnest(categories) cat';
        const countResponse = await pool.query(countQuery);
        const totalCount = parseInt(countResponse.rows[0].count);

        res.send({ total: totalCount, data: data });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ message: "Server error" });
    }
};

