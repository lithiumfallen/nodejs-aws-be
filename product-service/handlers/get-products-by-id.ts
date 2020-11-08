import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { Client } from 'pg';
import headers from './headers';
import generateDbConfig from '../db/db-config';
import { selectProductById } from '../db/queries';

const getProductsById: APIGatewayProxyHandler = async (event, _context) => {
  console.log('Invoke getProductsById lambda\n');
  console.log('ENVIRONMENT VARIABLES:' + JSON.stringify(process.env, null, 2));
  console.info('EVENT:' + JSON.stringify(event, null, 2));
  const dbClient = new Client(generateDbConfig(process));
  try {
    await dbClient.connect()
    const { productId } = event.pathParameters;
    const product = await dbClient.query(selectProductById(productId));

    if (!product && !product.rows && product.rows.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: `Product with id = ${productId} not found`,
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(product.rows, null, 2),
    };
  } catch(error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify(error.message),
    }
  } finally {
    dbClient.end();
  }
}

export default getProductsById;
