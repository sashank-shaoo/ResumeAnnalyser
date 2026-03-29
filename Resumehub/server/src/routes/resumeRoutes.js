import express from 'express';
import { uploadMiddleware } from '../middleware/uploadMiddleware.js';
import { uploadResume, analyseResume } from '../controllers/resumeController.js';

const router = express.Router();

// POST /api/resume/upload  — multipart file upload
router.post('/upload', uploadMiddleware, uploadResume);

// POST /api/resume/analyse — JSON body with resumeText + personalization
router.post('/analyse', analyseResume);

export default router;
