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
    INSERT INTO factoryProduct (name, permalink, price, dimensions, categories, images, short_description)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
`;

export const allFactoryProduct = `
    INSERT INTO factoryProductsAll (name, slug, permalink, price, dimensions, categories, images, short_description,date_created,date_created_gmt,date_modified,date_modified_gmt,type,status,featured,catalog_visibility,description,regular_price,sale_price,
      date_on_sale_from,
     date_on_sale_from_gmt,
      date_on_sale_to,
      date_on_sale_to_gmt,  
      on_sale,
      purchasable,
      total_sales,
      virtual,
      downloadable,
      downloads,
      download_limit,
      download_expiry,
      external_url,
      button_text,
      tax_status,
      tax_class,
      manage_stock,
      stock_quantity,
      backorders,
      backorders_allowed,
      backordered,
      low_stock_amount,
      sold_individually,
      weight,
      shipping_required,
      shipping_taxable,
      shipping_class,
      shipping_class_id,
      reviews_allowed,
      average_rating,
      rating_count,
      upsell_ids,
      cross_sell_ids,
      parent_id,
      purchase_note,
      tags,
      attributes,
      default_attributes,
      variations,
      grouped_products,
      menu_order,
      price_html,
      related_ids,
      meta_data,
      stock_status,
      has_options,
      _links,
      sku )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46,$47,$48,$49, $50, $51, $52,$53,$54,$55,$56,$57,$58, $59, $60, $61,$62,$63,$64,$65,$66,$67)
    RETURNING *;
`;
