import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const TutorDashboard = () => {
  const navigate = useNavigate();
  const [activeTutorings, setActiveTutorings] = useState([
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
  ]);

  const [newRequests, setNewRequests] = useState([
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
  ]);

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleApprove = (request) => {
    const newTutoring = {
      name: request.name,
      slots: ["M", "W", "F"],
      time: request.time,
      type: request.attention.includes("Group") ? "Group" : "Individual",
      subjects: request.subjects,
      standard: "Standard 8",
      school: "To be updated"
    };

    setActiveTutorings([...activeTutorings, newTutoring]);
    setNewRequests(newRequests.filter(r => r.name !== request.name));
    
    setNotificationMessage(`${request.name}'s tutoring request has been approved`);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleReject = (request) => {
    setNewRequests(newRequests.filter(r => r.name !== request.name));
    setNotificationMessage(`${request.name}'s tutoring request has been rejected`);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleEndContract = (student) => {
    setSelectedStudent(student);
    setShowConfirmDialog(true);
  };

  const confirmEndContract = () => {
    setActiveTutorings(activeTutorings.filter(s => s.name !== selectedStudent.name));
    setShowConfirmDialog(false);
    setNotificationMessage(`Contract with ${selectedStudent.name} has been ended`);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const timeSlots = {
    M: 'Morning',
    A: 'Afternoon',
    E: 'Evening'
  };

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
    <div className="fixed inset-0 flex flex-col bg-[#EBECFF] relative">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg px-4 py-3 flex items-center space-x-2 animate-fade-in z-50">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <p className="text-sm text-gray-800">{notificationMessage}</p>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold mb-4">End Contract Confirmation</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to end the contract with {selectedStudent?.name}? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 text-sm rounded-full border hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmEndContract}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-full hover:bg-red-700"
              >
                End Contract
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#2E3192] text-white">
        <div className="w-full flex justify-between items-center px-6 h-16">
          <div className="flex items-center space-x-2">
            <img src="src/assets/LOGO (1).png" alt="Logo" className="h-8" />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-lg font-bold">Amit Kundu</span>
            <img src="src/assets/DP/dp1.jpg" alt="Profile" className="w-8 h-8 rounded-full object-cover" />
            <div className="text-sm">
              <button className="hover:underline rounded-full">Logout</button> | <button className="hover:underline rounded-full">Help</button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 overflow-hidden">
        {/* Account Details Section */}
        <div className="overflow-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">Account Details</h2>
            </div>

            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-4">
                <img src="src/assets/DP/dp1.jpg" alt="Profile" className="w-16 h-16 rounded-full object-cover" />
                <div>
                  <div className="text-lg font-bold text-gray-900">Amit Kundu ✓</div>
                  <div className="text-sm text-gray-600">+91 9876543210 | email@mail.com</div>
                  <div className="text-sm text-gray-600">Physics, Mathematics, Chemistry</div>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <button 
                  className="h-[34.46px] w-[87px] bg-white border border-[#79747E] text-[#79747E] rounded-full hover:bg-gray-50 hover:text-gray-900 flex items-center justify-center"
                >
                  Edit
                </button>
                <button 
                  className="h-[34.46px] w-[87px] bg-white border border-[#79747E] text-[#79747E] rounded-full hover:bg-gray-50 hover:text-gray-900 flex items-center justify-center"
                  onClick={() => navigate('/profile')}
                >
                  Details
                </button>
              </div>
            </div>

            <div className="bg-[#EBECFF] w-[502px] h-[85px] rounded-lg mb-4">
              <div className="h-full flex flex-col justify-center px-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">📍</span>
                    <span>Kestopur | Kolkata</span>
                  </div>
                  <span className="text-blue-600">University of Calcutta</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                    <span>Certificate Added</span>
                  </div>
                  <button className="text-sm text-blue-600 hover:underline rounded-full">Add Update</button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Teaching Details</h3>
              <div className="space-y-2">
                {weekDays.map((day) => (
                  <div key={day} className="flex items-center">
                    <div className="w-24 text-sm">{day}</div>
                    <div className="flex space-x-2">
                      <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full">{schedule[day].morning}</span>
                      <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full">{schedule[day].afternoon}</span>
                      <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full">{schedule[day].evening}</span>
                      <span className="w-6 h-6 flex items-center justify-center bg-green-100 rounded-full">{schedule[day].mode}</span>
                      <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full">{schedule[day].group}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Active Section */}
        <div className="overflow-hidden">
  <div className="bg-white rounded-lg shadow-md p-4 max-h-[715px] overflow-y-auto">
    <h2 className="text-xl font-semibold sticky top-0 bg-white py-2">Active</h2>
    <div className="space-y-4 mt-4">
      {activeTutorings.map((student) => (
        <div key={student.name} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{student.name}</h3>
                    <div className="space-x-2">
                      <button 
                        onClick={() => handleEndContract(student)}
                        className="px-3 py-1 text-sm border rounded-full text-blue-600 hover:bg-blue-50"
                      >
                        End Contract
                      </button>
                      <button className="px-3 py-1 text-sm border rounded-full hover:bg-gray-50">
                        Report
                      </button>
                    </div>
                  </div>
                  <div className="flex space-x-2 mb-2">
                    {student.slots.map((slot) => (
                      <span key={slot} className="px-2 py-1 bg-gray-100 rounded-full text-sm">{slot}</span>
                    ))}
                    <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">{student.time}</span>
                    <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">{student.type}</span>
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
                    <h3 className="text-lg font-bold text-gray-900">{request.name}</h3>
                    <div className="space-x-2">
                      <button 
                        onClick={() => handleApprove(request)}
                        className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleReject(request)}
                        className="px-3 py-1 text-sm border rounded-full hover:bg-gray-50"
                      >
                        Reject
                      </button>
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