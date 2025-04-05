import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://127.0.0.1:3001', // Adjust this to your API base URL
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for authentication
api.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for handling authentication errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Redirect to signup page on unauthorized responses
      localStorage.removeItem('auth_token'); // Clear invalid token
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const authService = {
  signIn: (credentials) => api.post('/users/tokens/sign_in', credentials),
  adminSignIn: (credentials) => api.post('/admin-sign-in', credentials),
  signUp: (userData) => api.post('/users/signup', userData), // Add signup endpoint if needed
  getActivityLog: () => api.get('/Activity-Log')
};

export const userService = {
  getUsers: () => api.get('/user/index'),
  createUser: (userData) => api.post('/user/create', userData)
};

export const teacherService = {
  getTeachers: () => api.get('/teacher'),
  getTeacherPreferences: () => api.get('/Teacher-Preference'),
  getTeacherSchedule: () => api.get('/TeacherSchedule')
};

export const jobService = {
  getJobApplicants: () => api.get('/Job-Applicants'),
  getCompanyJobs: () => api.get('/Company-Job'),
  getCompanies: () => api.get('/Company')
};

export const studentService = {
  getStudents: () => api.get('/Student'),
  getTeacherStudentRequests: () => api.get('/Teacher-Student-Request')
};

export const dashboardService = {
  getDashboardData: () => api.get('/dashboard')
};

export const subjectService = {
  getSubjects: () => api.get('/subjects')
};

export const employerService = {
  getEmployers: () => api.get('/employer')
};

export const qualificationService = {
  getQualifications: () => api.get('/educational-qualification')
};

export default api;