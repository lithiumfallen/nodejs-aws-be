import { S3Event } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import 'source-map-support/register';
import * as csv from 'csv-parser';

export const importFileParser = async (event : S3Event) => {
  console.log('importProductsFile start', event);

  try {
    const { BUCKET, SQS_URL } = process.env;
    const s3 = new AWS.S3({ region: 'eu-west-1' });

    await Promise.all(event.Records.map(record => {
      const s3Stream = s3.getObject({
        Bucket: BUCKET,
        Key: record.s3.object.key,
      }).createReadStream();

      return new Promise((resolve, reject) => {
        s3Stream.pipe(csv())
          .on('data', data => {
            console.log(data);
            const sqs = new AWS.SQS();
            sqs.sendMessage({
              QueueUrl: SQS_URL,
              MessageBody: JSON.stringify(data),
            }, (error, data) => {
              console.log('error: ' + error?.message)
              console.log('data: ' + JSON.stringify(data, null, 2));
            })
          })
          .on('error', error => reject(new Error(error.message)))
          .on('end', async () => {
            console.log(`File ${record.s3.object.key} read`);

            console.log(`File ${record.s3.object.key} start copy into /parsed`);

            await s3.copyObject({
              Bucket: BUCKET,
              CopySource: BUCKET + '/' + record.s3.object.key,
              Key: record.s3.object.key.replace('uploaded', 'parsed'),
            }).promise();

            console.log(`File ${record.s3.object.key} copied into /parsed`);

            console.log(`File ${record.s3.object.key} started delete from /uploaded`)

            await s3.deleteObject({
              Bucket: BUCKET,
              Key: record.s3.object.key,
            }).promise();

            console.log(`File ${record.s3.object.key} deleted`)

            resolve()
          })
      });
    }));
    console.log('importProductsFile finished successfully');
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
  }
}
