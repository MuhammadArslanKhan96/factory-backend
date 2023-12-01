export const createUser = "INSERT INTO users (username, email, phone, password_hash) VALUES ($1, $2, $3, $4) RETURNING *";
export const loginUser = "SELECT * FROM users WHERE email = $1";
export const getUser = "SELECT * FROM users";
export const  updateUser = "UPDATE users username = $1, email = $2, phone = $3 WHERE user_id = $5 RETURNING *"


   