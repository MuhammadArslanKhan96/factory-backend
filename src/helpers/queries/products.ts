export const productListQuerey = `INSERT INTO productLists (
  name, code, isCoreRange, orderCode, url, minOrderQuantity, maxOrderQuantity,
  orderQuantityInterval, unit, isConfigurable, cadSrc, image, marketingBadge,
  isAddToCartDisabled, isDataSheetAvailable
) VALUES (
  $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
) RETURNING *;
`
export const productAcessioriesQuerey = "INSERT INTO  accessories ( name, code, isCoreRange, orderCode, url,minOrderQuantity, maxOrderQuantity, orderQuantityInterval,unit, isConfigurable, cadSrc, image,marketingBadge, isAddToCartDisabled, isDataSheetAvailable) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *"
export const productDetailsQuerey = ` INSERT INTO productDetails (
  name, code, isCoreRange, orderCode, url, minOrderQuantity, maxOrderQuantity,
  orderQuantityInterval, unit, isConfigurable, descriptionPoints, imagesrc,
  marketingBadge, isArticle, shortCode, breadcrumbValues, identCode1,
  identCode2, isDidactic, shortDescription
) VALUES
  ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20);
`;
;

export const subCategeory = "INSERT INTO subcategeory ( name, pimId, url, image, src , alt, descriptionElements ) VALUES ($1 ,$2 ,$3 ,$4, $5, $6, $7) RETURNING *"
export const factoryProductQuery = `
    INSERT INTO factoryProduct (name, permalink, price, category, images)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
`;