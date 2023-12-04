import express from "express";
import { deleteAccessioriesByCode, deleteDetailByShortCode, deleteProductByCode } from "../../models/delete";
export const deleteProduct = async (req: express.Request, res: express.Response) => {
    const { code } = req.params
    try {
        const response = await deleteProductByCode(code);
        res.json({ message: "Product Delete Sucessfully" })
    } catch (error) {
        res.status(500).json({ message: "Server Error" })
    }
}

export const deleteDetail = async (req: express.Request, res: express.Response) => {
    const { shortCode } = req.params
    try {
        const response = await deleteDetailByShortCode(shortCode);
        res.json({ message: "Detail Delete Sucessfully" })
    } catch (error) {
        res.status(500).json({ message: "Server Error" })
    }
}



export const deleteAccessiories = async (req: express.Request, res: express.Response) => {
    const { code } = req.params
    try {
        const response = await deleteAccessioriesByCode(code);
        res.json({ message: "Detail Delete Sucessfully" })
    } catch (error) {
        res.status(500).json({ message: "Server Error" })
    }
}