import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import fetch from 'node-fetch';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

const getGithubApi: APIGatewayProxyHandler = async (event, _context) => {
  try {
    const response = await fetch('https://api.github.com/');
    const data = await response.json();
  
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data, null, 2),
    };
  } catch(error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify(error.message, null, 2) 
    }
  }
}

export default getGithubApi;
