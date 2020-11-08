export const selectAllProducts = `select id, title, description, price, count from products p left join stock s on s.product_id = p.id;`;
export const selectProductById = id => `select id, title, description, price, count from products p left join stock s on s.product_id = p.id where (p.id = '${id}');`;
