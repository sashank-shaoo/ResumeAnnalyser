import prisma from '../lib/prisma.js';

/**
 * POST /api/saved-jobs
 * Save a job for a user. Ignores duplicate saves gracefully.
 */
export async function saveJob(req, res, next) {
  try {
    const { userId, jobId, title, company, location, salary, applyUrl } = req.body;

    if (!userId || !jobId || !title || !applyUrl) {
      return res.status(400).json({ success: false, error: 'userId, jobId, title, and applyUrl are required.' });
    }

    const savedJob = await prisma.savedJob.upsert({
      where: { userId_jobId: { userId, jobId } },
      update: {},
      create: { userId, jobId, title, company: company || '', location, salary, applyUrl },
    });

    res.json({ success: true, savedJob });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/saved-jobs/:userId
 * Returns all saved jobs for a specific user, sorted newest first.
 */
export async function getSavedJobs(req, res, next) {
  try {
    const { userId } = req.params;

    const jobs = await prisma.savedJob.findMany({
      where: { userId },
      orderBy: { savedAt: 'desc' },
    });

    res.json({ success: true, jobs });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/saved-jobs/:id
 * Removes a saved job by its record ID.
 */
export async function deleteSavedJob(req, res, next) {
  try {
    await prisma.savedJob.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Job removed from saved list.' });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, error: 'Saved job not found.' });
    }
    next(err);
  }
}
