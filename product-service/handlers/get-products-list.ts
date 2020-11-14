import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { Client } from 'pg';
import generateDbConfig from '../db/db-config';
import { selectAllProductsQuery } from '../db/queries';
import { logger, generateResponseObject } from './utils';

const getProductsList: APIGatewayProxyHandler = async (event, _context) => {
  logger('getProductsList', event);

  const dbClient = new Client(generateDbConfig(process));

  try {
    await dbClient.connect();
    const products = await dbClient.query(selectAllProductsQuery);

    return generateResponseObject(200, products.rows);
  } catch (error) {
    return generateResponseObject(500, error.message);
  } finally {
    dbClient.end();
  }
}

export default getProductsList;
