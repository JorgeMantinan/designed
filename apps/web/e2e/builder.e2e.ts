import { readFile } from 'node:fs/promises';

import { expect, test } from '@playwright/test';

test('galería: plantillas filtrables y tira de paletas', async ({ page }) => {
  await page.goto('/builder');

  await expect(page.getByRole('heading', { name: 'Elige por dónde empezar' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Landing clásica/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /Menú esquinado/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /Diseño en blanco/ })).toBeVisible();

  // Filtrado por preferencia (AND): solo queda la plantilla con esa etiqueta.
  await page.getByRole('button', { name: 'menu-esquinado', exact: true }).click();
  await expect(page.getByRole('button', { name: /Landing clásica/ })).toHaveCount(0);
  await expect(page.getByRole('button', { name: /Menú esquinado/ })).toHaveCount(1);

  await page.getByRole('button', { name: 'limpiar ✕' }).click();
  await expect(page.getByRole('button', { name: /Landing clásica/ })).toBeVisible();

  // Tira de paletas (catálogo amplio).
  expect(await page.getByRole('option').count()).toBeGreaterThan(40);
});

test('flujo completo: template → editor → propiedades → deshacer', async ({ page }) => {
  await page.goto('/builder');
  await page.getByRole('button', { name: /Landing clásica/ }).click();

  // El editor se abre con las tres zonas.
  await expect(page.getByRole('button', { name: /Plantillas/ })).toBeVisible();
  await expect(page.getByText('☰ Menú superior')).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Tu idea merece una web increíble' }),
  ).toBeVisible();

  // Seleccionar una sección en el árbol → panel de propiedades contextual.
  await page.getByRole('button', { name: /hero · hero/ }).click();
  await expect(page.getByText('Sección · hero')).toBeVisible();
  await expect(page.getByText('Tipo de fondo')).toBeVisible();

  // Renombrar el diseño (commit al desenfocar).
  const nameInput = page.getByPlaceholder('Nombre del diseño');
  await nameInput.fill('Mi web de prueba');
  await nameInput.blur();
  await expect(page.getByText('Diseño — Mi web de prueba')).toBeVisible();

  // Deshacer con el botón de la topbar.
  await page.getByTitle('Deshacer (Ctrl+Z)').click();
  await expect(page.getByText('Diseño — Landing clásica')).toBeVisible();

  // Petición: añadir columna visible desde la lista de filas.
  await page.locator('button[title="Añadir columna a esta fila"]').click();
  await expect(page.getByText('Fila 1 · 2 col.')).toBeVisible();

  // Petición: nueva sección desde presets con contenido y animaciones.
  await page.getByRole('button', { name: /Añadir sección/ }).click();
  await page.getByRole('button', { name: /Cifras con spotlight/ }).click();
  await expect(page.getByText('Sección · stats')).toBeVisible();
  await expect(page.getByText('Tipo de fondo')).toBeVisible();
});

test('exportar ZIP: descarga un archivo válido', async ({ page }) => {
  await page.goto('/builder');
  await page.getByRole('button', { name: /Menú esquinado/ }).click();

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /Exportar ZIP/ }).click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toMatch(/\.zip$/);
  const filePath = await download.path();
  expect(filePath).toBeTruthy();

  const buffer = await readFile(filePath!);
  expect(buffer.subarray(0, 2).toString()).toBe('PK');
  expect(buffer.byteLength).toBeGreaterThan(10_000);
});

test('exportar JSON: descarga el diseño editable', async ({ page }) => {
  await page.goto('/builder');
  await page.getByRole('button', { name: /Landing clásica/ }).click();

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'JSON', exact: true }).click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toBe('landing-clasica.json');
  const filePath = await download.path();
  const content = JSON.parse(await readFile(filePath!, 'utf8')) as { version: number };
  expect(content.version).toBe(1);
});

test('autoguardado: la galería ofrece reanudar el diseño', async ({ page }) => {
  await page.goto('/builder');
  await page.getByRole('button', { name: /Landing clásica/ }).click();

  // Autosave con debounce de300ms.
  await page.waitForTimeout(700);

  await page.getByRole('button', { name: /Plantillas/ }).click();
  await expect(page.getByText('Tienes un diseño guardado:')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Continuar' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Descartar' })).toBeVisible();
});
