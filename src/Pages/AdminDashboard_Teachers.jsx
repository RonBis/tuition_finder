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
  Filter,
  CheckCircle,
  PlusCircle,
  Loader
} from 'lucide-react';
import { teacherService } from '../services/adminteacher';
import { useNavigate } from 'react-router-dom';
const TeachersPage = () => {
    const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Active Teachers');

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    try {
      setIsLoading(true);
      const response = await teacherService.getMergedTeacherData();
      setTeachers(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch teacher data:', err);
      setError('Failed to load teacher data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and search teachers
  const filteredTeachers = teachers.filter(teacher => {
    // Apply active/inactive filter
    const activeFilterMatch = 
      activeFilter === 'All Teachers' || 
      (activeFilter === 'Active Teachers' && teacher.verified) ||
      (activeFilter === 'Inactive Teachers' && !teacher.verified);
      
    // Apply search filter
    const searchMatch = 
      searchTerm === '' || 
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subjects.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.location.toLowerCase().includes(searchTerm.toLowerCase());
      
    return activeFilterMatch && searchMatch;
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
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
                  onClick={() => setActiveFilter(activeFilter === 'Active Teachers' ? 'All Teachers' : 'Active Teachers')}
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
                  placeholder="Search by teacher name, subject or location"
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
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center text-gray-500">
                        {teacher.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-1">
                          <h3 className="font-medium">{teacher.name}</h3>
                          {teacher.verified && (
                            <CheckCircle className="h-4 w-4 text-blue-500" />
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>{teacher.phone} | {teacher.email}</p>
                          <p className="text-sm">{teacher.subjects}</p>
                        </div>
                        <div className="mt-2 flex items-center text-xs text-gray-500 space-x-4">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{teacher.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FileText className="h-3 w-3" />
                            <span>{teacher.university}</span>
                          </div>
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