create extension if not exists "uuid-ossp";

create table products if not exists (
	id uuid primary key default uuid_generate_v4(),
	title text not null,
	description text,
	price int
);

create table stock if not exists (
	product_id uuid,
	count int,
	foreign key ("product_id") references "products" ("id")
);

with data(title, description, count, price) as (
	values
	  ('Bed with drawers', 'description one', 23, 294),
	  ('Bed with playground', 'description two', 14, 244),
	  ('Wardrobe with two doors', 'description three', 12, 355),
	  ('Wardrobe with three doors', 'description four', 8, 493),
	  ('Open shelf bookcase narrow', 'description five', 4, 170),
	  ('Open shelf bookcase wide', 'description six', 5, 206),
	  ('Desk with drawer', 'description seven', 26, 130),
	  ('Commode small', 'with 5 drawers', 7, 143),
	  ('Commode wide', 'with 3 wide drawers and 2 small', 16, 246),
	  ('Nightstand', 'description ten', 8, 75)
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
