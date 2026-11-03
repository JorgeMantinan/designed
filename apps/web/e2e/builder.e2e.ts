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

  // Catálogo ampliado: las nuevas plantillas aparecen en la galería.
  await expect(page.getByRole('button', { name: /Tienda online/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /Negocio local/ })).toBeVisible();

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
  await page.getByRole('button', { name: /^Sección 1/ }).click();
  await expect(page.getByText('Sección 1 · Hero')).toBeVisible();
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
  await expect(page.getByText(/Sección \d+ · Cifras/)).toBeVisible();
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

test('multi-página: starter con páginas y cambio entre ellas', async ({ page }) => {
  // Arranque directo desde la landing (?start=ecommerce).
  await page.goto('/builder?start=ecommerce');

  // El editor abre directo con las páginas del starter en el árbol.
  await expect(page.getByRole('button', { name: /Inicio/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /Tienda/ }).first()).toBeVisible();
  await expect(page.getByRole('button', { name: /Planes y precios/ })).toBeVisible();

  // La portada se muestra primero (home del starter ecommerce).
  await expect(page.getByRole('heading', { name: 'Tu tienda, lista para vender' })).toBeVisible();

  // Cambiar de página actualiza árbol y preview.
  await page.getByRole('button', { name: /📄 Tienda/ }).click();
  await expect(page.getByText('Secciones · Tienda')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Descubre nuestros productos' })).toBeVisible();
  await expect(page.getByText('Página · Tienda')).toBeVisible();
  await expect(page.getByText('/tienda', { exact: true })).toBeVisible();

  // Volver a la portada.
  await page.getByRole('button', { name: /🏠 Inicio/ }).click();
  await expect(page.getByRole('heading', { name: 'Tu tienda, lista para vender' })).toBeVisible();

  // Añadir una página nueva desde el catálogo de presets.
  await page.getByRole('button', { name: /Añadir página/ }).click();
  await page.getByRole('button', { name: /Galería/ }).click();
  await expect(page.getByRole('button', { name: /Galería/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Galería', exact: true })).toBeVisible();

  // La página nueva queda seleccionada con su formulario (nombre y ruta).
  await expect(page.getByText('Página · Galería')).toBeVisible();
  await expect(page.getByText('/galeria', { exact: true })).toBeVisible();

  // Reordenar: subir «Galería» una posición (por encima de «Contacto»).
  const galeriaEntry = page.getByRole('button', { name: /Galería/ });
  await galeriaEntry.getByTitle('↑').click();
  const pageOrder = await page.getByRole('button').allTextContents();
  const galleryIndex = pageOrder.findIndex((text) => text.includes('/galeria'));
  const contactIndex = pageOrder.findIndex((text) => text.includes('/contacto'));
  expect(galleryIndex).toBeGreaterThan(-1);
  expect(contactIndex).toBeGreaterThan(-1);
  expect(galleryIndex).toBeLessThan(contactIndex);

  // Eliminar la página (✕ del árbol) confirmando el diálogo.
  page.once('dialog', (dialog) => dialog.accept());
  await galeriaEntry.getByTitle('✕').click();
  await expect(page.getByRole('button', { name: /Galería/ })).toHaveCount(0);
});

test('componentes nuevos: formulario de contacto y cuenta atrás', async ({ page }) => {
  await page.goto('/builder');
  await page.getByRole('button', { name: /Landing clásica/ }).click();

  // Formulario de contacto desde el catálogo de secciones.
  await page.getByRole('button', { name: /Añadir sección/ }).click();
  await page.getByRole('button', { name: /Formulario de contacto/ }).click();
  await expect(page.getByText(/Sección \d+ · Contacto/)).toBeVisible();

  // Se renderiza en la preview y, relleno, su envío muestra la confirmación.
  await page.locator('input[name="name"]').fill('Ana');
  await page.locator('input[name="email"]').fill('ana@ejemplo.com');
  await page.locator('textarea[name="message"]').fill('Hola, quiero información.');
  await page.getByRole('button', { name: 'Enviar mensaje', exact: true }).click();
  // (los sliders del panel también son role=status: filtramos por texto).
  await expect(page.locator('[role="status"]').filter({ hasText: 'Gracias' })).toBeVisible();

  // Cuenta atrás: reloj en vivo con las cuatro unidades.
  await page.getByRole('button', { name: /Añadir sección/ }).click();
  await page.getByRole('button', { name: /Cuenta atrás/ }).click();
  await expect(page.getByRole('timer')).toBeVisible();
  await expect(page.getByText('Días', { exact: true })).toBeVisible();
  await expect(page.getByText('Seg', { exact: true })).toBeVisible();
});
