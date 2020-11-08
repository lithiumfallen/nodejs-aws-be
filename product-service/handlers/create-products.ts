import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { Client } from 'pg';
import headers from './headers';
import generateDbConfig from '../db/db-config';
import { addNewProduct } from '../db/queries';

const createProducts: APIGatewayProxyHandler = async (event, _context) => {
  console.log('Invoke createProducts lambda\n');
  console.log('ENVIRONMENT VARIABLES:' + JSON.stringify(process.env, null, 2));
  console.info('EVENT:' + JSON.stringify(event, null, 2));
  const dbClient = new Client(generateDbConfig(process));

  try {
    await dbClient.connect();
    const body = JSON.parse(event.body) || {};

    if (typeof body.title === 'string' && typeof body.description === 'string' && typeof body.count === 'number' && typeof body.price === 'number') {
      await dbClient.query(addNewProduct(body))
    } else {
      return {
        statusCode: 400,
        headers,
        body: 'Product data is invalid'
      }
    } 

    return {
      statusCode: 200,
      headers,
      body: 'Ok',
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify(error.message)
    }
  } finally {
    dbClient.end();
  }
}

export default createProducts;
