import { importProductsFile } from '../import-products-file';
import AWSMock from 'aws-sdk-mock';

describe('Test importProductsFile function', () => {
  const processEnv = process.env;
  beforeAll(() => {
    AWSMock.mock('S3', 'getSignedUrlPromise');
    process.env = {...processEnv, BUCKET: 'just_bucket' };
  });

  afterAll(() => {
    AWSMock.restore('S3');
    process.env = processEnv;
  });

  test('importProductsFile return 200 and sigtare link', async () => {
    const { statusCode, body } = await importProductsFile({ queryStringParameters: { name: 'testFile.csv' }});

    expect(statusCode).toBe(200);
    expect(body).toContain('AWSAccessKeyId');
    expect(body).toContain('Signature');
    expect(body).toContain('Content-Type=text%2Fcsv');
    expect(body).toContain(`${process.env.BUCKET}/uploaded`);
    expect(body).toContain('testFile.csv');
  });

  test('name param doesn\'t provide', async () => {
    const { statusCode, body } = await importProductsFile({});

    expect(statusCode).toBe(400);
  })
})