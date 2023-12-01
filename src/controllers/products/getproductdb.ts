import express from "express";
// import pool from "../../db/db";
import { db } from "../../config/firebase";
import { deleteProductByCode } from "../../models/productscraping";
// P G
// export const getDetailsInDb = async (req: express.Request, res: express.Response) => {
//     try {
//         const response = await pool.query("SELECT * FROM details")
//         const responsedata = response.rows;
//         console.log("🚀 ~ file: getproductdb.ts:8 ~ getDetailsInDb ~ responsedata:", responsedata.length)
//         res.json({ meesage: "Product Details", data: responsedata })
//     } catch (error) {
//         res.status(500).json({ message: "Server Error" })
//     }
// }

export const getDetailsInDb = async (req: express.Request, res: express.Response) => {
    try {
        const snapshot = await db.collection('productLists').get();
        const data = snapshot.docs.map(doc => doc.data());

        res.json({ meesage: "Product Details", data: data })
    } catch (error) {
        res.status(500).json({ message: "Server Error" })
    }
}
// PG
// export const getListsInDb = async (req: express.Request, res: express.Response) => {
//     try {
//         const getAllLists = await pool.query("SELECT * FROM newproduct");
//         const data = getAllLists.rows;
//         res.json(data)
//     } catch (error) {

//     }
// }

export const getListsInDb = async (req: express.Request, res: express.Response) => {
    try {
        const snapshot = await db.collection('productLists').get();
        const data = snapshot.docs.map(doc => doc.data());
        res.json(data);
    } catch (error) {
        res.json({ message: "Server Error" })
    }
}

export const getAlAcessioriesInDb = async (req: express.Request, res: express.Response) => {
    try {
        const snapshot = await db.collection('accessories').get();
        const data = snapshot.docs.map(doc => doc.data());


        res.status(200).json({ message: "Product Accessories", data: data });
    } catch (error) {
        res.json({ message: "Server Error" })
    }
}

export const getListsCode = async () => {
    try {
        const querySnapshot = await db.collection('productLists').get();
        const code = querySnapshot.docs.map(doc => doc.data().code);

        return code
    } catch (err) {
        throw err;
    }
};

export const deleteProduct = async (req: express.Request, res: express.Response) => {
    const { code } = req.params
    try {
        const response = await deleteProductByCode(code);
        res.json({ message: "Product Delete Sucessfully" })
    } catch (error) {
        res.status(500).json({ message: "Server Error" })
    }
}

// PG

// export const getShortCodesFromDb = async () => {
//     try {
//         const response = await pool.query("SELECT * FROM details");
//         const data = response.rows;
//         // Extract shortCode values
//         const shortCodes = data.map(item => item.short_code);
//         return shortCodes;
//     } catch (error) {
//         throw error
//     }
// };

// Firebase Function
export const getShortCodesFromDb = async () => {
    try {
        const querySnapshot = await db.collection('productDetails').get();
        const shortCodes = querySnapshot.docs.map(doc => doc.data().shortCode);

        return shortCodes;
    } catch (error) {
        throw error;
    }
};

// PG

// export const getSubCategeory = async (req: express.Request, res: express.Response) => {
//     try {
//         const response = await pool.query("SELECT * FROM subcategeory")
//         const data = response.rows;
//         console.log("🚀 ~ file: getproductdb.ts:62 ~ getSubCategeory ~ data:", data.length)
//         res.status(200).json({ meesge: "SubCategeory", data: data });
//     } catch (error) {
//         res.json({ message: "Server Error" })
//     }
// }

// Firebase Function

export const getSubCategeory = async (req: express.Request, res: express.Response) => {
    try {
        const snapshot = await db.collection('subCategory').get();
        const data = snapshot.docs.map(doc => doc.data());

        console.log("Data:", data.length);

        res.status(200).json({ message: "SubCategory", data: data });
    } catch (error) {
        res.json({ message: "Server Error" })
    }
}


export const getPimId = async () => {
    try {
        const querySnapshot = await db.collection('subCategory').get();
        const pimIds = querySnapshot.docs.map(doc => doc.data().pimId);
        return pimIds;
    } catch (error) {
        throw error;
    }
};

