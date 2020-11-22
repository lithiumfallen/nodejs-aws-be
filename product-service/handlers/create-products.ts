import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { Client } from 'pg';
import generateDbConfig from '../db/db-config';
import { Product, ProductSchema } from '../db/models/Product';
import { insertProductQuery, insertStockQuery } from '../db/queries'
import { logger, generateResponseObject } from './utils';

const createProducts: APIGatewayProxyHandler = async (event, _context) => {
  logger('createProducts', event);
 
  const body: Product = JSON.parse(event.body);
  const isValid = await ProductSchema.isValid(body);

  if (!isValid) {
    return generateResponseObject(400, 'Product data is invalid')
  }

  const dbClient = new Client(generateDbConfig(process));

  try {
    const { title, description, price, count } = body;
    await dbClient.connect();
    await dbClient.query('BEGIN');
    const response = await dbClient.query(insertProductQuery, [title, description, price]);
    await dbClient.query(insertStockQuery, [response.rows[0].id, count]);
    await dbClient.query('COMMIT');

    return generateResponseObject(200, 'Ok')
  } catch (error) {
    await dbClient.query('ROLLBACK');

    return generateResponseObject(500, error.message);
  } finally {
    dbClient.end();
  }
}

export default createProducts;
