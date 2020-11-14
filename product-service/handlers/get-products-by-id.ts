import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { Client } from 'pg';
import generateDbConfig from '../db/db-config';
import { selectProductByIdQuery } from '../db/queries';
import { logger, isUUID, generateResponseObject } from './utils';

const getProductsById: APIGatewayProxyHandler = async (event, _context) => {
  logger('getProductsById', event);

  const { productId } = event.pathParameters;

  if (!isUUID(productId)) {
    return generateResponseObject(400, 'Invalid query parametr');
  }

  const dbClient = new Client(generateDbConfig(process));

  try {
    await dbClient.connect()
    const product = await dbClient.query(selectProductByIdQuery, [productId]);

    if (product?.rows?.length) {
      return generateResponseObject(200, product.rows[0]);
    } else {
      return generateResponseObject(404, `Product with id = ${productId} not found`);
    }
  } catch(error) {
    return generateResponseObject(500, error.message);
  } finally {
    dbClient.end();
  }
}

export default getProductsById;
