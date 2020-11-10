import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { Client } from 'pg';
import headers from './headers';
import generateDbConfig from '../db/db-config';
import { addNewProduct } from '../db/queries';

type BodyTypes = {
  title: string,
  description: string,
  count: number,
  price: number,
}

const isBodyInvalid = (body: BodyTypes) : boolean => {
  if (body === null || body === undefined) return true;
  const { title, description, count, price } = body;
  return (typeof title !== 'string'
    && typeof description !== 'string'
    && typeof count !== 'number'
    && typeof price !== 'number'
  );
}

const createProducts: APIGatewayProxyHandler = async (event, _context) => {
  console.log('Invoke createProducts lambda\n');
  console.log('ENVIRONMENT VARIABLES:' + JSON.stringify(process.env, null, 2));
  console.info('EVENT:' + JSON.stringify(event, null, 2));
  
  const body: BodyTypes = JSON.parse(event.body);

  if (isBodyInvalid(body)) {
    return {
      statusCode: 400,
      headers,
      body: 'Product data is invalid'
    }
  } 

  const dbClient = new Client(generateDbConfig(process));

  try {
    await dbClient.connect();
    await dbClient.query('BEGIN');
    await dbClient.query(addNewProduct(body));
    await dbClient.query('COMMIT');

    return {
      statusCode: 200,
      headers,
      body: 'Ok',
    };
  } catch (error) {
    await dbClient.query('ROLLBACK');

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
