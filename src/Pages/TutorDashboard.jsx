import React, { useEffect } from 'react';

const TutorDashboard = () => {
  // Add effect to remove default margins
  useEffect(() => {
    // Remove any margins/padding from body and html
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    
    // Ensure full viewport height
    document.body.style.height = '100vh';
    document.documentElement.style.height = '100vh';
    
    // Prevent scrolling on body
    document.body.style.overflow = 'hidden';
    
    // Cleanup function
    return () => {
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.documentElement.style.margin = '';
      document.documentElement.style.padding = '';
      document.body.style.height = '';
      document.documentElement.style.height = '';
      document.body.style.overflow = '';
    };
  }, []);

  // ... (previous data objects remain the same)
  const timeSlots = {
    M: 'Morning',
    A: 'Afternoon',
    E: 'Evening'
  };

  const activeTutorings = [
    {
      name: "Piyali Paul",
      slots: ["M", "W", "F"],
      time: "Evening",
      type: "Individual",
      subjects: "Physics, Mathematics, Chemistry",
      standard: "Standard 8",
      school: "DPS Ruby Park"
    },
    {
      name: "Rishi Raj",
      slots: ["M", "W", "F"],
      time: "Evening",
      type: "Individual",
      subjects: "Physics, Mathematics, Chemistry",
      standard: "Standard 8",
      school: "DPS Ruby Park"
    },
    {
      name: "Oishani Roy",
      slots: ["M", "W", "F"],
      time: "Evening",
      type: "Individual",
      subjects: "Physics, Mathematics, Chemistry",
      standard: "Standard 8",
      school: "DPS Ruby Park"
    },
    {
      name: "Rahul Ghosh",
      slots: ["M", "W", "F"],
      time: "Evening",
      type: "Individual",
      subjects: "Physics, Mathematics, Chemistry",
      standard: "Standard 8",
      school: "DPS Ruby Park"
    }
  ];

  const newRequests = [
    {
      name: "Rita Gupta",
      time: "Evening",
      attention: "Requires individual attention",
      medium: "English",
      subjects: "Physics and Mathematics"
    },
    {
      name: "Kusha Kapila",
      time: "Morning",
      attention: "Requires individual attention",
      medium: "English",
      subjects: "English"
    },
    {
      name: "Ravi Kishan",
      time: "Evening",
      attention: "Interested in Group classes",
      medium: "English",
      subjects: "Political Science"
    }
  ];

  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const schedule = {
    'Sunday': { morning: 'M', afternoon: 'A', evening: 'E', mode: 'IN', group: 'G' },
    'Monday': { morning: 'M', afternoon: 'A', evening: 'E', mode: 'IN', group: 'G' },
    'Tuesday': { morning: 'M', afternoon: 'A', evening: 'E', mode: 'IN', group: 'G' },
    'Wednesday': { morning: 'M', afternoon: 'A', evening: 'E', mode: 'IN', group: 'G' },
    'Thursday': { morning: 'M', afternoon: 'A', evening: 'E', mode: 'IN', group: 'G' },
    'Friday': { morning: 'M', afternoon: 'A', evening: 'E', mode: 'IN', group: 'G' },
    'Saturday': { morning: 'M', afternoon: 'A', evening: 'E', mode: 'IN', group: 'G' }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-indigo-700 text-white">
        <div className="w-full flex justify-between items-center px-6 h-16">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">📚</span>
            <span className="text-xl font-semibold">TutorHub</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Amit Kundu</span>
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-600">AK</span>
            </div>
            <div className="text-sm">
              <button className="hover:underline">Logout</button> | <button className="hover:underline">Help</button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 overflow-hidden">
        {/* Account Details */}
        <div className="overflow-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Account Details</h2>
              <div className="space-x-2">
                <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">Edit</button>
                <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">Details</button>
              </div>
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
              <div>
                <div className="font-semibold">Amit Kundu ✓</div>
                <div className="text-sm text-gray-600">+91 9876543210 | email@mail.com</div>
                <div className="text-sm text-gray-600">Physics, Mathematics, Chemistry</div>
              </div>
            </div>

            <div className="flex items-center space-x-2 mb-4">
              <span className="text-gray-600">📍</span>
              <span>Kestopur | Kolkata</span>
              <span className="text-blue-600">University of Calcutta</span>
            </div>

            <div className="flex items-center space-x-2 mb-6">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
              <span>Certificate Added</span>
              <button className="text-sm text-blue-600 hover:underline ml-auto">Add Update</button>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Teaching Details</h3>
              <div className="space-y-2">
                {weekDays.map((day) => (
                  <div key={day} className="flex items-center">
                    <div className="w-24 text-sm">{day}</div>
                    <div className="flex space-x-2">
                      <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded">{schedule[day].morning}</span>
                      <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded">{schedule[day].afternoon}</span>
                      <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded">{schedule[day].evening}</span>
                      <span className="w-6 h-6 flex items-center justify-center bg-green-100 rounded">{schedule[day].mode}</span>
                      <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded">{schedule[day].group}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Active Section */}
        <div className="overflow-auto">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold sticky top-0 bg-white py-2">Active</h2>
            <div className="space-y-4 mt-4">
              {activeTutorings.map((student) => (
                <div key={student.name} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{student.name}</h3>
                    <div className="space-x-2">
                      <button className="px-3 py-1 text-sm border rounded text-blue-600 hover:bg-blue-50">End Contract</button>
                      <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">Report</button>
                    </div>
                  </div>
                  <div className="flex space-x-2 mb-2">
                    {student.slots.map((slot) => (
                      <span key={slot} className="px-2 py-1 bg-gray-100 rounded text-sm">{slot}</span>
                    ))}
                    <span className="px-2 py-1 bg-gray-100 rounded text-sm">{student.time}</span>
                    <span className="px-2 py-1 bg-gray-100 rounded text-sm">{student.type}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div>{student.subjects}</div>
                    <div>{student.standard} | {student.school}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* New Requests Section */}
        <div className="overflow-auto">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold sticky top-0 bg-white py-2">New Requests</h2>
            <div className="space-y-4 mt-4">
              {newRequests.map((request) => (
                <div key={request.name} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{request.name}</h3>
                    <div className="space-x-2">
                      <button className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700">Approve</button>
                      <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">Reject</button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Time: {request.time}</div>
                    <div>{request.attention}</div>
                    <div>Medium: {request.medium}</div>
                    <div>Subjects: {request.subjects}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;