import api from './api';

export const teacherService = {
  // Get all teachers
  getTeachers: () => api.get('/api/v1/teachers'),
  
  // Get a specific teacher by ID
  getTeacherById: (id) => api.get(`/api/v1/teachers/${id}`),
  
  // Create a new teacher - fixed to match exact API format
  createTeacher: (teacherData) => {
    // Format date of birth to match expected format "DD/MM/YYYY"
    let formattedDOB = teacherData.dateOfBirth;
    if (formattedDOB && formattedDOB.includes('-')) {
      // Convert from YYYY-MM-DD to DD/MM/YYYY
      const [year, month, day] = formattedDOB.split('-');
      formattedDOB = `${day}/${month}/${year}`;
    }
    
    // Get the user_id with robust fallback
    let userId = null;
    
    // Try multiple storage locations
    const storedUserId = localStorage.getItem('user_id');
    const userData = localStorage.getItem('user_data');
    
    if (storedUserId) {
      userId = parseInt(storedUserId);
      console.log('Using user_id from localStorage:', userId);
    } else if (userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        if (parsedUserData && parsedUserData.id) {
          userId = parseInt(parsedUserData.id);
          console.log('Using user_id from user_data:', userId);
          // Save for future use
          localStorage.setItem('user_id', userId);
        }
      } catch (e) {
        console.error('Error parsing user_data:', e);
      }
    }
    
    if (!userId) {
      console.error('No user ID found in any storage location');
      throw new Error('User ID is required but not found');
    }
    
    // Match exactly the format seen in your API request example
    const apiFormattedData = {
      "teacher": {
        "name": teacherData.name,
        "address": teacherData.address,
        "mobile_number": teacherData.mobileNumber,
        "email": teacherData.email || `${teacherData.name.toLowerCase().replace(/\s+/g, '')}@example.com`,
        "alt_mobile": teacherData.alternateNumber || "",
        "gender": teacherData.gender,
        "date_of_birth": formattedDOB,
        "is_active": true,
        "user_id": userId
      }
    };
    
    // Log the request for debugging
    console.log('Sending API request:', apiFormattedData);
    
    return api.post('/api/v1/teachers', apiFormattedData, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
  },
  
  // Update an existing teacher
  updateTeacher: (id, teacherData) => {
    // Format date of birth
    let formattedDOB = teacherData.dateOfBirth;
    if (formattedDOB && formattedDOB.includes('-')) {
      // Convert from YYYY-MM-DD to DD/MM/YYYY
      const [year, month, day] = formattedDOB.split('-');
      formattedDOB = `${day}/${month}/${year}`;
    }
    
    const apiFormattedData = {
      "teacher": {
        "name": teacherData.name,
        "address": teacherData.address,
        "mobile_number": teacherData.mobileNumber,
        "email": teacherData.email || `${teacherData.name.toLowerCase().replace(/\s+/g, '')}@example.com`,
        "alt_mobile": teacherData.alternateNumber || "",
        "gender": teacherData.gender,
        "date_of_birth": formattedDOB,
        "is_active": true
      }
    };
    
    return api.post(`/api/v1/teachers/${id}`, apiFormattedData);
  },
  
  // Delete a teacher
  deleteTeacher: (id) => api.delete(`/api/v1/teachers/${id}`),
  
  // Handle teacher preferences 
  getTeacherPreferences: (teacherId) => api.get(`/api/v1/teachers/${teacherId}/preferences`),
  
  // Create teacher preferences
  createTeacherPreferences: (teacherId, preferenceData) => {
    return api.post(`/api/v1/teachers/${teacherId}/preferences`, {
      preference: preferenceData
    });
  }
};

export default teacherService;