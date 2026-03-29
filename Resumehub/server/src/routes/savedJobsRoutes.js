import express from 'express';
import { saveJob, getSavedJobs, deleteSavedJob } from '../controllers/savedJobsController.js';

const router = express.Router();

// POST   /api/saved-jobs          — save a job
router.post('/', saveJob);

// GET    /api/saved-jobs/:userId  — get all saved jobs for a user
router.get('/:userId', getSavedJobs);

// DELETE /api/saved-jobs/:id      — remove a saved job
router.delete('/:id', deleteSavedJob);

export default router;
