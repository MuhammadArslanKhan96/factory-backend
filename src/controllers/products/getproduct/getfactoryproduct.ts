import express from "express";
import pool from "../../../db/db";

export const getAllProduct = async (req: express.Request, res: express.Response) => {
    try {
        const response = await pool.query(" SELECT * FROM  factoryProductsAll")
        const countQuery = 'SELECT COUNT(*) FROM factoryProductsAll';
        const countResponse = await pool.query(countQuery);
        const totalCount = countResponse.rows[0].count;
        const data = response.rows;
        res.status(200).json({ meesge: "AllProduct", totalProduct: totalCount, data: data });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
}

export const getFactoryProductById = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
    }
    try {
        const response = await pool.query("SELECT * FROM factoryProductsAll WHERE id = $1", [productId]);

        if (response.rows.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }
        const product = response.rows[0];
        res.status(200).json({ message: "Product retrieved successfully", data: product });
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const searchProduct = async (req: express.Request, res: express.Response) => {
    try {
        const { query } = req.params;
        const searchResults = await pool.query(
            'SELECT *  FROM  factoryProduct WHERE name = $1',
            [query]
        );
        console.log("🚀 ~ file: getproductdb.ts:137 ~ searchProduct ~ searchQuery:", query)
        res.status(200).json({ data: searchResults.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

export const getFactoryProductsPerPage = async (req: express.Request, res: express.Response) => {
    try {
        const perPage = 100;
        let { page } = req.params as any;

        page = parseInt(page);
        if (isNaN(page) || page < 1) {
            return res.status(400).json({ message: "Invalid page number" });
        }

        const offset = (page - 1) * perPage;

        const dataQuery = {
            text: 'SELECT * FROM factoryProductsAll ORDER BY id LIMIT $1 OFFSET $2',
            values: [perPage, offset],
        };

        const dataResponse = await pool.query(dataQuery);
        const data = dataResponse.rows;

        const countQuery = 'SELECT COUNT(*) FROM factoryProductsAll';
        const countResponse = await pool.query(countQuery);
        const totalCount = countResponse.rows[0].count;
        res.status(200).send({ message: `Products for page ${page}`, data: data, total: totalCount });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};