import React from 'react';
import { useNavigate } from 'react-router-dom';

const TuitionFinderPage = () => {
  const navigate = useNavigate();

  const handleCardClick = (role) => {
    switch (role) {
      case 'student':
        navigate('/studentdetails1');
        break;
      case 'teacher':
        navigate('/details');
        break;
      case 'job':
        // Add job seeker flow
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#f4f4fc]">
      {/* Header */}
      <header className="bg-[#4527a0] text-white p-4 flex items-center" style={{height: '201px' }}>
        <img 
          src="src/assets/LOGO (2).png" 
          alt="Tuition Finder Logo"
          style={{
            height: '78.24px',
            width: '169.89px',
            position: 'relative',
            left: '69px'
          }}
        />
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center">
        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-700 mb-8">I am</h2>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            className="bg-white w-44 h-44 md:w-56 md:h-56 p-4 md:p-6 rounded-lg shadow-md text-center cursor-pointer hover:shadow-lg transition-shadow flex flex-col items-center justify-center"
            onClick={() => handleCardClick('student')}
          >
            <img src="src/assets/student-icon.png" alt="Student Icon" className="w-12 h-12 md:w-16 md:h-16" />
            <h3 className="mt-4 text-base md:text-lg font-medium">A Student looking for guidance</h3>
          </div>

          <div
            className="bg-white w-44 h-44 md:w-56 md:h-56 p-4 md:p-6 rounded-lg shadow-md text-center cursor-pointer hover:shadow-lg transition-shadow flex flex-col items-center justify-center"
            onClick={() => handleCardClick('teacher')}
          >
            <img src="src/assets/teacher-icon.png" alt="Teacher Icon" className="w-12 h-12 md:w-16 md:h-16" />
            <h3 className="mt-4 text-base md:text-lg font-medium">A teacher, looking for students</h3>
          </div>

          <div
            className="bg-white w-44 h-44 md:w-56 md:h-56 p-4 md:p-6 rounded-lg shadow-md text-center cursor-pointer hover:shadow-lg transition-shadow flex flex-col items-center justify-center"
            onClick={() => handleCardClick('job')}
          >
            <img src="src/assets/job-icon.png" alt="Job Icon" className="w-12 h-12 md:w-16 md:h-16" />
            <h3 className="mt-4 text-base md:text-lg font-medium">Seeking for Job opportunities</h3>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-6 space-x-4">
              <button
                className="w-[151.5px] h-[60px] bg-gray-200 rounded-[150px] hover:bg-gray-300 text-[21px]"
                onClick={() => navigate('/')}
              >
                Back
              </button>
              <button
                className="w-[151.5px] h-[60px] bg-[#2E3192] text-white rounded-[150px] hover:opacity-90 text-[21px]"
                onClick={() => navigate('/slots')}
              >
                Next
              </button>
            </div>
      </main>
    </div>
  );
};

export default TuitionFinderPage;
