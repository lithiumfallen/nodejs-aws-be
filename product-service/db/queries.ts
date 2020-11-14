export const selectAllProductsQuery = `SELECT id, title, description, price, count FROM products p LEFT JOIN stock s on s.product_id = p.id;`;
export const selectProductByIdQuery = `SELECT id, title, description, price, count FROM products p LEFT JOIN stock s on s.product_id = p.id WHERE (p.id = $1);`;
export const insertProductQuery = `INSERT INTO products (title, description, price) VALUES ($1, $2, $3) RETURNING id`;
export const insertStocQuery = `INSERT INTO stock (product_id, count) VALUES ($1, $2)`;
