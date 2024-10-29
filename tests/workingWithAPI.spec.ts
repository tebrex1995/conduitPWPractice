import { test, expect } from '@playwright/test';
import tags from '../testData/tags.json';

test.describe('test blog', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('*/**/api/tags', async route => {
      await route.fulfill({
        body: JSON.stringify(tags),
      });
    });

    await page.goto('https://conduit.bondaracademy.com/');
  });

  test('Test article title and description mocking', async ({ page }) => {
    await page.route('*/**/api/articles*', async route => {
      const response = await route.fetch();
      const responseBody = await response.json();
      responseBody.articles[0].title = 'THIS IS A MOCK TEST TITLE';
      responseBody.articles[0].description = 'THIS IS A MOCK TEST DESCRIPTION';

      await route.fulfill({
        body: JSON.stringify(responseBody),
      });
    });

    await page.getByText('Global Feed').click();
    await expect(page.locator('.navbar-brand')).toHaveText('conduit');
    await expect(page.locator('app-article-list h1').first()).toContainText(
      'THIS IS A MOCK TEST TITLE'
    );
    await expect(page.locator('app-article-list p').first()).toContainText(
      'THIS IS A MOCK TEST DESCRIPTION'
    );
  });

  test('Create article', async ({ page, request }) => {
    const createArticleResponse = await request.post(
      'https://conduit-api.bondaracademy.com/api/articles/',
      {
        data: {
          article: {
            title: 'This is a test title',
            description: 'Test Descritpion',
            body: 'tete',
            tagList: ['tete'],
          },
        },
      }
    );
    expect(createArticleResponse.status()).toEqual(201);

    await page.getByText('Global Feed').click();
    await page.getByText('This is a test title').click();
    await page.getByRole('button', { name: 'Delete Article' }).first().click();
    await page.getByText('Global Feed').click();
    await expect(page.locator('app-article-list h1').first()).not.toContainText(
      'This is a test title'
    );
  });

  test('Delete API', async ({ page, request }) => {
    const createArticleResponse = await request.post(
      'https://conduit-api.bondaracademy.com/api/articles/',
      {
        data: {
          article: {
            title: 'This is a test title',
            description: 'Test Descritpion',
            body: 'tete',
            tagList: ['tete'],
          },
        },
      }
    );
    expect(createArticleResponse.status()).toEqual(201);
    const createResponseJson = await createArticleResponse.json();
    const articleSlug = await createResponseJson.article.slug;
    const deleteArticleResponse = await request.delete(
      `https://conduit-api.bondaracademy.com/api/articles/${articleSlug}`,
      {}
    );
    expect(deleteArticleResponse.status()).toEqual(204);
  });
});
