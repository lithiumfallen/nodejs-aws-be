import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import products from '../db/furniture.json';

const getProductsList: APIGatewayProxyHandler = async (event, _context) => {
  console.log('Invoke getProductsList lambda\n');
  console.log('ENVIRONMENT VARIABLES:' + JSON.stringify(process.env, null, 2));
  console.info('EVENT:' + JSON.stringify(event, null, 2));
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(products),
  };
}

export default getProductsList;
