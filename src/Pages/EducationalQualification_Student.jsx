import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PersonalDetailsForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    schoolName: '',
    collegeName: '',
    universityName: '',
    EducationalQualification: ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.EducationalQualification) {
      newErrors.EducationalQualification = 'Please select your educational qualification';
    }
    
    if (!formData.schoolName) {
      newErrors.schoolName = 'School name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleNext = () => {
    if (validateForm()) {
      navigate('/subject');
    }
  };

  return (
    <div className="min-h-screen w-screen bg-indigo-100 flex flex-col overflow-x-hidden">
      {/* Header */}
      <header className="bg-[#4527a0] text-white p-4 flex items-center" style={{height: '201px' }}>
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

      {/* Form */}
      <div className="flex-grow flex justify-center items-center p-4 w-full">
        <div className="w-full max-w-4xl bg-white p-4 md:p-8 rounded-lg shadow-md mx-4">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">Educational Details</h1>

          {/* Form Fields */}
          <div className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-600 mb-1">Choose your Educational Qualification <span className="text-red-500">*</span></label>
                <select
                  name="EducationalQualification"
                  value={formData.EducationalQualification}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 text-base md:text-sm border rounded-md focus:ring-indigo-500 focus:border-indigo-500 
                    ${errors.EducationalQualification ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Choose</option>
                  <option value="No formal education">No formal education</option>
                  <option value="Primary education">Primary education</option>
                  <option value="Secondary education or high school">Secondary education or high school</option>
                  <option value="GED">GED</option>
                  <option value="Vocational qualification">Vocational qualification</option>
                  <option value="Bachelor's degree">Bachelor's degree</option>
                  <option value="Master's degree">Master's degree</option>
                  <option value="Doctorate or higher">Doctorate or higher</option>
                </select>
                {errors.EducationalQualification && <p className="mt-1 text-sm text-red-500">{errors.EducationalQualification}</p>}
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-600 mb-1">School Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleInputChange}
                  placeholder="Enter School Name"
                  className={`mt-1 block w-full px-3 py-2 text-base md:text-sm border rounded-md focus:ring-indigo-500 focus:border-indigo-500 
                    ${errors.schoolName ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.schoolName && <p className="mt-1 text-sm text-red-500">{errors.schoolName}</p>}
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-600 mb-1">College Name </label>
                <input
                  type="text"
                  name="collegeName"
                  value={formData.collegeName}
                  onChange={handleInputChange}
                  placeholder="Enter College Name"
                  className={`mt-1 block w-full px-3 py-2 text-base md:text-sm border rounded-md focus:ring-indigo-500 focus:border-indigo-500 
                    ${errors.collegeName ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.collegeName && <p className="mt-1 text-sm text-red-500">{errors.collegeName}</p>}
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-600 mb-1">University Name</label>
                <input
                  type="text"
                  name="universityName"
                  value={formData.universityName}
                  onChange={handleInputChange}
                  placeholder="Enter University Name"
                  className={`mt-1 block w-full px-3 py-2 text-base md:text-sm border rounded-md focus:ring-indigo-500 focus:border-indigo-500 
                    ${errors.universityName ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.universityName && <p className="mt-1 text-sm text-red-500">{errors.universityName}</p>}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
              <button
                className="w-full sm:w-auto px-6 py-2 bg-gray-200 rounded-md hover:bg-gray-300 text-base md:text-sm"
                onClick={() => navigate('/studentdetails1')}
              >
                Back
              </button>
              <button
                className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-base md:text-sm"
                onClick={handleNext}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetailsForm;
