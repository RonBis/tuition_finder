import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  BriefcaseIcon, 
  Building2, 
  FileText, 
  MapPin,
  DollarSign,
  MessageCircle,
  Search,
  CheckCircle,
  PlusCircle,
  Loader
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const TeachersPage = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  // Commented out the teacher preferences state
  // const [teacherPreferences, setTeacherPreferences] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Active Teachers');

  useEffect(() => {
    fetchTeachers();
  }, []);
  
  const fetchTeachers = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/v1/teachers');
      console.log('API Response:', response.data);
      
      if (response.data.status === 'success') {
        const teacherData = response.data.data;
        console.log('Teacher Data:', teacherData);
        // Check if the first teacher has a name
        if (teacherData.length > 0) {
          console.log('First teacher name:', teacherData[0].name);
        }
        setTeachers(teacherData);
      } else {
        setError('Failed to retrieve teacher data');
      }
    } catch (err) {
      console.error('Failed to fetch teacher data:', err);
      setError('Failed to load teacher data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  /* Commented out the teacher preferences function
  const fetchTeacherPreferences = async (teacherId) => {
    try {
      const response = await api.get(`/api/v1/teachers/${teacherId}/teacher_preferences`);
      
      if (response.data.status === 'success' && response.data.data.length > 0) {
        setTeacherPreferences(prev => ({
          ...prev,
          [teacherId]: response.data.data[0]
        }));
      }
    } catch (err) {
      console.error(`Failed to fetch preferences for teacher ${teacherId}:`, err);
    }
  };
  */

  // Filter and search teachers
  const filteredTeachers = teachers.filter(teacher => {
    // Apply active/inactive filter
    const activeFilterMatch = 
      activeFilter === 'All Teachers' || 
      (activeFilter === 'Active Teachers' && teacher.is_active) ||
      (activeFilter === 'Inactive Teachers' && !teacher.is_active);
      
    // Apply search filter
    const searchMatch = 
      searchTerm === '' || 
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.address?.toLowerCase().includes(searchTerm.toLowerCase());
      
    return activeFilterMatch && searchMatch;
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  /* 
  // Commented out helper function for subjects
  const getTeacherSubjects = (teacherId) => {
    if (!teacherPreferences[teacherId] || !teacherPreferences[teacherId].subjects) {
      return 'No subjects listed';
    }
    
    return teacherPreferences[teacherId].subjects
      .map(subject => subject.name)
      .join(', ');
  };
  */

  // Helper function to get profile photo URL
  const getProfilePhotoUrl = (teacher) => {
    if (teacher.profile_photo) {
      return `http://localhost:3001${teacher.profile_photo}`;
    }
    return null;
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-700 text-white p-4 flex flex-col">
        <div className="mb-8">
          <h1 className="text-xl font-bold">Tuition Finder</h1>
        </div>
        <nav className="space-y-2 flex-1">
          {[
            { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', onClick: () => navigate('/admin') },
            { icon: <Users className="w-5 h-5" />, label: 'Teachers', active: true },
            { icon: <MessageSquare className="w-5 h-5" />, label: 'Enquiries' },
            { icon: <Building2 className="w-5 h-5" />, label: 'Recruiters' },
            { icon: <BriefcaseIcon className="w-5 h-5" />, label: 'Jobs' },
            { icon: <FileText className="w-5 h-5" />, label: 'Job Applications' },
            { icon: <MapPin className="w-5 h-5" />, label: 'Service Area' },
            { icon: <DollarSign className="w-5 h-5" />, label: 'Revenue' },
            { icon: <MessageCircle className="w-5 h-5" />, label: 'Feedbacks' },
          ].map((item, index) => (
            <div 
              key={index} 
              className={`flex items-center space-x-3 p-2 rounded cursor-pointer ${
                item.active ? 'bg-indigo-800' : 'hover:bg-indigo-600'
              }`}
              onClick={item.onClick}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-auto bg-gray-100">
        {/* Top navigation bar */}
        <div className="bg-indigo-700 text-white p-4 flex justify-between items-center">
          <div></div> {/* Empty div for spacing */}
          <div className="flex items-center space-x-2">
            <span>My Account</span>
            <div className="w-8 h-8 bg-white rounded-full"></div>
          </div>
        </div>

        {/* Teachers content */}
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">Teachers</h2>
          </div>

          {/* Search and filter options */}
          <div className="flex justify-between mb-6">
            <div className="flex space-x-2">
              <div className="relative">
                <button 
                  className="bg-white border rounded-md px-4 py-2 flex items-center space-x-2"
                  onClick={() => {
                    if (activeFilter === 'Active Teachers') {
                      setActiveFilter('Inactive Teachers');
                    } else if (activeFilter === 'Inactive Teachers') {
                      setActiveFilter('All Teachers');
                    } else {
                      setActiveFilter('Active Teachers');
                    }
                  }}
                >
                  <span>{activeFilter}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              <div className="relative">
                <button className="bg-white border rounded-md px-4 py-2 flex items-center space-x-2">
                  <span>Filters</span>
                  <PlusCircle className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex space-x-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by teacher name or location"
                  className="pl-10 pr-4 py-2 border rounded-md w-64"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <Search className="h-4 w-4" />
                </div>
              </div>
              <button className="bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-md px-4 py-2 flex items-center space-x-2">
                <span>Export list</span>
              </button>
            </div>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="flex justify-center items-center h-64">
              <Loader className="w-8 h-8 animate-spin text-indigo-600" />
              <span className="ml-2 text-gray-600">Loading teachers...</span>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
              {error}
            </div>
          )}

          {/* Teachers grid */}
          {!isLoading && !error && (
            <>
              {filteredTeachers.length === 0 ? (
                <div className="bg-white p-8 rounded-lg text-center">
                  <p className="text-gray-500">No teachers found matching your criteria.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTeachers.map((teacher) => (
                    <div key={teacher.id} className="bg-white rounded-lg p-4 flex space-x-4 shadow-sm">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center text-gray-500 overflow-hidden">
                        {getProfilePhotoUrl(teacher) ? (
                          <img 
                            src={getProfilePhotoUrl(teacher)} 
                            alt={teacher.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          teacher.name.charAt(0)
                        )}
                      </div>
                      <div className="flex-1">
                      <div className="flex items-center space-x-1">
                      <h3 className="font-medium">{teacher.name || 'Unnamed Teacher'}</h3>
                       {teacher.is_active && (
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                        <div className="text-sm text-gray-600">
                          <p>{teacher.mobile_number} | {teacher.email}</p>
                          {/* Removed subject display */}
                        </div>
                        <div className="mt-2 flex items-center text-xs text-gray-500 space-x-4">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{teacher.address || 'No address'}</span>
                          </div>
                          {/* Removed teacher preferences display */}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeachersPage;