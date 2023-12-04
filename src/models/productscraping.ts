import { Product, ProductDetailsType } from "../types/product";
import uploadImage from "../helpers/uploadImage";

import { db } from "../config/firebase";

export const insertDataIntoDatabase = async (dataToInsert: any[]): Promise<any[]> => {
    try {
        const insertionPromises = dataToInsert.map(async (data) => {
            const descriptionElementsArray = JSON.parse(data.description_elements);
            const { pimId } = data;

            const existingSubCategory = await db.collection("subCategory").where("pimId", "==", pimId).get();

            if (existingSubCategory.empty) {
                const response = await db.collection("subCategory").add({
                    name: data.name,
                    pimId: data.pimId,
                    url: data.url,
                    image_src: data.image_src,
                    image_alt: data.image_alt,
                    descriptionElementsArray: descriptionElementsArray,
                });
                return response;
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

        const existingDoc = await db.collection('productDetails')
            .where('code', '==', code)
            .where('orderCode', '==', orderCode)
            .get();

        if (existingDoc.empty) {
            const result = await db.collection('productDetails').add({
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
            });
            console.log('Document added to the collection.');
            return result
        } else {
            console.log('Duplicate entry: Document not added.');
        }
    } catch (error) {
        throw error
    }
};

export const insertUniqueProduct = async (
    product: Product
) => {
    const { code } = product
    try {
        const existingProduct = await db.collection("productLists").where("code", "==", code).get();
        if (existingProduct.empty) {
            const insertResult = await db.collection("productLists").add({
                name: product.name,
                code: product.code,
                isCoreRange: product.isCoreRange,
                orderCode: product.orderCode,
                url: product.url,
                minOrderQuantity: product.minOrderQuantity,
                maxOrderQuantity: product.maxOrderQuantity,
                orderQuantityInterval: product.orderQuantityInterval,
                unit: product.unit,
                isConfigurable: product.isConfigurable,
                cadSrc: product.cadSrc,
                image: await uploadImage(product.image),
                marketingBadge: product.marketingBadge,
                isAddToCartDisabled: product.isAddToCartDisabled,
                isDataSheetAvailable: product.isDataSheetAvailable,
            });
            return insertResult
        }
        else {
            console.log("Duplicate entry: Product not added.")
        }
    } catch (error) {
        throw error;
    }
};


export const insertAccessoryIntoDatabase = async (accessoryData: any) => {
    try {
        for (const accessory of accessoryData.accessoryList) {
            for (const product of accessory.productList) {
                const existingAccessory = await db.collection("accessories").where("code", "==", product.code).get();
                if (existingAccessory.empty) {
                    const response = await db.collection("accessories").add({
                        name: product.name,
                        code: product.code,
                        isCoreRange: product.isCoreRange,
                        orderCode: product.orderCode,
                        url: product.url,
                        minOrderQuantity: product.minOrderQuantity,
                        maxOrderQuantity: product.maxOrderQuantity,
                        orderQuantityInterval: product.orderQuantityInterval,
                        unit: product.unit,
                        isConfigurable: product.isConfigurable,
                        cadSrc: product.cadSrc,
                        isDataSheetAvailable: product.isDataSheetAvailable,
                        isRecommendedAccessory: product.isRecommendedAccessory,
                        imageSrc: product.imageSrc,
                    });
                    console.log("🚀 ~ file: productscraping.ts:153 ~ insertAccessoryIntoDatabase ~ response:", response.id)
                    return response
                } else {
                    console.log("Duplicate entry: Product not added.");
                }
            }
        }
    } catch (error) {
        throw error;
    }
};



