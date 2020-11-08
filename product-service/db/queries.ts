export const selectAllProducts = `select id, title, description, price, count from products p left join stock s on s.product_id = p.id;`;
export const selectProductById = id => `select id, title, description, price, count from products p left join stock s on s.product_id = p.id where (p.id = '${id}');`;
export const addNewProduct = ({ title, description, count, price }) => `
  with data(title, description, count, price) as (
    values
      ('${title}', '${description}', ${count}, ${price})
  ), products_insert as (
    insert into products (title, description, price)
    select title, description, price
    from data
    returning title, description, price, id as product_id
  )
  insert into stock (product_id, count)
  select products_insert.product_id, d.count
  from data d
  join products_insert using (title, description, price);
`;
