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
      localStorage.removeItem('user_id'); // Also clear user ID
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Utility function to wait for user ID to be available
const waitForUserId = (maxWaitTimeMs = 10000, checkIntervalMs = 100) => {
  return new Promise((resolve, reject) => {
    // Check immediately first
    const userId = localStorage.getItem('user_id');
    if (userId) {
      return resolve(userId);
    }
    
    // Set up polling if not found immediately
    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      const userId = localStorage.getItem('user_id');
      
      if (userId) {
        clearInterval(checkInterval);
        resolve(userId);
      } else if (Date.now() - startTime > maxWaitTimeMs) {
        clearInterval(checkInterval);
        reject(new Error('No user_id found in localStorage. User might not be logged in.'));
      }
    }, checkIntervalMs);
  });
};

// Helper function to recursively find user ID in response
const findUserIdInObject = (obj, maxDepth = 3, currentDepth = 0) => {
  // Prevent too deep recursion
  if (!obj || typeof obj !== 'object' || currentDepth > maxDepth) {
    return null;
  }
  
  // Direct check for id
  if (obj.id && (typeof obj.id === 'number' || typeof obj.id === 'string')) {
    return obj.id;
  }
  
  // Search in nested objects
  for (const key in obj) {
    // Skip certain keys that are unlikely to contain user data
    if (['token_type', 'expires_in', 'created_at', 'updated_at'].includes(key)) {
      continue;
    }
    
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      // If the key is 'user' or contains 'user', prioritize this path
      if (key === 'user' || key.includes('user') || key === 'profile') {
        if (obj[key].id) {
          return obj[key].id;
        }
      }
      
      // Recursive search
      const result = findUserIdInObject(obj[key], maxDepth, currentDepth + 1);
      if (result) {
        return result;
      }
    }
  }
  
  return null;
};

// API endpoints
export const authService = {
  signIn: async (credentials) => {
    try {
      const response = await api.post('/users/tokens/sign_in', credentials);
      console.log('Response from sign_in:', response.data);
      
      // Store auth token
      if (response.data?.token) {
        localStorage.setItem('auth_token', response.data.token);
      } else if (response.data?.refresh_token) {
        localStorage.setItem('auth_token', response.data.refresh_token);
      }
      
      // Enhanced user ID extraction - checks multiple locations in the response
      let userId = null;
      
      // Check direct properties first
      if (response.data?.id) {
        userId = response.data.id;
        console.log('Found direct user_id in response:', userId);
      } else if (response.data?.user_id) {
        userId = response.data.user_id;
        console.log('Found user_id property in response:', userId);
      } else if (response.data?.user?.id) {
        userId = response.data.user.id;
        console.log('Found user_id in user object:', userId);
      } else if (response.data?.profile?.id) {
        userId = response.data.profile.id;
        console.log('Found user_id in profile object:', userId);
      } else {
        // Try to find the ID using the recursive helper
        userId = findUserIdInObject(response.data);
        if (userId) {
          console.log('Found user_id through deep search:', userId);
        } else {
          console.warn('User ID not found in response');
        }
      }
      
      if (userId) {
        localStorage.setItem('user_id', userId);
      }
      
      return response;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },
  
  adminSignIn: async (credentials) => {
    const response = await api.post('/admin-sign-in', credentials);
    
    // Store admin user ID in local storage after successful login
    if (response.data && response.data.user_id) {
      localStorage.setItem('user_id', response.data.user_id);
    } else if (response.data && response.data.user && response.data.user.id) {
      localStorage.setItem('user_id', response.data.user.id);
    }
    
    return response;
  },
  
  signUp: (userData) => api.post('/users/signup', userData),
  getActivityLog: () => api.get('/Activity-Log'),
  
  // Helper method to get the current user ID
  getCurrentUserId: () => localStorage.getItem('user_id'),
  
  // Method that waits for user ID to be available
  waitForUserId: (maxWaitTimeMs = 10000, checkIntervalMs = 100) => waitForUserId(maxWaitTimeMs, checkIntervalMs),
  
  // Method that ensures a user is logged in before proceeding
  requireAuth: async (redirectPath = '/') => {
    try {
      await waitForUserId();
      return true;
    } catch (error) {
      window.location.href = redirectPath;
      return false;
    }
  }
};

export const userService = {
  getUsers: () => api.get('/user/index'),
  createUser: (userData) => api.post('/user/create', userData),
  
  // Get current user with waiting capability
  getCurrentUser: async (waitTime = 10000) => {
    try {
      const userId = await waitForUserId(waitTime);
      return api.get(`/user/${userId}`);
    } catch (error) {
      return Promise.reject(error);
    }
  }
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