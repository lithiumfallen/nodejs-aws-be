import { S3Event } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import 'source-map-support/register';
import * as csv from 'csv-parser';

export const importFileParser = async (event : S3Event) => {
  console.log('importProductsFile start', event);

  try {
    const s3 = new AWS.S3({ region: 'eu-west-1' });

    await Promise.all(event.Records.map(record => {
      const s3Stream = s3.getObject({
        Bucket: 'node-aws-s3-import',
        Key: record.s3.object.key,
      }).createReadStream();

      return new Promise((resolve, reject) => {
        s3Stream.pipe(csv())
          .on('data', data => {
            console.log(data);
          })
          .on('error', error => {
            reject(error)
          })
          .on('end', () => {
            console.log(`File ${record.s3.object.key} read`);
            resolve()
          })
      });
    }))

    console.log('importProductsFile finished successfully');
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
  }
}
