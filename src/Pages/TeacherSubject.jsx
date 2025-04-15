import { useState, useEffect } from 'react';
import { subjectService } from '../services/subjectService';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

export default function TuitionFinderForm() {
  const navigate = useNavigate(); // Initialize navigate function
  const [formData, setFormData] = useState({
    teachLocation: true,
    teachSchools: true,
    teachSpecialChild: true,
    trainedSpecialChild: true,
    experience: "2",
    radius: "10",
    selectedSubjects: [],
    teachOnline: true,
    teachOffline: false,
    teachingMedium: "Bengali" // Default value
  });
  
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  // Teaching medium options
  const teachingMediumOptions = [
    "English, Hindi & Bengali",
    "English",
    "Hindi",
    "Bengali",
    "English & Hindi",
    "English & Bengali",
    "Hindi & Bengali"
  ];

  useEffect(() => {
    // Fetch subjects when component mounts
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const response = await subjectService.getSubjects();
        
        // Check the structure of the response and extract the subjects array
        const subjectsData = Array.isArray(response.data) 
          ? response.data 
          : (response.data.subjects || response.data.data || []);
        
        if (!Array.isArray(subjectsData)) {
          console.error('Invalid subjects data format:', response.data);
          setError('Invalid subject data format received from the server.');
          setSubjects([]);
        } else {
          setSubjects(subjectsData);
          setError(null);
        }
      } catch (err) {
        setError('Failed to load subjects. Please try again later.');
        console.error('Error fetching subjects:', err);
        setSubjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRadioChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value === 'yes',
    });
  };

  const handleSubjectChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData({
      ...formData,
      selectedSubjects: selectedOptions
    });
  };

  // Helper function to convert UI medium selection to API format
  const getPreferredMedium = (medium) => {
    const mediums = [];
    
    if (medium.toLowerCase().includes("english")) {
      mediums.push("english");
    }
    
    if (medium.toLowerCase().includes("hindi")) {
      mediums.push("hindi");
    }
    
    if (medium.toLowerCase().includes("bengali")) {
      mediums.push("bengali");
    }
    
    // Return array of mediums 
    return mediums.length > 0 ? mediums : ["english"];
  };

  // Helper function to determine mode of teaching based on checkboxes
  const getModeOfTeaching = () => {
    if (formData.teachOnline && formData.teachOffline) {
      return "both";
    } else if (formData.teachOnline) {
      return "online";
    } else if (formData.teachOffline) {
      return "offline";
    }
    return "online"; // Default fallback
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    
    // Validate form data before submission
    if (formData.selectedSubjects.length === 0) {
      setSubmitError("Please select at least one subject");
      return;
    }
    
    if (!formData.teachOnline && !formData.teachOffline) {
      setSubmitError("Please select at least one teaching mode (online or offline)");
      return;
    }
    
    // Prepare the data for teacher_preferences API submission
    const teacherPreferenceRequest = {
      teacher_preference: {
        teacher_id: parseInt(localStorage.getItem('teacher_id')) || 1,
        teaching_radius_km: formData.radius,
        preferred_teaching_type: "individual", // This could be another form field
        prior_experience: parseInt(formData.experience) || 0,
        teaching_mode: getModeOfTeaching(),
        teaching_location_preference: formData.teachLocation,
        teaching_school: formData.teachSchools,
        special_need_children: formData.trainedSpecialChild,
        special_attention_children: formData.teachSpecialChild,
        subject_ids: formData.selectedSubjects.map(id => parseInt(id)),
        preferred_medium: getPreferredMedium(formData.teachingMedium)
      }
    };
    
    try {
      console.log("Submitting request:", JSON.stringify(teacherPreferenceRequest, null, 2));
      
      // Submit the form data to the new endpoint
      const response = await fetch('http://localhost:3001/api/v1/teacher_preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(teacherPreferenceRequest)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Server error response:', errorData);
        throw new Error(`Failed to submit request: ${response.status} ${response.statusText}`);
      }
      
      // Handle successful submission
      alert('Your teacher preferences have been submitted successfully!');
      
      // Navigate to /slots after successful submission
      navigate('/slots');
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError(error.message || 'There was an error submitting your request. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-indigo-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="w-full bg-indigo-800 py-6 px-6 relative">
        <div className="flex items-center">
          <div className="text-white flex items-center">
            <svg className="w-8 h-8 mr-2" viewBox="0 0 24 24" fill="white">
              <path d="M21,5c-1.11-0.35-2.33-0.5-3.5-0.5c-1.95,0-4.05,0.4-5.5,1.5c-1.45-1.1-3.55-1.5-5.5-1.5S2.45,4.9,1,6v14.65 c0,0.25,0.25,0.5,0.5,0.5c0.1,0,0.15-0.05,0.25-0.05C3.1,20.45,5.05,20,6.5,20c1.95,0,4.05,0.4,5.5,1.5c1.35-0.85,3.8-1.5,5.5-1.5 c1.65,0,3.35,0.3,4.75,1.05c0.1,0.05,0.15,0.05,0.25,0.05c0.25,0,0.5-0.25,0.5-0.5V6C22.4,5.55,21.75,5.25,21,5z M21,18.5 c-1.1-0.35-2.3-0.5-3.5-0.5c-1.7,0-4.15,0.65-5.5,1.5V8c1.35-0.85,3.8-1.5,5.5-1.5c1.2,0,2.4,0.15,3.5,0.5V18.5z" />
            </svg>
            <span className="text-2xl font-bold">Teacher Preferences</span>
          </div>
        </div>
        {/* Background decoration */}
        <div className="absolute right-6 top-0 h-full opacity-20">
          <svg className="h-full" viewBox="0 0 100 100" fill="white">
            <path d="M50,5 C70,15 95,25 95,50 C95,75 70,85 50,95 C30,85 5,75 5,50 C5,25 30,15 50,5 Z" />
          </svg>
        </div>
      </div>

      {/* Form Card - Centered and takes up most of the screen */}
      <div className="flex-1 flex justify-center items-start overflow-auto py-4">
        <div className="w-full max-w-5xl mx-6 -mt-6 rounded-lg bg-white shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-8">Teaching Preferences</h2>

          {/* Show submission error if any */}
          {submitError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{submitError}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left column */}
              <div className="space-y-6">
                {/* Subject Selection */}
                <div>
                  <label className="text-sm text-gray-600 block mb-2">Select subjects you teach</label>
                  <div className="relative">
                    {loading ? (
                      <div className="w-full border border-gray-300 rounded p-2 text-gray-500">
                        Loading subjects...
                      </div>
                    ) : error ? (
                      <div className="w-full border border-red-300 rounded p-2 text-red-500">
                        {error}
                      </div>
                    ) : (
                      <select 
                        multiple
                        className="w-full border border-gray-300 rounded p-2 text-gray-800"
                        value={formData.selectedSubjects}
                        onChange={handleSubjectChange}
                        size={Math.min(5, subjects.length || 0)}
                      >
                        {!subjects || subjects.length === 0 ? (
                          <option disabled>No subjects available</option>
                        ) : (
                          subjects.map((subject, index) => (
                            <option key={subject.id || index} value={subject.id || index}>
                              {subject.name || subject.title || `Subject ${index + 1}`}
                            </option>
                          ))
                        )}
                      </select>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Hold Ctrl (or Cmd) to select multiple subjects
                    </p>
                  </div>
                </div>

                {/* Teaching Location */}
                <div className="mt-6">
                  <p className="text-sm text-gray-600 mb-2">I am comfortable teaching at students' preferred location</p>
                  <div className="flex space-x-6">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        className="form-radio h-5 w-5 text-indigo-600"
                        name="teachLocation"
                        checked={formData.teachLocation}
                        onChange={() => handleRadioChange('teachLocation', 'yes')}
                      />
                      <span className="ml-2 text-gray-800">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        className="form-radio h-5 w-5 text-indigo-600"
                        name="teachLocation"
                        checked={!formData.teachLocation}
                        onChange={() => handleRadioChange('teachLocation', 'no')}
                      />
                      <span className="ml-2 text-gray-800">No</span>
                    </label>
                  </div>
                </div>

                {/* Teaching Experience */}
                <div className="mt-6">
                  <label className="text-sm text-gray-600 block mb-2">Prior teaching experience in years</label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    min="0"
                    className="w-full border border-gray-300 rounded p-2 text-gray-800"
                  />
                </div>

                {/* Teaching Medium - Updated with proper dropdown */}
                <div className="mt-6">
                  <label className="text-sm text-gray-600 block mb-2">Medium of Teaching</label>
                  <div className="relative">
                    <select 
                      name="teachingMedium"
                      value={formData.teachingMedium}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded p-2 pr-8 appearance-none text-gray-800"
                    >
                      {teachingMediumOptions.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Special Needs Teaching */}
                <div className="mt-6">
                  <p className="text-sm text-gray-600 mb-2">I am okay to teach a child who needs special attention</p>
                  <div className="flex space-x-6">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        className="form-radio h-5 w-5 text-indigo-600"
                        name="teachSpecialChild"
                        checked={formData.teachSpecialChild}
                        onChange={() => handleRadioChange('teachSpecialChild', 'yes')}
                      />
                      <span className="ml-2 text-gray-800">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        className="form-radio h-5 w-5 text-indigo-600"
                        name="teachSpecialChild"
                        checked={!formData.teachSpecialChild}
                        onChange={() => handleRadioChange('teachSpecialChild', 'no')}
                      />
                      <span className="ml-2 text-gray-800">No</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-6">
                {/* Teaching Mode - Updated to separate checkboxes */}
                <div>
                  <label className="text-sm text-gray-600 block mb-2">Teaching mode preference</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-indigo-600"
                        checked={formData.teachOnline}
                        onChange={() => setFormData({...formData, teachOnline: !formData.teachOnline})}
                      />
                      <span className="ml-2 text-gray-800">Online</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-indigo-600"
                        checked={formData.teachOffline}
                        onChange={() => setFormData({...formData, teachOffline: !formData.teachOffline})}
                      />
                      <span className="ml-2 text-gray-800">Offline</span>
                    </label>
                  </div>
                </div>

                {/* Teaching Radius */}
                <div className="mt-6">
                  <label className="text-sm text-gray-600 block mb-2">I teach within radius (in KMs)</label>
                  <input
                    type="number"
                    name="radius"
                    value={formData.radius}
                    onChange={handleChange}
                    min="1"
                    className="w-full border border-gray-300 rounded p-2 text-gray-800"
                  />
                </div>

                {/* School Teaching */}
                <div className="mt-6">
                  <p className="text-sm text-gray-600 mb-2">I am interested in teaching at schools given an opportunity</p>
                  <div className="flex space-x-6">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        className="form-radio h-5 w-5 text-indigo-600"
                        name="teachSchools"
                        checked={formData.teachSchools}
                        onChange={() => handleRadioChange('teachSchools', 'yes')}
                      />
                      <span className="ml-2 text-gray-800">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        className="form-radio h-5 w-5 text-indigo-600"
                        name="teachSchools"
                        checked={!formData.teachSchools}
                        onChange={() => handleRadioChange('teachSchools', 'no')}
                      />
                      <span className="ml-2 text-gray-800">No</span>
                    </label>
                  </div>
                </div>

                {/* Document Upload */}
                <div className="mt-6 flex items-center justify-between">
                  <p className="text-sm text-gray-600">Attach a document showing your experience</p>
                  <button type="button" className="bg-indigo-800 text-white px-4 py-2 rounded-md flex items-center">
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                    </svg>
                    Attach Document
                  </button>
                </div>

                {/* Special Training */}
                <div className="mt-6">
                  <p className="text-sm text-gray-600 mb-2">I am trained to teach specially-abled children</p>
                  <div className="flex space-x-6">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        className="form-radio h-5 w-5 text-indigo-600"
                        name="trainedSpecialChild"
                        checked={formData.trainedSpecialChild}
                        onChange={() => handleRadioChange('trainedSpecialChild', 'yes')}
                      />
                      <span className="ml-2 text-gray-800">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        className="form-radio h-5 w-5 text-indigo-600"
                        name="trainedSpecialChild"
                        checked={!formData.trainedSpecialChild}
                        onChange={() => handleRadioChange('trainedSpecialChild', 'no')}
                      />
                      <span className="ml-2 text-gray-800">No</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Navigation */}
            <div className="flex justify-center pt-4 space-x-4 mt-8">
              <button type="button" className="border border-indigo-800 text-indigo-800 px-8 py-2 rounded-full flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <button type="submit" className="bg-indigo-800 text-white px-8 py-2 rounded-full flex items-center">
                Submit
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}