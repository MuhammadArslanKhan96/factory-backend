import pool from "../db/db";

export const deleteProductByCode = async (productCode: any) => {
    try {
        const result = await pool.query("DELETE FROM productDetails WHERE code = $1 RETURNING", productCode) as any
        if (result?.rowCount > 0) {
        } else {
        }
    } catch (error) {
        throw error
    }
};

export const deleteDetailByShortCode = async (shortCode: any) => {
    try {
        const result = await pool.query("DELETE FROM productLists WHERE code = $1 RETURNING", shortCode) as any
        if (result?.rowCount > 0) {
        } else {
        }
    } catch (error) {
        throw error
    }
};

export const deleteAccessioriesByCode = async (productCode: any) => {
    try {
        const result = await pool.query("DELETE FROM accessories WHERE code = $1 RETURNING", productCode) as any
        if (result?.rowCount > 0) {
        } else {
        }
    } catch (error) {
        throw error
    }
};