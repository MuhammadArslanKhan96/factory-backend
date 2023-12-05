import express from "express";
import pool from "../../db/db";

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

export const getListsCode = async () => {
    try {
        const result = await pool.query('SELECT code FROM productLists');
        return result.rows.map(row => row.code);
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
        res.status(200).json({ meesge: "SubCategeory", data: data });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
}