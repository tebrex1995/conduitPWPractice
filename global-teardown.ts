import { request, expect } from '@playwright/test';

async function globalTeardown() {
  const context = await request.newContext();

  const deleteArticleResponse = await context.delete(
    `https://conduit-api.bondaracademy.com/api/articles/${process.env.SLUG_ID}`,
    {
      headers: {
        Authorization: `Token ${process.env.ACCESS_TOKEN}`,
      },
    }
  );
  console.log(await process.env.SLUG_ID);
  expect(deleteArticleResponse.status()).toEqual(204);
}

export default globalTeardown;
