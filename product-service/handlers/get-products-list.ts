import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { Client } from 'pg';
import headers from './headers';
import generateDbConfig from '../db/db-config';
import { selectAllProducts } from '../db/queries';

const getProductsList: APIGatewayProxyHandler = async (event, _context) => {
  console.log('Invoke getProductsList lambda\n');
  console.log('ENVIRONMENT VARIABLES:' + JSON.stringify(process.env, null, 2));
  console.info('EVENT:' + JSON.stringify(event, null, 2));

  const dbClient = new Client(generateDbConfig(process));
  await dbClient.connect();

  try {
    const products = await dbClient.query(selectAllProducts);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(products.rows, null, 2),
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

export default getProductsList;
