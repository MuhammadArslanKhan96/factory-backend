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

// const createTable = async (tableName: string, columns: string): Promise<void> => {
//     // Assuming `pool` is a valid connection pool instance
//     await pool.query(`CREATE TABLE IF NOT EXISTS ${tableName} (${columns})`);
// };
// createTable(
//     "newproduct",
//     "id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, code VARCHAR(50) NOT NULL,isCoreRange BOOLEAN NOT NULL,orderCode VARCHAR(50) NOT NULL,url VARCHAR(255) NOT NULL,minOrderQuantity INT NOT NULL,maxOrderQuantity INT NOT NULL,orderQuantityInterval INT NOT NULL,unit VARCHAR(50) NOT NULL,isConfigurable BOOLEAN NOT NULL,cadSrc VARCHAR(255) NOT NULL,image VARCHAR(255) NOT NULL,marketingBadge VARCHAR(50) NOT NULL,isAddToCartDisabled BOOLEAN NOT NULL,isDataSheetAvailable BOOLEAN NOT NULL");
// createTable(
//     "orders",
//     "id SERIAL PRIMARY KEY, name TEXT NOT NULL, price INTEGER NOT NULL,createdby TEXT NOT NULL,createrid INTEGER NOT NULL,status TEXT NOT NULL,isbuy BOOLEAN NOT NULL"
// );
// createTable(
//     "accessories",
//     "id SERIAL PRIMARY KEY,name VARCHAR(255),code VARCHAR(255),isCoreRange BOOLEAN,orderCode VARCHAR(255),url VARCHAR(255),minOrderQuantity INT,maxOrderQuantity INT,orderQuantityInterval INT,unit VARCHAR(50), isConfigurable BOOLEAN,cadSrc VARCHAR(255),isDataSheetAvailable BOOLEAN,isRecommendedAccessory BOOLEAN,imageSrc VARCHAR(255)"
// );
// createTable(
//     "details",
//     " id SERIAL PRIMARY KEY,name VARCHAR(255), code VARCHAR(255), is_core_range BOOLEAN, order_code VARCHAR(255), url VARCHAR(255), min_order_quantity INT, max_order_quantity INT, order_quantity_interval INT, unit VARCHAR(255), is_configurable BOOLEAN, description_points TEXT[], image_src VARCHAR(255), marketing_badge VARCHAR(255), is_article BOOLEAN, short_code VARCHAR(255), breadcrumb_values TEXT[], ident_code_1 VARCHAR(255), ident_code_2 VARCHAR(255), is_didactic BOOLEAN,short_description TEXT"
// );
// createTable(
//     "subcategeory",
//     "id SERIAL PRIMARY KEY,name VARCHAR(255) NOT NULL,pimId VARCHAR(50) NOT NULL , url VARCHAR(255) NOT NULL, image_src VARCHAR(255) NOT NULL,image_alt VARCHAR(255) NOT NULL,description_elements TEXT"
// )

export default pool
