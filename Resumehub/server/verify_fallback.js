import dotenv from 'dotenv';
import path from 'path';
import { searchJobs } from './src/services/jobSearchService.js';

dotenv.config({ path: path.resolve('d:/Others/Resumehub/server/.env') });

async function verifyFallback() {
  const profileWithStrictTitle = {
    inferredJobTitles: ['Highly Specific NonExistent Title 12345'],
    inferredDomain: 'Software Engineering',
    topSkills: ['React', 'Node.js'],
    preferredLocation: 'Mars' // Should fail then fallback to empty location
  };

  try {
    console.log('Testing fallback for strict profile...');
    const jobs = await searchJobs(profileWithStrictTitle);
    console.log(`Successfully found ${jobs.length} jobs through fallback!`);
    if (jobs.length > 0) {
      console.log('Top match title:', jobs[0].title);
    }
  } catch (err) {
    console.error('Fallback test failed:', err.message);
  }
}

verifyFallback();
