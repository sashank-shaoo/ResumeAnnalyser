import dotenv from 'dotenv';
import path from 'path';
import { analyseResumeWithLLM } from './src/services/llmService.js';
import { searchJobs } from './src/services/jobSearchService.js';

dotenv.config({ path: path.resolve('d:/Others/Resumehub/server/.env') });

const dummyResume = `
John Doe
Location: Bangalore, India
Experience: 5 years in MERN Stack Development, React, Node.js, MongoDB. Built scalable web applications.
Previous Job Title: Full Stack Developer
`;

async function testFlow() {
  try {
    console.log('[1] Analysing Resume...');
    const profile = await analyseResumeWithLLM(dummyResume, {});
    console.log('LLM Profile:', JSON.stringify(profile, null, 2));

    console.log('\n[2] Searching Jobs for keyword:', profile.inferredJobTitles[0]);
    const jobs = await searchJobs(profile);
    console.log(`Found ${jobs.length} jobs.`);
    if (jobs.length > 0) {
      console.log('Top job:', jobs[0].title);
    }
  } catch (err) {
    console.error('Error during flow:', err.response?.data || err.message);
  }
}

testFlow();
