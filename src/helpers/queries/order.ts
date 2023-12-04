export const createOrder = "INSERT INTO orders (name, price, status, createdby, createrid, isbuy ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";

