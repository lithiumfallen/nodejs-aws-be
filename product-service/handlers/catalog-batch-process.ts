import { SQSEvent } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import 'source-map-support/register';
import generateDbConfig from '../db/db-config';
import { Client } from 'pg';
import { Product, ProductSchema } from '../db/models/Product';
import { insertProductQuery, insertStockQuery } from '../db/queries'
import { logger } from './utils';

export const catalogBatchProcess = async (event : SQSEvent) => {
  logger('catalogBatchProcess', event);
  const dbClient = new Client(generateDbConfig(process));
  const products: Product[] = event?.Records?.map(({ body }) => JSON.parse(body));

  try {
    const sns = new AWS.SNS({ region: 'eu-west-1' });
    await dbClient.connect();

    await Promise.all(products.map(async (product: Product) => {
        const isValid = await ProductSchema.isValid(product);
        let isDbError = false;

        try {
          if (!isValid) throw new Error('Invalid product data');

          await dbClient.query('BEGIN');

          const { title, description, price, count } = product;
          const response = await dbClient.query(insertProductQuery, [title, description, price]);

          await dbClient.query(insertStockQuery, [response.rows[0].id, count]);
          await dbClient.query('COMMIT');
        } catch (error) {
          isDbError = true;
          console.log('error: ' + error?.message);
          await dbClient.query('ROLLBACK');
        } finally {
          return await sns.publish({
            Subject: `Add product into db`,
            TopicArn: process.env.SNS_ARN,
            Message: isDbError ? 'Product was not added into db' : 'Product added into database',
            MessageAttributes: {
              validationStatus: {
                DataType: 'String',
                StringValue: isValid ? 'VALID' : 'INVALID',
              }
            }
          }).promise();
        }
    }));
  } catch (error) {
      console.log('error: ' + error?.message);
  } finally {
    dbClient.end();
  }
};