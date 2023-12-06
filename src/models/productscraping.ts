import pool from "../db/db";
import { factoryProductQuery, productAcessioriesQuerey, productDetailsQuerey, productListQuerey } from "../helpers/queries/products";
import { uploadImageToS3 } from "../helpers/uploadImage/s3bucket";

export const insertSubCategeoryOnDb = async (dataToInsert: any) => {
    try {
        const insertionPromises = dataToInsert.map(async (data: any) => {
            const description_elements = JSON.parse(data.description_elements);
            const { pimId } = data;

            const existingSubCategory = await pool.query('SELECT * FROM subcategeory WHERE pimId = $1', [pimId]);

            if (existingSubCategory.rows.length === 0) {
                const response = await pool.query(
                    'INSERT INTO subcategeory (name, pimId, url, image_src, image_alt, description_elements) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                    [data.name, data.pimId, data.url, data.image_src, data.image_alt, description_elements]
                );
                return response.rows[0];
            } else {
                console.log("Duplicate entry: Product not added.");
                return null;
            }
        });

        return await Promise.all(insertionPromises);
    } catch (error) {
        throw error;
    }
};

export const insertDetailsOnDb = async (details: any) => {
    try {
        const {
            name,
            code,
            isCoreRange,
            orderCode,
            url,
            minOrderQuantity,
            maxOrderQuantity,
            orderQuantityInterval,
            unit,
            isConfigurable,
            descriptionPoints,
            imageSrc,
            marketingBadge,
            isArticle,
            shortCode,
            breadcrumbValues,
            identCode1,
            identCode2,
            isDidactic,
            shortDescription,
        } = details;

        const existingDoc = await pool.query(
            'SELECT * FROM productDetails WHERE code = $1 AND orderCode = $2',
            [code, orderCode]
        );

        if (existingDoc.rows.length === 0) {
            const result = await pool.query(productDetailsQuerey,
                [name, code, isCoreRange, orderCode, url, minOrderQuantity, maxOrderQuantity, orderQuantityInterval, unit, isConfigurable, descriptionPoints, imageSrc, marketingBadge, isArticle, shortCode, breadcrumbValues, identCode1, identCode2, isDidactic, shortDescription]
            );
            console.log('Document added to the collection.');
            return result.rows[0];
        } else {
            console.log('Duplicate entry: Document not added.');
        }
    } catch (error) {
        throw error;
    }
};

export const insertListsOndDb = async (product: any) => {
    const { code } = product;

    try {
        const existingProduct = await pool.query('SELECT * FROM productLists WHERE code = $1', [code]);

        if (existingProduct.rows.length === 0) {
            const insertResult = await pool.query(productListQuerey,
                [
                    product.name,
                    product.code,
                    product.isCoreRange,
                    product.orderCode,
                    product.url,
                    product.minOrderQuantity,
                    product.maxOrderQuantity,
                    product.orderQuantityInterval,
                    product.unit,
                    product.isConfigurable,
                    product.cadSrc,
                    product.image,
                    product.marketingBadge,
                    product.isAddToCartDisabled,
                    product.isDataSheetAvailable,
                ]
            );
            return insertResult.rows[0];
        } else {
            console.log('Duplicate entry: Product not added.');
            return null;
        }
    } catch (error) {
        throw error;
    }
}

export const insertAccessoryIntoDatabase = async (accessoryData: any) => {
    try {
        for (const accessory of accessoryData.accessoryList) {
            for (const product of accessory.productList) {
                const existingAccessory = await pool.query(
                    'SELECT * FROM accessories WHERE code = $1',
                    [product.code]
                );

                if (existingAccessory.rows.length === 0) {
                    const response = await pool.query(productAcessioriesQuerey,
                        [
                            product.name,
                            product.code,
                            product.isCoreRange,
                            product.orderCode,
                            product.url,
                            product.minOrderQuantity,
                            product.maxOrderQuantity,
                            product.orderQuantityInterval,
                            product.unit,
                            product.isConfigurable,
                            product.cadSrc,
                            product.isDataSheetAvailable,
                            product.isRecommendedAccessory,
                            product.imageSrc,
                        ]
                    );
                    console.log("🚀 ~ insertAccessoryIntoDatabase ~ response:", response.rows[0].id);
                } else {
                    console.log("Duplicate entry: Product not added.");
                }
            }
        }
    } catch (error) {
        throw error;
    }
};





