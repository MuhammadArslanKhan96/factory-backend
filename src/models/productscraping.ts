import pool from "../db/db";
import { factoryProductQuery, productAcessioriesQuerey, productDetailsQuerey, productListQuerey } from "../helpers/queries/products";
import { uploadImageToS3 } from "../helpers/uploadImage/s3bucket";

export const insertSubCategeoryOnDb = async (dataToInsert: any) => {
    try {
        const insertionPromises = dataToInsert.map(async (data: any) => {
            const description_elements = JSON.parse(data.description_elements);
            const { pimId } = data;

            const existingSubCategory = await pool.query('SELECT * FROM subcategeory WHERE pimId = $1', [pimId]);
            const s3Key = `images/${pimId}_${Date.now()}.jpg`
            const upadteimage = await uploadImageToS3(data.image_src, s3Key);
            if (existingSubCategory.rows.length === 0) {
                const response = await pool.query(
                    'INSERT INTO subcategeory (name, pimId, url, image_src, image_alt, description_elements) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                    [data.name, data.pimId, data.url, upadteimage, data.image_alt, description_elements]
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
            console.log('Product Details Add Sucessfully.', result.rows[0].id);
            return result.rows[0];
        } else {
            console.log('Duplicate entry: Document not added.');
        }
        console.log("All Details Added Sucessufully")
    } catch (error) {
        throw error;
    }
};

export const insertListsOndDb = async (product: any) => {
    const { code, image } = product;
    try {
        const existingProduct = await pool.query('SELECT * FROM productLists WHERE code = $1', [code]);
        if (existingProduct.rows.length === 0) {
            const s3Key = `images/${code}_${Date.now()}.jpg`
            const uploadedImageUrl = await uploadImageToS3(image, s3Key);

            product.image = uploadedImageUrl;

            const insertResult = await pool.query(productListQuerey, [
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
            ]);

            const insertedProduct = insertResult.rows[0];

            if (insertedProduct) {
                console.log(`Product added successfully`, insertedProduct.id);
            } else {
                console.log('Duplicate entry: Product not added.');
            }

            return insertedProduct;
        } else {
            console.log('Duplicate entry: Product not added.');
            return null;
        }
    } catch (error) {
        console.error('Error adding product to the database:', error);
        throw error;
    }
};

export const insertAccessoryIntoDatabase = async (accessory: any) => {
    try {
        const query = `
            INSERT INTO accessories (
                name,productList
            ) VALUES ($1, $2,)`;
    } catch (error) {
        console.error('Error inserting accessory into the database:', error);
        throw error;
    }
}


export const insertProductsFesto = async (product: any) => {
    const client = await pool.connect();


    try {
        const query = `
        INSERT INTO festoMetaData (code, GTIN, pdf, technicalData, reliabilityDatasheet, spareParts, price, accessories, technicalDataDetails, images)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id
        `;
        const checkQuery = 'SELECT * FROM festoMetaData WHERE code = $1';
        const checkResult = await client.query(checkQuery, [product.code]);
        if (checkResult.rows.length === 0) {
            const values = [
                product.code,
                product.GTIN,
                product.pdf,
                product.technicalData,
                product.reliabilityDatasheet,
                product.spareParts,
                product.price,
                JSON.stringify(product.accessories),
                product.technicalDataDetails,
                JSON.stringify(product.images),
            ];
            const result = await client.query(query, values);
            const insertedId = result.rows[0].id;
            console.log(`Product Meta Data inserted successfully with ID: ${insertedId}`);
        }
        else {
            console.log("Duplacite product does not exist")
        }
    } catch (error) {
        console.error('Error inserting data:', error);
    } finally {
        client.release();
    }
};



