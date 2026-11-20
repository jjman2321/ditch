// The phone-side readers: Apple's text reader for screenshots (Vision, via
// expo-text-extractor) and Apple's PDFKit for statement PDFs. Both run on the
// iPhone; nothing is uploaded. They need the development build: in Expo Go
// and the web preview they're missing, and the screens say so.

import { Platform } from 'react-native';

type TextExtractor = { isSupported: boolean; extractTextFromImage: (uri: string) => Promise<string[]> };
type PdfText = { isAvailable: () => boolean; extractText: (path: string, password?: string) => Promise<string> };

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
  return lines
    .flatMap((l) => l.split(/\r?\n/))
    .map((l) => l.trim())
    .filter(Boolean);
}

/** Why a file couldn't be read, so the screen can say what to do next. */
export type ReadFailure = 'pdf-unsupported' | 'password' | 'wrong-password' | 'broken';

/** Sorts a reader error. The PDF reader puts PASSWORD_REQUIRED / INCORRECT_PASSWORD on `.code`. */
export function readFailure(e: unknown): ReadFailure {
  const err = e as { code?: string; message?: string };
  if (err?.message === 'pdf-unsupported') return 'pdf-unsupported';
  if (err?.code === 'PASSWORD_REQUIRED') return 'password';
  if (err?.code === 'INCORRECT_PASSWORD') return 'wrong-password';
  if (/password/i.test(err?.message ?? '')) return 'password';
  return 'broken';
}

/** A picked statement file as text: CSV directly, PDF through PDFKit (with the password, if it has one). */
export async function readDocument(asset: { uri: string; name?: string | null; mimeType?: string | null }, password?: string): Promise<string> {
  const isPdf = /pdf/i.test(asset.mimeType ?? '') || /\.pdf$/i.test(asset.name ?? '');
  if (isPdf) {
    if (!pdf?.isAvailable?.()) throw new Error('pdf-unsupported');
    return pdf.extractText(asset.uri.replace(/^file:\/\//, ''), password);
  }
  const res = await fetch(asset.uri);
  return res.text();
}
