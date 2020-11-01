import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

const getProductsById: APIGatewayProxyHandler = async (event, _context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'getProductsById',
      input: event,
    }, null, 2),
  };
}

export default getProductsById;
