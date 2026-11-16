// The phone-side readers: Apple's text reader for screenshots (Vision, via
// expo-text-extractor) and Apple's PDFKit for statement PDFs. Both run on the
// iPhone; nothing is uploaded. They need the development build: in Expo Go
// and the web preview they're missing, and the screens say so.

import { Platform } from 'react-native';

type TextExtractor = { isSupported: boolean; extractTextFromImage: (uri: string) => Promise<string[]> };
type PdfText = { isAvailable: () => boolean; extractText: (path: string) => Promise<string> };

function load<T>(get: () => T): T | null {
  try {
    return get();
  } catch {
    return null; // not in this build (Expo Go, web)
  }
}

/* eslint-disable @typescript-eslint/no-require-imports -- optional native modules: missing in Expo Go and on web */
const ocr = Platform.OS === 'web' ? null : load<TextExtractor>(() => require('expo-text-extractor'));
const pdf = Platform.OS === 'web' ? null : load<PdfText>(() => require('expo-pdf-text-extract'));
/* eslint-enable @typescript-eslint/no-require-imports */

/** Can this build read screenshots? */
export const canReadImages = !!ocr?.isSupported;
/** Can this build read PDFs? (CSV works everywhere.) */
export const canReadPdfs = !!pdf?.isAvailable?.();

/** The lines of text in a screenshot, top to bottom. */
export async function readImage(uri: string): Promise<string[]> {
  if (!ocr?.isSupported) throw new Error('unsupported');
  const lines = await ocr.extractTextFromImage(uri);
  return lines.flatMap((l) => l.split(/\r?\n/)).map((l) => l.trim()).filter(Boolean);
}

/** A picked statement file as text: CSV directly, PDF through PDFKit. */
export async function readDocument(asset: { uri: string; name?: string | null; mimeType?: string | null }): Promise<string> {
  const isPdf = /pdf/i.test(asset.mimeType ?? '') || /\.pdf$/i.test(asset.name ?? '');
  if (isPdf) {
    if (!pdf?.isAvailable?.()) throw new Error('pdf-unsupported');
    return pdf.extractText(asset.uri.replace(/^file:\/\//, ''));
  }
  const res = await fetch(asset.uri);
  return res.text();
}
