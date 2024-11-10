import { request, expect } from '@playwright/test';
import user from '../conduitPWPractice/.auth/user.json';
import fs from 'fs';

async function globalSetup() {
  const context = await request.newContext();

  const authFile = '.auth/user.json';

  const responseToken = await context.post(
    'https://conduit-api.bondaracademy.com/api/users/login',
    {
      data: { user: { email: 'tvrdiqa@gmail.com', password: 'test123' } },
    }
  );
  const responseJson = await responseToken.json();
  const accessToken = await responseJson.user.token;
  user.origins[0].localStorage[0].value = accessToken;
  fs.writeFileSync(authFile, JSON.stringify(user));

  process.env['ACCESS_TOKEN'] = accessToken;

  const articleResponse = await context.post(
    'https://conduit-api.bondaracademy.com/api/articles/',
    {
      data: {
        article: {
          title: 'Global Likes test article',
          description: 'Test Descritpion',
          body: 'Global Likes test article',
          tagList: ['tete'],
        },
      },
      headers: {
        Authorization: `Token ${process.env.ACCESS_TOKEN}`,
      },
    }
  );
  expect(articleResponse.status()).toEqual(201);

  const response = await articleResponse.json();
  const slugId = await response.article.slug;
  process.env['SLUG_ID'] = await slugId;
}

export default globalSetup;
