import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Slots = () => {
  const [selectedSlots, setSelectedSlots] = useState({});
  const [selectedTimes, setSelectedTimes] = useState({});
  const [selectedTypes, setSelectedTypes] = useState({});
  const [hasValidSelection, setHasValidSelection] = useState(false);
  const navigate = useNavigate();
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const times = ['Morning', 'Afternoon', 'Evening'];
  const types = ['Individual', 'Group', 'Any'];
  
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

  return (
    <div className="w-screen h-screen flex flex-col bg-[#EBECFF]">
      {/* Navbar */}
      <div className="w-full bg-[#001F54] shadow-md" style={{ height: '125px' }}>
        <div className="container mx-auto px-4 py-4 h-full flex items-center">
          <div className="flex items-center">
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z" />
            </svg>
            <h1 className="text-2xl font-bold text-white ml-2">Tuition Finder</h1>
          </div>
        </div>
      </div>

      {/* Main Content - Centered */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-4xl">
          <h2 className="text-2xl font-bold mb-6">Date & Time</h2>
          <p className="text-gray-600 mb-6">Choose Days, time & batch type you prefer to teach</p>
          
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
              onClick={() => hasValidSelection && navigate('/tutor')}
            >
              Create Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slots;