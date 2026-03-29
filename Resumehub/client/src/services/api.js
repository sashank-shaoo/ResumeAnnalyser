import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Resume API ────────────────────────────────────────────────

/** Upload a resume file and get back extracted text */
export const uploadResume = (file) => {
  const formData = new FormData();
  formData.append('resume', file);
  return api.post('/api/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

/** Send resume text + personalization to LLM for analysis */
export const analyseResume = (resumeText, personalization, userId, fileName) =>
  api.post('/api/resume/analyse', { resumeText, personalization, userId, fileName });

// ── Jobs API ──────────────────────────────────────────────────

/** Fetch job listings based on an inferred job profile */
export const searchJobs = (jobProfile) =>
  api.post('/api/jobs/search', jobProfile);

// ── User API ──────────────────────────────────────────────────

/** Create or upsert a user from onboarding data */
export const createUser = (data) =>
  api.post('/api/users', data);

/** Get a user by ID */
export const getUserById = (id) =>
  api.get(`/api/users/${id}`);

/** Update a user by ID */
export const updateUser = (id, data) =>
  api.put(`/api/users/${id}`, data);
  
// ── Auth API ──────────────────────────────────────────────────

/** Verify user OTP */
export const verifyOtp = (email, otp) =>
  api.post('/api/auth/verify-otp', { email, otp });

/** Resend user OTP */
export const resendOtp = (email) =>
  api.post('/api/auth/resend-otp', { email });

// ── Saved Jobs API ────────────────────────────────────────────

/** Save a job for the current user */
export const saveJob = (data) =>
  api.post('/api/saved-jobs', data);

export const getExploreJobs = () => api.get('/api/jobs/explore');

/** Get all saved jobs for a user */
export const getSavedJobs = (userId) =>
  api.get(`/api/saved-jobs/${userId}`);

/** Remove a saved job by record ID */
export const deleteSavedJob = (id) =>
  api.delete(`/api/saved-jobs/${id}`);

export default api;
