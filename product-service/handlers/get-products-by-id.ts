import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import products from '../db/furniture.json';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
}

const getProductsById: APIGatewayProxyHandler = async (event, _context) => {
  try {
    console.log('Invoke getProductsById lambda\n');
    console.log('ENVIRONMENT VARIABLES:' + JSON.stringify(process.env, null, 2));
    console.info('EVENT:' + JSON.stringify(event, null, 2));

    const { productId } = event.pathParameters;
    const product = products.find(({ id }) => (id === productId));
  
    if (!product) {
      throw new Error(`Product with id: ${productId} not found`);
    } 

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(product, null, 2),
    };
  } catch(error) {
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify(error.message),
    }
  }
}

export default getProductsById;
