import getProductsList from '../get-products-list';

test('Test getProductsList function', async () => {
  const response = await getProductsList();

  expect(response.statusCode).toBe(200);
});
