import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
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
  BellIcon,
  UserIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  
  const busyHoursData = [
    { name: '8am-12pm', school: 40, college: 24, working: 35 },
    { name: '12pm-4pm', school: 30, college: 40, working: 22 },
    { name: '4pm-8pm', school: 20, college: 38, working: 30 },
    { name: '8pm-12am', school: 27, college: 39, working: 45 },
  ];

  const classTypeData = [
    { name: 'Online', value: 45 },
    { name: 'Offline', value: 35 },
    { name: 'Mix', value: 20 },
  ];

  const mostSearchedData = [
    { subject: 'Physics', value: 65 },
    { subject: 'Math', value: 12 },
    { subject: 'English', value: 60 },
    { subject: 'History', value: 48 },
    { subject: 'Chemistry', value: 72 },
    { subject: 'Biology', value: 45 },
    { subject: 'Computer', value: 68 },
    { subject: 'Hindi', value: 70 },
    { subject: 'Sanskrit', value: 85 }
  ];

  const industryJobData = [
    { time: '8am-12pm', school: 15, college: 12, working: 35 },
    { time: '12pm-4pm', school: 0, college: 42, working: 45 },
    { time: '4pm-8pm', school: 20, college: 25, working: 15 },
    { time: '8pm-12am', school: 12, college: 0, working: 42 }
  ];

  const hiringRatioData = [
    { name: 'Online', value: 45 },
    { name: 'Offline', value: 25 },
    { name: 'Mix', value: 30 }
  ];

  const COLORS = ['#36A2EB', '#FF6384', '#FFCE56'];

  const notifications = [
    {
      title: "Home Medical Assistance",
      action: "added a new job",
      recruiter: "RecruiterName",
      time: "a few moments ago"
    },
    {
      title: "Teacher Registration",
      action: "registered as a teacher",
      name: "TeacherName",
      time: "a few moments ago"
    },
    {
      title: "History and Civics Teacher",
      action: "applied for job role",
      name: "Sanjay Ghosh",
      time: "a few moments ago"
    }
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-700 text-white p-4 flex flex-col">
        <div className="mb-8">
          <h1 className="text-xl font-bold">Tuition Finder</h1>
        </div>
        <nav className="space-y-2 flex-1">
          {[
            { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', active: true, onClick: () => navigate('/admin') },
            { icon: <Users className="w-5 h-5" />, label: 'Teachers', onClick: () => navigate('/Admin_Teacher') },
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
      <div className="flex-1 flex flex-col h-screen overflow-auto">
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Dashboard</h2>
            <p className="text-gray-600">An Overview for the month</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-sm text-gray-600 mb-1">Total Teachers: 192</div>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-gray-600">Active Teachers</div>
                  <div className="text-2xl font-bold text-indigo-600">134</div>
                </div>
                <Users className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-sm text-gray-600 mb-1">Total Students: 2203</div>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-gray-600">Active Students</div>
                  <div className="text-2xl font-bold text-indigo-600">1898</div>
                </div>
                <Users className="h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-sm text-gray-600 mb-1">Active Job Posts: 23</div>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-gray-600">Job Applications</div>
                  <div className="text-2xl font-bold text-indigo-600">148</div>
                </div>
                <BriefcaseIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Teaching Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Teaching</h3>
              <select className="p-2 border rounded-md">
                <option>January, 2025</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Offline vs Online Classes</h3>
                <div className="flex justify-center">
                  <PieChart width={400} height={300}>
                    <Pie
                      data={classTypeData}
                      cx={200}
                      cy={150}
                      innerRadius={80}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {classTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                  </PieChart>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Busy Hours</h3>
                <BarChart width={500} height={300} data={busyHoursData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Bar dataKey="school" fill="#36A2EB" name="School Students" />
                  <Bar dataKey="college" fill="#FF6384" name="College Students" />
                  <Bar dataKey="working" fill="#FFCE56" name="Working Pro" />
                </BarChart>
              </div>
            </div>

            {/* Most Searched Subject Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h3 className="text-lg font-semibold mb-4">Most Searched Subject</h3>
              <BarChart width={1000} height={200} data={mostSearchedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </div>
          </div>

          {/* Jobs Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Jobs</h3>
              <select className="p-2 border rounded-md">
                <option>January, 2025</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Industry wise job postings</h3>
                <BarChart width={500} height={300} data={industryJobData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Bar dataKey="school" fill="#36A2EB" name="School Students" />
                  <Bar dataKey="college" fill="#FF6384" name="College Students" />
                  <Bar dataKey="working" fill="#FFCE56" name="Working Pro" />
                </BarChart>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Hiring Ratio</h3>
                <div className="flex justify-center">
                  <PieChart width={400} height={300}>
                    <Pie
                      data={hiringRatioData}
                      cx={200}
                      cy={150}
                      innerRadius={80}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {hiringRatioData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                  </PieChart>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-80 bg-white border-l h-screen overflow-auto">
        {/* Notifications */}
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold mb-4">Notifications</h3>
          <div className="space-y-4">
            {notifications.map((notification, index) => (
              <div key={index} className="flex items-start space-x-3 p-2 border-b last:border-b-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">{notification.recruiter || notification.name}</span>
                    {" "}{notification.action}{" "}
                    <span className="text-blue-600">{notification.title}</span>
                  </p>
                  <p className="text-xs text-gray-500">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Teacher Approvals */}
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Teacher Approvals</h3>
          <div className="space-y-4">
            {[
              {
                name: "Amit Kundu",
                education: "M Tech | University of Calcutta",
                subjects: "Physics, Mathematics",
              },
              {
                name: "Subham Malty",
                education: "B Tech | University of Kalyani",
                subjects: "Physics",
              },
              {
                name: "Sana Khan",
                education: "MSc | Delhi University",
                subjects: "Geography",
              }
            ].map((teacher, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-600 font-medium">{teacher.name[0]}</span>
                  </div>
                  <div>
                    <p className="font-medium">{teacher.name}</p>
                    <p className="text-sm text-gray-500">{teacher.education}</p>
                    <p className="text-sm text-gray-500">Subjects: {teacher.subjects}</p>
                  </div>
                </div>
                <div className="flex space-x-2 mt-2">
                  <button className="flex-1 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                    Approve
                  </button>
                  <button className="flex-1 py-1 border border-gray-300 rounded hover:bg-gray-50">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;