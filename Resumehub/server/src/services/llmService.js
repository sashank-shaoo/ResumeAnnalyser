import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// gemini-2.5-flash: Has quota on this API key and supports JSON schema
const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
  generationConfig: {
    temperature: 0.3,
    responseMimeType: 'application/json',
  },
});

/**
 * Sends resume text + personalization to Gemini and returns a structured job profile.
 * @param {string} resumeText
 * @param {Object} personalization
 * @returns {Promise<Object>} Inferred job profile
 */
export async function analyseResumeWithLLM(resumeText, personalization) {
  const prompt = `You are an expert career advisor and resume analyst.
Analyse the provided resume text and personalization preferences, then return a JSON object with EXACTLY these fields:
{
  "inferredJobTitles": string[],
  "topSkills": string[],
  "seniority": string,
  "inferredDomain": string,
  "preferredLocation": string,
  "yearsOfExperience": number,
  "summary": string,
  "experience": [
    {
      "company": string,
      "role": string,
      "duration": string,
      "highlights": string[]
    }
  ]
}

Rules:
- inferredJobTitles: 3-5 best matching job titles
- topSkills: top 8-10 technical and soft skills extracted from the resume
- seniority: one of "Junior" | "Mid-level" | "Senior" | "Lead" | "Executive"
- inferredDomain: e.g. "Software Engineering", "Data Science", "Design"
- preferredLocation: from personalization, or inferred from resume
- yearsOfExperience: estimated number from resume
- summary: 1-2 sentence professional summary
- experience: A list of 3-5 most recent roles with company, role name, duration (e.g. "2021 - Present"), and 2-3 key strategic highlights.

Return ONLY valid JSON. No markdown, no code fences, no explanation.

Resume Text:
${resumeText}

User Preferences:
- Preferred Location: ${personalization.preferredLocation || 'Any'}
- Preferred Industry: ${personalization.preferredIndustry || 'Any'}
- Seniority Level: ${personalization.experienceLevel || 'Not specified'}`;

  const result = await model.generateContent(prompt);
  const raw = result.response.text().replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
  return JSON.parse(raw);
}
