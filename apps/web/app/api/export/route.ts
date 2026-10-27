import { generateProject } from '@designed/codegen';
import { slugify } from '@designed/codegen';
import { parseDesignSpec } from '@designed/schema';
import archiver from 'archiver';
import { PassThrough, Readable } from 'node:stream';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST the design spec, receive a ZIP with the standalone Vite project.
 * The archive streams to the response while the browser downloads it.
 */
export async function POST(request: Request): Promise<Response> {
  let payload: unknown;
  try {
    payload = await request.json();
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
    return Response.json(
      { errors: [`No se pudo generar el proyecto: ${String(error)}`] },
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
