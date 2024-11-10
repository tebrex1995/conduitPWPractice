import { test as setup, request, expect } from '@playwright/test';

setup('Delete article', async ({ request }) => {
  const deleteArticleResponse = await request.delete(
    `https://conduit-api.bondaracademy.com/api/articles/${process.env.SLUG_ID}`,
    {}
  );
  expect(deleteArticleResponse.status()).toEqual(204);
});
