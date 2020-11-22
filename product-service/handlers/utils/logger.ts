import { APIGatewayProxyEvent, SQSEvent } from 'aws-lambda';

const logger = (handler: string, event : APIGatewayProxyEvent | SQSEvent) => {
  console.log(`Invoke ${handler} lambda\n`);
  console.log('ENVIRONMENT VARIABLES:' + JSON.stringify(process.env, null, 2));
  console.info('EVENT:' + JSON.stringify(event, null, 2));
}

export default logger;
