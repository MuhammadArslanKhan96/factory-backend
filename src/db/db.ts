import { Pool } from "pg";
import env from "dotenv";
//@ts-ignore
env.config("dotenv");

const host = process.env.PGHOST
const database = process.env.PGDATABASE
const port = process.env.PG_PORT

const pool = new Pool({
    user: process.env.PGUSER,
    host,
    database,
    password: process.env.PGPASSWORD,
    port: 5432,
});

const createTable = async (tableName: string, columns: string): Promise<void> => {
    await pool.query(`CREATE TABLE IF NOT EXISTS ${tableName} (${columns})`);
};
createTable(
    "productLists",
    "id SERIAL PRIMARY KEY, name VARCHAR(255), code VARCHAR(50),isCoreRange BOOLEAN,orderCode VARCHAR(50),url VARCHAR(255),minOrderQuantity INT NOT NULL,maxOrderQuantity INT NOT NULL,orderQuantityInterval INT NOT NULL,unit VARCHAR(50),isConfigurable BOOLEAN NOT NULL,cadSrc VARCHAR(255),image VARCHAR(255),marketingBadge VARCHAR(50),isAddToCartDisabled BOOLEAN,isDataSheetAvailable BOOLEAN"
);
createTable(
    "accessories",
    "id SERIAL PRIMARY KEY,name VARCHAR(255),code VARCHAR(255),isCoreRange BOOLEAN,orderCode VARCHAR(255),url VARCHAR(255),minOrderQuantity INT,maxOrderQuantity INT,orderQuantityInterval INT,unit VARCHAR(50), isConfigurable BOOLEAN,cadSrc VARCHAR(255),isDataSheetAvailable BOOLEAN,isRecommendedAccessory BOOLEAN,imageSrc VARCHAR(255)"
);
createTable(
    "productDetails",
    " id SERIAL PRIMARY KEY,name VARCHAR(255), code VARCHAR(255), isCoreRange BOOLEAN, orderCode VARCHAR(255), url VARCHAR(255), minOrderQuantity INT, maxOrderQuantity INT, orderQuantityInterval INT, unit VARCHAR(255), isConfigurable BOOLEAN,  descriptionPoints TEXT[], imageSrc VARCHAR(255), marketingBadge VARCHAR(255), isArticle BOOLEAN, shortCode VARCHAR(255), breadcrumbValues TEXT[], identCode1 VARCHAR(255), identCode2 VARCHAR(255), isDidactic BOOLEAN,shortDescription TEXT"
);
createTable(
    "subcategeory",
    "id SERIAL PRIMARY KEY,name VARCHAR(255) NOT NULL,pimId VARCHAR(50) NOT NULL , url VARCHAR(255) NOT NULL, image_src VARCHAR(255) NOT NULL,image_alt VARCHAR(255) NOT NULL,description_elements TEXT"
)
createTable(
    "factoryProductsAll",
    `id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug  VARCHAR NULL,
    permalink VARCHAR(255) NOT NULL,
    price VARCHAR NULL,
    dimensions JSONB,
    categories jsonb[]  NULL,
    images jsonb[]  NULL,
    short_description TEXT, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_created VARCHAR NULL,
    date_created_gmt VARCHAR NULL,
    date_modified VARCHAR NULL,
    date_modified_gmt VARCHAR NULL,
    type VARCHAR NULL,
    status VARCHAR NULL,
    featured VARCHAR NULL,
    catalog_visibility VARCHAR NULL,
    description VARCHAR NULL,
    regular_price VARCHAR NULL,
    sale_price VARCHAR NULL,
    date_on_sale_from VARCHAR NULL,
    sku VARCHAR NULL, 
    date_on_sale_from_gmt VARCHAR NULL,
    date_on_sale_to VARCHAR NULL,
    date_on_sale_to_gmt VARCHAR NULL,
    on_sale VARCHAR NULL,
    purchasable VARCHAR NULL,
    total_sales  VARCHAR NULL,
    virtual VARCHAR NULL,
    downloadable VARCHAR NULL,
    downloads  jsonb[]  NULL ,
    download_limit  VARCHAR NULL,
    download_expiry  VARCHAR NULL,
    external_url  VARCHAR NULL,
    button_text VARCHAR NULL,
    tax_status VARCHAR NULL,
    tax_class VARCHAR NULL,
    manage_stock VARCHAR NULL,
    stock_quantity VARCHAR NULL,
    backorders VARCHAR NULL,
    backorders_allowed VARCHAR NULL,
    backordered VARCHAR NULL,
    low_stock_amount VARCHAR NULL,
    sold_individually VARCHAR NULL,
    weight VARCHAR NULL,
    shipping_required VARCHAR NULL,
    shipping_taxable VARCHAR NULL,
    shipping_class VARCHAR NULL,
    shipping_class_id VARCHAR NULL,
    average_rating  VARCHAR NULL,
    reviews_allowed VARCHAR NULL,
    rating_count VARCHAR NULL,
    upsell_ids jsonb[]  NULL,
    cross_sell_ids jsonb[]  NULL,
     parent_id VARCHAR NULL,
    purchase_note VARCHAR NULL,
    tags jsonb[]  NULL,
    attributes jsonb[]  NULL,
    default_attributes jsonb[]  NULL,
    variations jsonb[]  NULL,
    grouped_products jsonb[]  NULL,
    menu_order VARCHAR NULL,
    price_html VARCHAR NULL,
    related_ids JSONB NULL,
    meta_data JSONB NULL,
    stock_status VARCHAR NULL,
    has_options VARCHAR NULL,
    _links JSONB`
)

createTable(
    "factoryCategeory",
    `id INTEGER,
    name VARCHAR(255),
    descritpion VARCHAR NULL,
    slug VARCHAR(255),
    parent INTEGER,
    sku VARCHAR NULL,
    description TEXT,
    display VARCHAR(255),
    image VARCHAR(255),
    menu_order INTEGER,
    count INTEGER,
    self_href VARCHAR(255),
    collection_href VARCHAR(255),
    up_href VARCHAR(255) `
)

createTable(
    "factoryProduct",
    `id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    permalink VARCHAR(255) NOT NULL,
    price VARCHAR NULL,
    dimensions JSONB,
    categories VARCHAR(255) ARRAY,
    images VARCHAR(255) ARRAY,
    short_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
)

export default pool
