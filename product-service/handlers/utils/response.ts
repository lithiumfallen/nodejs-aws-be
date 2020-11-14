import { APIGatewayProxyResult } from "aws-lambda";
import defaultHeaders from './headers';

const generateResponseObject = (statusCode: number, body: any, headers? : object): APIGatewayProxyResult => {
  return {
    statusCode,
    headers: { ...defaultHeaders, ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body, null, 2),
  } 
};

export default generateResponseObject;
