import { APIGatewayProxyHandler } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import 'source-map-support/register';
import generateResponseObject from './response';

export const importProductsFile: APIGatewayProxyHandler = async (event, _context) => {
  console.log('importProductFile start', event.queryStringParameters.name)

  try {
    const { name } = event.queryStringParameters;

    if(!name) return generateResponseObject(400, 'Inavlid query param');

    const path = `uploaded/${name}`;
    const s3 = new AWS.S3({ region: 'eu-west-1' });
    const s3Params = {
      Bucket: process.env.BUCKET,
      Key: path,
      Expires: 60,
      ContentType: 'text/csv',
    }
    const url = await s3.getSignedUrlPromise('putObject', s3Params);

    return generateResponseObject(200, url)
  } catch (error) {
    return generateResponseObject(500, error)
  }
}
