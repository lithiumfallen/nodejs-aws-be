import * as AWS from 'aws-sdk';
import 'source-map-support/register';


export const catalogBatchProcess = async (event) => {
  console.log(JSON.stringify(event, null, 2))
  const sns = new AWS.SNS({ region: 'eu-west-1' });
  console.log(process.env.SNS_ARN);
  sns.publish({
    Subject: 'Product added into db',
    TopicArn: process.env.SNS_ARN,
    Message: JSON.stringify(event, null, 2),
  }, (error, body) => {
    console.log('error: ' + error?.message);
    console.log('body: ' + JSON.stringify(body));
  })
};