import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import mammoth from 'mammoth';

// ── Worker setup for Node.js ─────────────────────────────────
// pdfjs-dist requires workerSrc to be a real URL string in Node.js
const require = createRequire(import.meta.url);
const workerPath = require.resolve('pdfjs-dist/legacy/build/pdf.worker.mjs');
pdfjsLib.GlobalWorkerOptions.workerSrc = `file:///${workerPath.replace(/\\/g, '/')}`;

/**
 * Extracts plain text from a PDF or DOCX file.
 * @param {string} filePath - Absolute path to the uploaded file.
 * @param {string} mimetype - MIME type of the file.
 * @returns {Promise<string>} Extracted text content.
 */
export async function extractTextFromResume(filePath, mimetype) {
  const buffer = await fs.readFile(filePath);

  if (mimetype === 'application/pdf') {
    return extractTextFromPDF(buffer);
  }

  if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const result = await mammoth.extractRawText({ buffer });
    if (!result.value?.trim()) throw new Error('Could not extract text from DOCX file.');
    return result.value;
  }

  throw new Error('Unsupported file type. Please upload a PDF or DOCX.');
}

/**
 * Extracts text from a PDF buffer using pdfjs-dist (page-by-page).
 * Uses stopAtErrors: false to handle real-world PDFs with minor XRef issues.
 * @param {Buffer} buffer
 * @returns {Promise<string>}
 */
async function extractTextFromPDF(buffer) {
  const uint8Array = new Uint8Array(buffer);

  const loadingTask = pdfjsLib.getDocument({
    data: uint8Array,
    stopAtErrors: false,          // tolerate minor PDF structure issues
    disableRange: true,
    disableStream: true,
  });

  const pdf = await loadingTask.promise;
  const textParts = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => item.str).join(' ');
    textParts.push(pageText);
  }

  const text = textParts.join('\n').trim();

  if (!text) {
    throw new Error(
      'No text found in the PDF. It may be image-based (scanned) or encrypted. Try a DOCX version instead.'
    );
  }

  return text;
}

/**
 * Cleans up the uploaded file from disk after processing.
 * @param {string} filePath
 */
export async function deleteUploadedFile(filePath) {
  try {
    await fs.unlink(filePath);
  } catch {
    console.warn(`[ResumeParser] Could not delete temp file: ${filePath}`);
  }
}
