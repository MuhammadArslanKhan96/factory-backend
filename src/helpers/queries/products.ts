export const productQueries = "INSERT INTO newproduct ( name, code, isCoreRange, orderCode, url,minOrderQuantity, maxOrderQuantity, orderQuantityInterval,unit, isConfigurable, cadSrc, image,marketingBadge, isAddToCartDisabled, isDataSheetAvailable) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *"
export const productDetailsQueries = ` INSERT INTO details (
  name, code, is_core_range, order_code, url, min_order_quantity, max_order_quantity,
  order_quantity_interval, unit, is_configurable, description_points, image_src,
  marketing_badge, is_article, short_code, breadcrumb_values, ident_code_1,
  ident_code_2, is_didactic, short_description
) VALUES
  ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20);
`;
;

export const subCategeory = "INSERT INTO subcategeory ( name, pimId, url, image, src , alt, descriptionElements ) VALUES ($1 ,$2 ,$3 ,$4, $5, $6, $7) RETURNING *"