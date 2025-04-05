import api from './api';

// Service for handling teacher schedule-related API calls
export const slotsService = {
  // Get all schedules for the current teacher
  getSchedules: () => api.get('/api/v1/teacher_schedules'),
  
  // Get a specific schedule by ID
  getScheduleById: (scheduleId) => api.get(`/api/v1/teacher_schedules/${scheduleId}`),
  
  // Create a new schedule - wrapping the data in a teacher_schedule object
  createSchedule: (scheduleData) => api.post('/api/v1/teacher_schedules', { teacher_schedule: scheduleData }),
  
  // Update an existing schedule
  updateSchedule: (scheduleId, scheduleData) => api.put(`/api/v1/teacher_schedules/${scheduleId}`, { teacher_schedule: scheduleData }),
  
  // Delete a schedule
  deleteSchedule: (scheduleId) => api.delete(`/api/v1/teacher_schedules/${scheduleId}`)
};

export default slotsService;