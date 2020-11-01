import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

const getProductsList: APIGatewayProxyHandler = async (event, _context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'getProductsList',
      input: event,
    }, null, 2),
  };
}

export default getProductsList;
