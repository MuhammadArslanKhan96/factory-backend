import express, { json } from "express";
import pool from "../../../db/db";
import { ExpressionType } from "aws-sdk/clients/glacier";

export const getDetailsInDb = async (req: express.Request, res: express.Response) => {
    try {
        const response = await pool.query("SELECT * FROM productdetails")
        const responsedata = response.rows;
        res.json(responsedata)
    } catch (error) {
        res.status(500).json({ message: "Server Error" })
    }
}

export const getListsInDb = async (req: express.Request, res: express.Response) => {
    try {
        const getAllLists = await pool.query("SELECT * FROM productLists");
        const data = getAllLists.rows;
        res.json(data)
    } catch (error) {

    }
}

export const getAllAccessoriesInDb = async (req: express.Request, res: express.Response) => {
    try {
        const result = await pool.query('SELECT * FROM accessories');
        const data = result.rows;

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

export const getUrlCode = async () => {
    try {
        const result = await pool.query('SELECT url FROM productLists');
        return result.rows.map(row => row.url);
    } catch (error) {
        throw error;
    }
};

export const getSubCategeory = async (req: express.Request, res: express.Response) => {
    try {
        const response = await pool.query("SELECT * FROM subcategeory")
        const data = response.rows;
        res.status(200).json(data);
    } catch (error) {
        res.json({ message: "Server Error" })
    }
}
export const getfestoProducts = async (req: express.Request, res: express.Response) => {
    try {
        const response = await pool.query("SELECT * FROM festoMetaData")
        const data = response.rows;
        res.status(200).json({ message: "Product get Sucessfully", data: data });
    } catch (error) {
        res.json({ message: "Server Error" })
    }
}

export const getPimId = async () => {
    try {
        const result = await pool.query('SELECT pimid FROM subcategeory');
        return result.rows.map(row => row.pimid);
    } catch (error) {
        throw error;
    }
};


export const getShortCodesFromDb = async () => {
    try {
        const response = await pool.query("SELECT * FROM productdetails");
        const data = response.rows;
        const shortCodes = data.map(item => item.shortcode);
        return shortCodes;
    } catch (error) {
        throw error
    }
};


export const getFactoryProduct = async (req: express.Request, res: express.Response) => {
    try {
        const response = await pool.query(" SELECT * FROM factoryProduct")
        const data = response.rows;
        res.status(200).json({ meesge: "All Product Get Sucessfully", data: data });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
}

export const getFestoProductsPerPage = async (req: express.Request, res: express.Response) => {
    try {
        const perPage = 100;
        let { page } = req.params as any;

        page = parseInt(page);
        if (isNaN(page) || page < 1) {
            return res.status(400).json({ message: "Invalid page number" });
        }

        const offset = (page - 1) * perPage;

        const dataQuery = {
            text: 'SELECT * FROM productLists ORDER BY id LIMIT $1 OFFSET $2',
            values: [perPage, offset],
        };

        const dataResponse = await pool.query(dataQuery);
        const data = dataResponse.rows;

        const countQuery = 'SELECT COUNT(*) FROM productLists';
        const countResponse = await pool.query(countQuery);
        const totalCount = countResponse.rows[0].count;
        res.status(200).send({ message: `Products for page ${page}`, total: totalCount, data: data, });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const getFactoryCategeory = async (req: express.Request, res: express.Response) => {
    try {
        const response = await pool.query(" SELECT *  FROM factoryCategeory")
        const data = response.rows;
        res.status(200).json({ meesge: "SubCategeory", data: data });
        console.log("🚀 ~ file: getproductdb.ts:90 ~ getFactoryCategeory ~ data:", data.length)
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
}

export const searchProductFesto = async (req: express.Request, res: express.Response) => {
    try {
        const { query } = req.params;
        const searchResults = await pool.query(
            'SELECT *  FROM  productLists  WHERE name = $1',
            [query]
        );
        res.status(200).json({ data: searchResults.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

export const getFestoProductByCode = async (req: express.Request, res: express.Response) => {
    try {
        const { code } = req.params;

        const query = `
            SELECT * FROM festoMetaData
            WHERE code = $1
        `;

        const values = [code];

        const result = await pool.query(query, values);

        if (result.rows.length > 0) {
            const product = result.rows[0];
            res.send({ product });
        } else {
            res.status(404).send({ message: "Product not found" });
        }
    } catch (error) {
        console.error('Error retrieving product by code:', error);
        res.status(500).send({ message: "Server Error" });
    }
};

export const getListByCode = async (req: express.Request, res: express.Response) => {
    try {
        const { code } = req.params;
        const query = `
            SELECT * FROM productLists
            WHERE code = $1
        `;
        const values = [code];

        const result = await pool.query(query, values);

        if (result.rows.length > 0) {
            const product = result.rows[0];
            res.send({ product });
        } else {
            res.status(404).send({ message: "Product not found" });
        }
    } catch (error) {
        console.error('Error retrieving product by code:', error);
        res.status(500).send({ message: "Server Error" });
    }
};

export const getListCode = async () => {
    try {
        const result = await pool.query('SELECT code FROM productLists');
        return result.rows.map(row => row.code);
    } catch (error) {
        throw error;
    }
};




