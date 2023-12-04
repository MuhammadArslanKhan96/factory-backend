import { db } from "../config/firebase";

export const deleteProductByCode = async (productCode: any) => {
    try {
        const productQuery = await db.collection("productLists").where("code", "==", productCode).get();
        if (productQuery.empty) {
            console.log("Product not found: Unable to delete.");
            return
        }

        const productDoc = productQuery.docs[0];
        await db.collection("productLists").doc(productDoc.id).delete();

        console.log("Product deleted successfully.");
    } catch (error) {
        throw error;
    }
};

export const deleteDetailByShortCode = async (shortCode: any) => {
    try {
        const productQuery = await db.collection("productDetails").where("shortCode", "==", shortCode).get();
        if (productQuery.empty) {
            console.log("Product not found: Unable to delete.");
            return
        }

        const productDoc = productQuery.docs[0];
        await db.collection("productDetails").doc(productDoc.id).delete();

        console.log("Detail deleted successfully.");
    } catch (error) {
        throw error;
    }
};


export const deleteAccessioriesByCode = async (productCode: any) => {
    try {
        const productQuery = await db.collection("accessories").where("code", "==", productCode).get();
        if (productQuery.empty) {
            console.log("Product not found: Unable to delete.");
            return
        }

        const productDoc = productQuery.docs[0];
        await db.collection("accessories").doc(productDoc.id).delete();
        console.log("Product deleted successfully.");
    } catch (error) {
        throw error;
    }
};