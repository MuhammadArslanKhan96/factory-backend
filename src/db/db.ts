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

createTable(
    "factoryCategeory",
    `id INTEGER,
    name VARCHAR(255),
    slug VARCHAR(255),
    parent INTEGER,
    description TEXT,
    display VARCHAR(255),
    image VARCHAR(255),
    menu_order INTEGER,
    count INTEGER,
    self_href VARCHAR(255),
    collection_href VARCHAR(255),
    up_href VARCHAR(255) `
)

export default pool
