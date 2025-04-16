import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { slotsService } from '../services/slot-service';

const Slots = () => {
  const [selectedSlots, setSelectedSlots] = useState({});
  const [selectedTimes, setSelectedTimes] = useState({});
  const [selectedTypes, setSelectedTypes] = useState({});
  const [hasValidSelection, setHasValidSelection] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const navigate = useNavigate();
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const times = ['Morning', 'Afternoon', 'Evening'];
  const types = ['Individual', 'All_Group', 'Any'];
  
  // Map days to week_day number for the API
  const dayToNumber = {
    'Monday': 1,
    'Tuesday': 2,
    'Wednesday': 3,
    'Thursday': 4,
    'Friday': 5,
    'Saturday': 6,
    'Sunday': 7
  };

  const handleDaySelect = (day) => {
    setSelectedSlots(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

  const handleTimeSelect = (day, time) => {
    const key = `${day}-${time}`;
    setSelectedTimes(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleTypeSelect = (day, type) => {
    // If Any is selected, deselect Individual and Group
    if (type === 'Any') {
      setSelectedTypes(prev => {
        const newTypes = {...prev};
        newTypes[`${day}-Individual`] = false;
        newTypes[`${day}-Group`] = false;
        newTypes[`${day}-Any`] = !prev[`${day}-Any`];
        return newTypes;
      });
    } 
    // If Individual or Group is selected, deselect Any
    else {
      setSelectedTypes(prev => {
        const newTypes = {...prev};
        newTypes[`${day}-Any`] = false;
        newTypes[`${day}-${type}`] = !prev[`${day}-${type}`];
        return newTypes;
      });
    }
  };

  useEffect(() => {
    checkValidSelection();
  }, [selectedSlots, selectedTimes, selectedTypes]);

  const checkValidSelection = () => {
    // Check if at least one vertical selection exists (day + time + type)
    let valid = false;
    days.forEach(day => {
      times.forEach(time => {
        const hasDay = selectedSlots[day];
        const hasTime = selectedTimes[`${day}-${time}`];
        const hasType = types.some(type => selectedTypes[`${day}-${type}`]);
        if (hasDay && hasTime && hasType) {
          valid = true;
        }
      });
    });
    setHasValidSelection(valid);
  };

  // Function to transform UI state into API format
  const prepareScheduleData = (teacherId) => {
    // We should always return an array of schedules
    const schedules = [];
    
    // For each selected day
    days.forEach(day => {
      if (!selectedSlots[day]) return; // Skip days that aren't selected
      
      const weekDayNum = dayToNumber[day];
      
      // Group time slots by preferred_group for this day
      const groupedSlots = {};
      
      // For each day, find the selected times and types
      times.forEach(time => {
        if (!selectedTimes[`${day}-${time}`]) return; // Skip times that aren't selected
        
        // Find the selected type for this day
        types.forEach(type => {
          if (selectedTypes[`${day}-${type}`]) {
            const preferredGroup = type.toLowerCase();
            
            if (!groupedSlots[preferredGroup]) {
              groupedSlots[preferredGroup] = {
                preferred_group: preferredGroup,
                time_of_day: []
              };
            }
            
            // Add this time to the group's time_of_day array
            groupedSlots[preferredGroup].time_of_day.push(time.toLowerCase());
          }
        });
      });
      
      if (Object.keys(groupedSlots).length > 0) {
        // Create schedule object for this day
        schedules.push({
          teacher_id: teacherId,
          week_day: weekDayNum,
          time_slots_attributes: Object.values(groupedSlots)
        });
      }
    });
    
    return schedules;
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    if (!hasValidSelection) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Get teacher ID (you might want to get this from context, props, or localStorage)
      const teacherId = localStorage.getItem('teacher_id') || 1; // Replace with actual teacher ID source
      
      // Prepare schedule data for the API
      const scheduleData = prepareScheduleData(teacherId);
      
      // For debugging
      console.log('Sending schedule data:', JSON.stringify(scheduleData, null, 2));
      
      // Handle both single and multiple schedules
      if (scheduleData.length === 0) {
        throw new Error('No valid schedules to submit');
      } else if (scheduleData.length === 1) {
        // Send single schedule
        await slotsService.createSchedule(scheduleData[0]);
      } else {
        // Try to send multiple schedules
        // Option 1: If API supports batch creation
        await slotsService.createSchedule({ teacher_schedules: scheduleData });
        
        // Option 2: If API requires sending one by one (uncomment if needed)
        // for (const schedule of scheduleData) {
        //   await slotsService.createSchedule(schedule);
        // }
      }
      
      console.log('Schedule saved successfully');
      setShowSuccessMessage(true);
      
      // Redirect to home page after showing success message
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (error) {
      console.error('Error saving schedule:', error);
      console.error('Error details:', error.response?.data);
      console.error('Status:', error.response?.status);
      setError(
        error.response?.data?.message || 
        error.message ||
        'Failed to save schedule. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-[#EBECFF]">
      {/* Navbar */}
      <header className="bg-[#4527a0] text-white p-4 flex items-center" style={{height: '165px' }}>
        <img 
          src="src/assets/LOGO (2).png" 
          alt="Tuition Finder Logo"
          style={{
            height: '78.24px',
            width: '169.89px',
            position: 'relative',
            left: '69px',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/')}
        />
      </header>

      {/* Main Content - Centered */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-4xl">
          <h2 className="text-2xl font-bold mb-6">Date & Time</h2>
          <p className="text-gray-600 mb-6">Choose Days, time & batch type you prefer to teach</p>
          
          {error && (
            <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          {showSuccessMessage && (
            <div className="mb-6 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              User registered successfully! Redirecting...
            </div>
          )}
          
          <div className="space-y-4">
            {days.map(day => (
              <div key={day} className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
                <div className="w-full md:w-32">
                  <button 
                    onClick={() => handleDaySelect(day)}
                    className={`px-2 py-1 md:px-4 md:py-2 rounded-full w-full transition-colors ${
                      selectedSlots[day] 
                        ? 'bg-[#D8D9FF]' 
                        : 'bg-gray-100'
                    }`}
                  >
                    {day}
                  </button>
                </div>
                
                <div className="flex flex-wrap justify-center md:justify-start space-x-2">
                  {times.map(time => (
                    <button
                      key={`${day}-${time}`}
                      onClick={() => handleTimeSelect(day, time)}
                      className={`px-2 py-1 md:px-4 md:py-2 rounded-full transition-colors ${
                        selectedTimes[`${day}-${time}`]
                          ? 'bg-[#D8D9FF]'
                          : 'bg-gray-100'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
                
                <div className="flex flex-wrap justify-center md:justify-start space-x-2">
                  {types.map(type => (
                    <button
                      key={`${day}-${type}`}
                      onClick={() => handleTypeSelect(day, type)}
                      className={`px-2 py-1 md:px-4 md:py-2 rounded-full transition-colors ${
                        selectedTypes[`${day}-${type}`]
                          ? 'bg-[#D8D9FF]'
                          : 'bg-gray-100'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button className="flex items-center px-6 py-2 text-gray-700 hover:text-gray-900" onClick={() => navigate('/details')}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <button 
              className={`px-6 py-2 rounded-md ${
                hasValidSelection 
                  ? 'bg-indigo-800 text-white hover:bg-indigo-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!hasValidSelection || isSubmitting || showSuccessMessage}
              onClick={handleSubmit}
            >
              {isSubmitting ? 'Saving...' : 'Create Profile'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slots;