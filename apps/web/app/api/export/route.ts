import { generateProject, slugify } from '@designed/codegen';
import { parseDesignSpec } from '@designed/schema';
import archiver from 'archiver';
import { PassThrough, Readable } from 'node:stream';

import { clientIp, rateLimit } from '../../../lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Hard cap for the incoming spec (the largest valid spec is far below this). */
const MAX_BODY_BYTES = 2 * 1024 * 1024;
/** Expensive endpoint:10 exports/minute/IP. */
const RATE = { windowMs: 60_000, max: 10 };

/**
 * POST the design spec, receive a ZIP with the standalone Vite project.
 * Defenses: payload size cap (header + body), per-IP rate limit, Zod
 * validation with schema-bounded sizes, and sanitized error responses.
 * The archive streams to the response while the browser downloads it.
 */
export async function POST(request: Request): Promise<Response> {
  const ip = clientIp(request);
  if (!rateLimit(`export:${ip}`, RATE)) {
    return Response.json(
      { errors: ['Demasiadas exportaciones. Espera un minuto e inténtalo de nuevo.'] },
      { status: 429, headers: { 'Retry-After': '60' } },
    );
  }

  const contentLength = Number(request.headers.get('content-length') ?? '0');
  if (contentLength > MAX_BODY_BYTES) {
    return Response.json({ errors: ['El diseño es demasiado grande.'] }, { status: 413 });
  }

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return Response.json({ errors: ['No se pudo leer el cuerpo.'] }, { status: 400 });
  }
  // Bypass-proof: also enforce the cap after reading (chunked bodies omit the header).
  if (raw.length > MAX_BODY_BYTES) {
    return Response.json({ errors: ['El diseño es demasiado grande.'] }, { status: 413 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return Response.json({ errors: ['El cuerpo no es JSON válido.'] }, { status: 400 });
  }

  const parsed = parseDesignSpec(payload);
  if (!parsed.success) {
    return Response.json({ errors: parsed.errors }, { status: 422 });
  }

  let files;
  try {
    files = await generateProject(parsed.data);
  } catch (error) {
    // Log the detail server-side only: never leak internal paths to clients.
    console.error('[export] generación fallida:', error);
    return Response.json(
      { errors: ['No se pudo generar el proyecto. Inténtalo de nuevo.'] },
      { status: 500 },
    );
  }

  const passthrough = new PassThrough();
  const archive = archiver('zip', { zlib: { level: 9 } });
  archive.on('warning', (error) => console.warn('[export]', error.message));
  archive.on('error', (error) => {
    passthrough.destroy(error);
  });

  archive.pipe(passthrough);
  for (const file of files) {
    archive.append(file.content, { name: file.path });
  }
  // Do NOT await: the browser consumes the stream (avoids backpressure stalls).
  void archive.finalize();

  const slug = slugify(parsed.data.meta.name);
  return new Response(Readable.toWeb(passthrough) as unknown as ReadableStream, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${slug}.zip"`,
      'Cache-Control': 'no-store',
    },
  });
}
