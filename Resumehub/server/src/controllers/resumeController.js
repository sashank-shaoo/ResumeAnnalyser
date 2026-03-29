import path from 'path';
import { extractTextFromResume, deleteUploadedFile } from '../services/resumeParserService.js';
import { analyseResumeWithLLM } from '../services/llmService.js';
import prisma from '../lib/prisma.js';

/**
 * POST /api/resume/upload
 * Accepts a resume file, extracts its text and returns it.
 */
export async function uploadResume(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded.' });
    }

    const { path: filePath, mimetype, originalname } = req.file;
    const text = await extractTextFromResume(filePath, mimetype);

    // Clean up file from disk immediately — we only need the text
    await deleteUploadedFile(filePath);

    res.json({ success: true, text, fileName: originalname });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/resume/analyse
 * Sends extracted resume text + personalization to OpenAI.
 */
export async function analyseResume(req, res, next) {
  try {
    const { resumeText, personalization, userId, fileName } = req.body;

    if (!resumeText || typeof resumeText !== 'string') {
      return res.status(400).json({ success: false, error: 'resumeText is required.' });
    }

    const profile = await analyseResumeWithLLM(resumeText, personalization || {});

    // Persist to DB if a userId is provided
    if (userId) {
      await prisma.resumeAnalysis.create({
        data: {
          userId,
          fileName: fileName || null,
          inferredProfile: profile,
        },
      }).catch((e) => console.warn('[DB] Could not save analysis:', e.message));
    }

    res.json({ success: true, profile });
  } catch (err) {
    next(err);
  }
}
