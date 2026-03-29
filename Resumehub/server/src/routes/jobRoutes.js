import express from 'express';
import { getJobs, exploreJobs } from '../controllers/jobController.js';

const router = express.Router();

// GET /api/jobs/explore — Curated job lists
router.get('/explore', exploreJobs);

// POST /api/jobs/search — JSON body with inferred job profile
router.post('/search', getJobs);

export default router;
