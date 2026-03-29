import { searchJobs, getExploreJobs } from '../services/jobSearchService.js';

/**
 * GET /api/jobs/explore
 * Returns static categories of generic jobs for the Explore page.
 */
export async function exploreJobs(req, res, next) {
  try {
    const categories = await getExploreJobs();
    res.json({ success: true, categories });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/jobs/search
 * Accepts an inferred job profile and returns ranked job vacancies.
 */
export async function getJobs(req, res, next) {
  try {
    const jobProfile = req.body;

    if (!jobProfile || !Array.isArray(jobProfile.inferredJobTitles)) {
      return res.status(400).json({ success: false, error: 'Valid job profile is required.' });
    }

    const jobs = await searchJobs(jobProfile);
    res.json({ success: true, jobs });
  } catch (err) {
    next(err);
  }
}
