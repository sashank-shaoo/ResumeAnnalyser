import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('d:/Others/Resumehub/server/.env') });

async function testTitles() {
  const ADZUNA_BASE = 'https://api.adzuna.com/v1/api/jobs';
  const country = 'in';

  const titlesToTest = [
    'Software Engineer',
    'professional',
    'Full Stack Web Developer (MERN)',
    'Senior Frontend React JS Developer',
    'React Developer'
  ];

  for (const title of titlesToTest) {
    const params = {
      app_id: (process.env.ADZUNA_APP_ID || '').trim(),
      app_key: (process.env.ADZUNA_APP_KEY || '').trim(),
      what: title,
      where: '',
      results_per_page: 5,
    };
    try {
      const url = `${ADZUNA_BASE}/${country}/search/1`;
      const response = await axios.get(url, { params });
      console.log(`Title [${title}]: ${response.data.count} jobs found`);
    } catch (err) {
      console.error(`Title [${title}]: Error ${err.message}`);
    }
  }
}

testTitles();
