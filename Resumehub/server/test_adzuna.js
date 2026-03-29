import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('d:/Others/Resumehub/server/.env') });

async function testAdzuna() {
  const ADZUNA_BASE = 'https://api.adzuna.com/v1/api/jobs';
  const country = (process.env.ADZUNA_COUNTRY || 'gb').replace(/[\r\n\s]/g, '');

  const queries = [
    { what: 'Software Engineer', where: '' },
    { what: 'Software Engineer', where: 'India' },
    { what: 'Software Engineer', where: 'Bangalore' },
  ];

  for (const q of queries) {
    const params = {
      app_id: (process.env.ADZUNA_APP_ID || '').trim(),
      app_key: (process.env.ADZUNA_APP_KEY || '').trim(),
      results_per_page: 5,
      ...q,
      'content-type': 'application/json',
    };

    try {
      const url = `${ADZUNA_BASE}/${country}/search/1`;
      const response = await axios.get(url, { params });
      console.log(`[where=${q.where || '<empty>'}] Found ${response.data.count} jobs.`);
    } catch (err) {
      console.error(`Error for [where=${q.where}]:`, err.message);
    }
  }
}

testAdzuna();
