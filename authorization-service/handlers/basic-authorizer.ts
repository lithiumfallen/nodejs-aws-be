import { APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerHandler, APIGatewayTokenAuthorizerEvent } from 'aws-lambda';
import 'source-map-support/register';

const generatePolicy = (
  principalId: string,
  resource: string,
  effect: 'Allow' | 'Deny'
): APIGatewayAuthorizerResult => ({
  principalId,
  policyDocument: {
      Version: '2012-10-17',
      Statement: [{
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource
      }]
  }
});

export const basicAuthorizer: APIGatewayTokenAuthorizerHandler = async (event: APIGatewayTokenAuthorizerEvent, _context, cb) => {
  console.log('Invoke basicAuthorizer', JSON.stringify(event, null, 2));

  if (event?.type !== 'TOKEN') {
      cb('Unauthorized')
  }

  try {
    const { authorizationToken, methodArn } = event;
    const credentials = authorizationToken.split(' ')[1];
    const [user, password] = Buffer.from(credentials, "base64").toString("utf-8").split(":");
    const isValidCredentials = process.env[user] === password;

    return generatePolicy(credentials, methodArn, isValidCredentials ? 'Allow' : 'Deny');
  } catch (error) {
    cb('Unauthorized')
  }
}
