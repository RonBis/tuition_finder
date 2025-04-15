import api from './api';

export const educationalQualificationService = {
  // Get all qualifications
  getQualifications: () => api.get('api/v1/teacher_educational_qualifications'),

  // Get qualifications for a specific teacher
  getTeacherQualifications: (teacherId) => 
    api.get(`/api/v1/${teacherId}/teacher_educational_qualifications`),
  
  // Create educational qualification for a teacher
  createTeacherQualification: (teacherId, qualificationData) => {
    // Format the data to match API expectations
    const formattedData = {
      "teacher_educational_qualification": {
        "teacher_id": teacherId,
        "degree_id": qualificationData.degree_id || 1,
        "subject_id": qualificationData.subject_id || 1,
        "year_of_passing": qualificationData.yearofPassing,
        "school_name": qualificationData.schoolName,
        "college_name": qualificationData.collegeName || "",
        "university_name": qualificationData.universityName || ""
      }
    };

    return api.post('/api/v1/teacher_educational_qualifications', formattedData);
  },
  
  // Update an existing qualification
  updateTeacherQualification: (qualificationId, qualificationData) => {
    const formattedData = {
      "teacher_educational_qualification": {
        "degree_id": qualificationData.degree_id || 1,
        "subject_id": qualificationData.subject_id || 1,
        "year_of_passing": qualificationData.yearofPassing,
        "school_name": qualificationData.schoolName,
        "college_name": qualificationData.collegeName || "",
        "university_name": qualificationData.universityName || ""
      }
    };

    return api.put(`/api/v1/teacher_educational_qualifications/${qualificationId}`, formattedData);
  },
  
  // Delete a qualification
  deleteTeacherQualification: (qualificationId) => 
    api.delete(`/api/v1/teacher_educational_qualifications/${qualificationId}`),
    
  // Map frontend qualification value to backend degree_id
  mapQualificationToDegreeId: (qualification) => {
    const qualificationMap = {
      "No formal education": 1,
      "Primary education": 2,
      "Secondary education or high school": 3,
      "GED": 4,
      "Vocational qualification": 5,
      "Bachelor's degree": 6,
      "Master's degree": 7,
      "Doctorate or higher": 8
    };
    
    return qualificationMap[qualification] || 1;
  },
  
  // Format date from YYYY-MM-DD to DD-MM-YYYY
  formatYearOfPassing: (dateString) => {
    if (!dateString) return "";
    
    // Check if the date is already in the expected format
    if (dateString.includes('/')) return dateString;
    
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}-${month}-${year}`;
    } catch (e) {
      console.error('Error formatting date:', e);
      return dateString;
    }
  }
};

export default educationalQualificationService;