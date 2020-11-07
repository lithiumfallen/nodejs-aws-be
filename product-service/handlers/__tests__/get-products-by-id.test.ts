import getProductsById from '../get-products-by-id';

test('Test getProductsById function with extended id', async () => {
  const response = await getProductsById({ pathParameters: { productId: "5c73fe34e54969f1d05b7170" } });

  expect(response.statusCode).toBe(200);
})

test('Test getProductsById function with not extended id', async () => {
  const response = await getProductsById({ pathParameters: { productId: "not extended id" } });

  expect(response.statusCode).toBe(404);
});
