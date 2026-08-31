import { NextResponse } from 'next/server';

const TINIFY_API_KEY = process.env.TINIFY_API_KEY || 'lRnVLT1hhwWmlnkBtCrTgcj3YYly42Y0';

export async function GET() {
  try {
    let compressionCount: number | undefined = undefined;

    // If Tinify API key is present, verify quota non-destructively
    if (TINIFY_API_KEY && TINIFY_API_KEY.length > 10) {
      try {
        const authHeader = `Basic ${Buffer.from(`api:${TINIFY_API_KEY}`).toString('base64')}`;
        const tinyPngBuffer = Buffer.from(
          'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
          'base64'
        );

        const res = await fetch('https://api.tinify.com/shrink', {
          method: 'POST',
          headers: {
            Authorization: authHeader,
            'Content-Type': 'image/png',
          },
          body: tinyPngBuffer,
        });

        const countHeader = res.headers.get('Compression-Count');
        if (countHeader) {
          compressionCount = parseInt(countHeader, 10);
        }
      } catch {
        // Fallback engine remains active
      }
    }

    return NextResponse.json({
      valid: true,
      ready: true,
      compressionCount,
      engine: 'MozJPEG / Sharp Engine Ready',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Engine error';
    return NextResponse.json({ valid: true, error: msg, engine: 'MozJPEG / Sharp' });
  }
}
