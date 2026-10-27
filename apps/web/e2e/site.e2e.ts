import { expect, test } from '@playwright/test';

test('landing: SEO semántico, CTA al editor y JSON-LD', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);

  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Diseña tu web como en WordPress',
  );
  await expect(page.getByRole('link', { name: 'Abrir el editor' })).toBeVisible();
  await expect(page).toHaveTitle(/designed/);

  const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
  expect(jsonLd).toContain('SoftwareApplication');
  expect(jsonLd).toContain('DesignApplication');
});

test('rutas SEO y LLMO: robots, sitemap, llms.txt', async ({ request }) => {
  const robots = await request.get('/robots.txt');
  expect(robots.status()).toBe(200);
  const robotsText = await robots.text();
  expect(robotsText).toContain('User-Agent');
  expect(robotsText).toContain('GPTBot');
  expect(robotsText).toContain('/sitemap.xml');

  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.status()).toBe(200);
  const sitemapText = await sitemap.text();
  expect(sitemapText).toContain('/builder');
  expect(sitemapText).toContain('llms.txt');

  const llms = await request.get('/llms.txt');
  expect(llms.status()).toBe(200);
  const llmsText = await llms.text();
  expect(llmsText).toContain('Constructor visual de webs');
  expect(llmsText).toContain('pnpm dev');
  expect(llmsText).toContain('Sin funciones de IA');

  const llmsFull = await request.get('/llms-full.txt');
  expect(llmsFull.status()).toBe(200);
  expect(await llmsFull.text()).toContain('DesignSpec');
});

test('OpenGraph: la imagen dinámica responde PNG', async ({ request }) => {
  const response = await request.get('/opengraph-image');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('image');
});
