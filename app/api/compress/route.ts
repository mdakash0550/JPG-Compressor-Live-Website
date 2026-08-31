import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

const TINIFY_API_KEY = process.env.TINIFY_API_KEY || '';

interface CompressionResult {
  imageBuffer: Buffer;
  compressedSize: number;
  width?: number;
  height?: number;
  mimeType: string;
  engineUsed: string;
}

// Robust Sharp compression engine
async function compressWithSharp(
  buffer: Buffer,
  mimeType: string,
  resizeEnabled: boolean,
  resizeMethod: string,
  resizeWidth?: number,
  resizeHeight?: number
): Promise<CompressionResult> {
  let sharpInstance = sharp(buffer, { failOn: 'none' }).rotate(); // auto-orient from EXIF

  const metadata = await sharpInstance.metadata();
  const isPng = mimeType.includes('png') || metadata.format === 'png';
  const isWebp = mimeType.includes('webp') || metadata.format === 'webp';

  // Apply resizing if requested
  if (resizeEnabled && (resizeWidth || resizeHeight)) {
    let fitOption: 'inside' | 'cover' | 'fill' | 'contain' | 'outside' = 'inside';
    if (resizeMethod === 'cover') fitOption = 'cover';
    else if (resizeMethod === 'scale') fitOption = 'fill';
    else fitOption = 'inside';

    sharpInstance = sharpInstance.resize({
      width: resizeWidth,
      height: resizeHeight,
      fit: fitOption,
      withoutEnlargement: true,
    });
  }

  let finalBuffer: Buffer;
  let outMime: string;

  if (isPng) {
    // High compression PNG with palette quantization
    try {
      finalBuffer = await sharpInstance
        .png({
          compressionLevel: 9,
          palette: true,
          quality: 80,
          effort: 7,
        })
        .toBuffer();
    } catch {
      finalBuffer = await sharpInstance
        .png({ compressionLevel: 9, effort: 6 })
        .toBuffer();
    }
    outMime = 'image/png';
  } else if (isWebp) {
    finalBuffer = await sharpInstance
      .webp({ quality: 80, effort: 6 })
      .toBuffer();
    outMime = 'image/webp';
  } else {
    // Default to MozJPEG with progressive encoding & chroma subsampling
    finalBuffer = await sharpInstance
      .jpeg({
        quality: 78,
        mozjpeg: true,
        progressive: true,
        chromaSubsampling: '4:2:0',
      })
      .toBuffer();
    outMime = 'image/jpeg';
  }

  // If compressed output is somehow larger than original (e.g. already compressed tiny picture),
  // retain original buffer or lowest size
  if (finalBuffer.length > buffer.length && !resizeEnabled) {
    finalBuffer = buffer;
  }

  let outWidth = metadata.width;
  let outHeight = metadata.height;
  try {
    const outMeta = await sharp(finalBuffer).metadata();
    if (outMeta.width) outWidth = outMeta.width;
    if (outMeta.height) outHeight = outMeta.height;
  } catch {
    // ignore
  }

  return {
    imageBuffer: finalBuffer,
    compressedSize: finalBuffer.length,
    width: outWidth,
    height: outHeight,
    mimeType: outMime,
    engineUsed: 'sharp-mozjpeg',
  };
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const resizeEnabled = formData.get('resizeEnabled') === 'true';
    const resizeMethod = (formData.get('resizeMethod') as string) || 'fit';
    const resizeWidth = formData.get('resizeWidth')
      ? parseInt(formData.get('resizeWidth') as string, 10)
      : undefined;
    const resizeHeight = formData.get('resizeHeight')
      ? parseInt(formData.get('resizeHeight') as string, 10)
      : undefined;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No image file provided' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const originalSize = file.size || buffer.length;
    const inputMime = file.type || 'image/jpeg';

    let result: CompressionResult | null = null;
    let compressionCount: number | undefined = undefined;

    // 1. If a valid TinyJPG API key exists, attempt Tinify API first
    if (TINIFY_API_KEY && TINIFY_API_KEY.length > 10) {
      try {
        const authHeader = `Basic ${Buffer.from(`api:${TINIFY_API_KEY}`).toString('base64')}`;
        const shrinkRes = await fetch('https://api.tinify.com/shrink', {
          method: 'POST',
          headers: {
            Authorization: authHeader,
            'Content-Type': inputMime,
          },
          body: buffer,
        });

        const countHeader = shrinkRes.headers.get('Compression-Count');
        if (countHeader) compressionCount = parseInt(countHeader, 10);

        if (shrinkRes.ok) {
          const shrinkData = await shrinkRes.json();
          const outputUrl = shrinkData.output?.url;

          if (outputUrl) {
            let imgBuffer: Buffer;
            let finalOutput = shrinkData.output;

            if (resizeEnabled && (resizeWidth || resizeHeight)) {
              const resizeRes = await fetch(outputUrl, {
                method: 'POST',
                headers: {
                  Authorization: authHeader,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  resize: {
                    method: resizeMethod,
                    width: resizeWidth,
                    height: resizeHeight,
                  },
                }),
              });

              if (resizeRes.ok) {
                const ab = await resizeRes.arrayBuffer();
                imgBuffer = Buffer.from(ab);
                finalOutput = {
                  ...finalOutput,
                  size: imgBuffer.length,
                  width: resizeWidth || finalOutput.width,
                  height: resizeHeight || finalOutput.height,
                };
              } else {
                const dlRes = await fetch(outputUrl, {
                  headers: { Authorization: authHeader },
                });
                const ab = await dlRes.arrayBuffer();
                imgBuffer = Buffer.from(ab);
              }
            } else {
              const dlRes = await fetch(outputUrl, {
                headers: { Authorization: authHeader },
              });
              const ab = await dlRes.arrayBuffer();
              imgBuffer = Buffer.from(ab);
            }

            result = {
              imageBuffer: imgBuffer,
              compressedSize: finalOutput.size || imgBuffer.length,
              width: finalOutput.width,
              height: finalOutput.height,
              mimeType: finalOutput.type || inputMime,
              engineUsed: 'TinyJPG',
            };
          }
        }
      } catch {
        // Continue to sharp fallback seamlessly
      }
    }

    // 2. High-performance Sharp MozJPEG engine (runs if Tinify is unavailable, exhausted, or offline)
    if (!result) {
      result = await compressWithSharp(
        buffer,
        inputMime,
        resizeEnabled,
        resizeMethod,
        resizeWidth,
        resizeHeight
      );
    }

    const compressedSize = result.compressedSize;
    const savingsPercent =
      originalSize > 0
        ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 1000) / 10)
        : 0;
    const ratio = originalSize > 0 ? compressedSize / originalSize : 1;
    const dataUrl = `data:${result.mimeType};base64,${result.imageBuffer.toString('base64')}`;

    return NextResponse.json({
      success: true,
      dataUrl,
      originalSize,
      compressedSize,
      ratio,
      savingsPercent,
      width: result.width,
      height: result.height,
      mimeType: result.mimeType,
      compressionCount,
      engine: result.engineUsed,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Compression error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
