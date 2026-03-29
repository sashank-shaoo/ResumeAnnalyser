import axios from 'axios';

const ADZUNA_BASE = 'https://api.adzuna.com/v1/api/jobs';

/**
 * Searches Adzuna for jobs matching the inferred job profile.
 * @param {Object} jobProfile - Output from llmService.analyseResumeWithLLM
 * @returns {Promise<Array>} Ranked list of job objects
 */
export async function searchJobs(jobProfile) {
  const { inferredJobTitles = [], topSkills = [], preferredLocation = '', inferredDomain = '' } = jobProfile;

  const initialLocation = preferredLocation.toLowerCase() === 'remote' ? '' : preferredLocation;
  const country = (process.env.ADZUNA_COUNTRY || 'gb').replace(/[\r\n\s]/g, '');

  const getParams = (keyword, loc) => ({
    app_id: (process.env.ADZUNA_APP_ID || '').trim(),
    app_key: (process.env.ADZUNA_APP_KEY || '').trim(),
    results_per_page: 20,
    what: keyword,
    where: loc,
    'content-type': 'application/json',
  });

  let jobs = [];
  
  // Create a priority list of keywords to try
  const keywordsToTry = [...inferredJobTitles, inferredDomain, 'professional'].filter(Boolean);
  
  // Try with location first, then without location
  const locationsToTry = initialLocation ? [initialLocation, ''] : [''];

  searchLoop: for (const loc of locationsToTry) {
    for (const keyword of keywordsToTry) {
      try {
        const response = await axios.get(`${ADZUNA_BASE}/${country}/search/1`, { params: getParams(keyword, loc) });
        jobs = response.data.results || [];
        if (jobs.length > 0) {
          break searchLoop; // Found jobs, exit both loops!
        }
      } catch (error) {
        console.error(`[Adzuna API Error] keyword: "${keyword}", loc: "${loc}" -`, error.response?.data || error.message);
      }
    }
  }

  // Score and rank each job
  const scored = jobs.map((job) => ({
    id: job.id,
    title: job.title,
    company: job.company?.display_name || 'Unknown Company',
    location: job.location?.display_name || 'Unknown',
    salary:
      job.salary_min && job.salary_max
        ? `£${Math.round(job.salary_min / 1000)}k – £${Math.round(job.salary_max / 1000)}k`
        : 'Not specified',
    description: job.description?.slice(0, 300) + '...' || '',
    applyUrl: job.redirect_url,
    postedAt: job.created,
    matchScore: computeMatchScore(job, jobProfile),
  }));

  return scored.sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Simple match score: counts how many user skills appear in the job description.
 */
function computeMatchScore(job, jobProfile) {
  const jobText = `${job.title} ${job.description}`.toLowerCase();
  const { topSkills, inferredJobTitles } = jobProfile;

  let hits = 0;
  const total = topSkills.length + inferredJobTitles.length;

  for (const skill of topSkills) {
    if (jobText.includes(skill.toLowerCase())) hits++;
  }
  for (const title of inferredJobTitles) {
    if (jobText.includes(title.toLowerCase())) hits++;
  }

  return Math.round((hits / total) * 100);
}

let exploreCache = null;
let exploreCacheTime = 0;

/**
 * Fetches generic job categories for the Explore page.
 */
export async function getExploreJobs() {
  // Return cached data if less than 5 minutes old
  if (exploreCache && Date.now() - exploreCacheTime < 5 * 60 * 1000) {
    return exploreCache;
  }

  const categories = [
    { title: 'Software Engineering', keyword: 'Software Engineer' },
    { title: 'Data & Analytics', keyword: 'Data Analyst' },
    { title: 'Design & UI/UX', keyword: 'UI UX Designer' },
    { title: 'Marketing & Sales', keyword: 'Marketing Manager' }
  ];

  const country = (process.env.ADZUNA_COUNTRY || 'gb').replace(/[\r\n\s]/g, '');
  const baseParams = {
    app_id: (process.env.ADZUNA_APP_ID || '').trim(),
    app_key: (process.env.ADZUNA_APP_KEY || '').trim(),
    results_per_page: 5,
    sort_by: 'date',
    'content-type': 'application/json',
  };

  const domainMap = { gb: 'adzuna.co.uk', us: 'adzuna.com', au: 'adzuna.com.au', ca: 'adzuna.ca' };
  const userDomain = domainMap[country] || 'adzuna.com';

  const exploreData = [];
  for (const cat of categories) {
    try {
      const res = await axios.get(`${ADZUNA_BASE}/${country}/search/1`, {
        params: { ...baseParams, what: cat.keyword }
      });
      const jobs = (res.data.results || []).map(job => ({
        id: job.id,
        title: job.title,
        company: job.company?.display_name || 'Unknown Company',
        location: job.location?.display_name || 'Unknown',
        salary:
          job.salary_min && job.salary_max
            ? `£${Math.round(job.salary_min / 1000)}k – £${Math.round(job.salary_max / 1000)}k`
            : 'Not specified',
        description: job.description?.slice(0, 150) + '...' || '',
        applyUrl: job.redirect_url,
        postedAt: job.created,
      }));
      
      exploreData.push({
        category: cat.title,
        jobs,
        seeMoreUrl: `https://www.${userDomain}/search?q=${encodeURIComponent(cat.keyword)}`
      });
    } catch (err) {
      console.error(`Error fetching category ${cat.keyword}:`, err.message);
      exploreData.push({ 
        category: cat.title, 
        jobs: [], 
        seeMoreUrl: `https://www.${userDomain}/search?q=${encodeURIComponent(cat.keyword)}` 
      });
    }
  }

  // Only update cache if we actually retrieved jobs successfully
  if (exploreData.some(cat => cat.jobs.length > 0)) {
    exploreCache = exploreData;
    exploreCacheTime = Date.now();
  }
  
  return exploreData;
}
