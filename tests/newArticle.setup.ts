import { test as setup, expect } from '@playwright/test';

setup('Create new article', async ({ request }) => {
  const articleResponse = await request.post(
    'https://conduit-api.bondaracademy.com/api/articles/',
    {
      data: {
        article: {
          title: 'Likes test article',
          description: 'Test Descritpion',
          body: 'Likes test article',
          tagList: ['tete'],
        },
      },
    }
  );
  expect(articleResponse.status()).toEqual(201);

  const response = await articleResponse.json();
  const slugId = await response.article.slug;
  process.env['SLUG_ID'] = await slugId;
});
