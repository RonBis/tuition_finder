import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { teacherService } from '../services/teacherService';

// Helper function to ensure userId is stored persistently
function ensureUserIdPersistence() {
  // Try to get from localStorage first
  let userId = localStorage.getItem('user_id');
  
  // If found in localStorage, use it
  if (userId) {
    return userId;
  }

  // Try to extract from user_data in localStorage
  const userData = localStorage.getItem('user_data');
  if (userData) {
    try {
      const parsedUserData = JSON.parse(userData);
      if (parsedUserData && parsedUserData.id) {
        userId = parsedUserData.id;
        
        // Save to localStorage for future use
        localStorage.setItem('user_id', userId);
        console.log('Saved user_id to localStorage from user_data:', userId);
        
        return userId;
      }
    } catch (e) {
      console.error('Error parsing user_data:', e);
    }
  }
  
  // Try session storage as fallback
  userId = sessionStorage.getItem('user_id');
  if (userId) {
    // Save to localStorage for persistence
    localStorage.setItem('user_id', userId);
    console.log('Saved user_id to localStorage from sessionStorage:', userId);
    
    return userId;
  }
  
  // Additional fallback - check for any auth token which might be related
  const authToken = localStorage.getItem('auth_token');
  if (authToken) {
    // If there's a JWT token, try to decode it to get user info
    try {
      // Extract payload from JWT (middle part between dots)
      const base64Url = authToken.split('.')[1];
      if (base64Url) {
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const payload = JSON.parse(jsonPayload);
        if (payload && payload.user_id) {
          userId = payload.user_id;
          
          // Save to localStorage
          localStorage.setItem('user_id', userId);
          console.log('Saved user_id to localStorage from auth token:', userId);
          
          return userId;
        }
      }
    } catch (e) {
      console.error('Error decoding auth token:', e);
    }
  }
  
  console.warn('Could not find user_id in any storage location');
  return null;
}

const PersonalDetailsForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    whatsappNumber: '',
    gender: '',
    dateOfBirth: '',
    address: '',
    latitude: '',
    longitude: '',
    aadharPhoto: null,
    profilePhoto: null
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [apiErrorDetails, setApiErrorDetails] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [useSameMobile, setUseSameMobile] = useState(false);

  // Function to get current location
  const fetchCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          setFormData(prev => ({
            ...prev,
            latitude: latitude.toFixed(6),
            longitude: longitude.toFixed(6)
          }));
          
          console.log(`Location obtained: ${latitude}, ${longitude}`);
          setIsGettingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setErrors(prev => ({
            ...prev,
            location: `Error getting location: ${error.message}`
          }));
          setIsGettingLocation(false);
        },
        { 
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setErrors(prev => ({
        ...prev,
        location: 'Geolocation is not supported by this browser'
      }));
      setIsGettingLocation(false);
    }
  };

  // Load saved data on component mount with improved user auth checking
  useEffect(() => {
    // Ensure user ID persistence immediately on component mount
    const userId = ensureUserIdPersistence();
    
    if (userId) {
      console.log('User ID confirmed in localStorage:', userId);
    } else {
      console.warn('No user ID could be found or extracted');
    }
    
    // Load saved form data if available
    const savedData = localStorage.getItem('personaldetails');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
    
    // More thorough authentication check
    const checkUserAuth = () => {
      const userId = localStorage.getItem('user_id');
      const authToken = localStorage.getItem('auth_token');
      
      console.log('Auth Check:', {
        userId: userId,
        hasAuthToken: !!authToken
      });
      
      if (!userId && !authToken) {
        console.warn('No user_id or auth_token found. User might not be logged in.');
        console.log('Redirecting to login page...');
        navigate('/');
      }
    };
    
    checkUserAuth();
    
    // Auto-fetch location when component mounts
    fetchCurrentLocation();
  }, [navigate]);

  // Handle checkbox change for alternate number
  const handleSameMobileCheckbox = (e) => {
    const isChecked = e.target.checked;
    setUseSameMobile(isChecked);
    
    if (isChecked) {
      setFormData(prev => ({
        ...prev,
        whatsappNumber: prev.mobileNumber
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        whatsappNumber: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.aadharPhoto) {
      newErrors.aadharPhoto = 'Aadhar card is required';
    }
    if (!formData.profilePhoto) {
      newErrors.profilePhoto = 'Profile photo is required';
    }
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.mobileNumber) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Invalid mobile number (10 digits required)';
    }

    if (formData.whatsappNumber && !/^\d{10}$/.test(formData.whatsappNumber)) {
      newErrors.whatsappNumber = 'Invalid whatsapp number (10 digits required)';
    }

    if (!formData.gender) {
      newErrors.gender = 'Please select a gender';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }

    if (!formData.address) {
      newErrors.address = 'Address is required';
    }

    // Latitude and longitude are optional, but if provided must be valid
    if (formData.latitude && !/^-?([0-8]?[0-9]|90)(\.[0-9]{1,8})?$/.test(formData.latitude)) {
      newErrors.latitude = 'Invalid latitude format (must be between -90 and 90)';
    }
    
    if (formData.longitude && !/^-?((1?[0-7]?|[0-9]?)[0-9]|180)(\.[0-9]{1,8})?$/.test(formData.longitude)) {
      newErrors.longitude = 'Invalid longitude format (must be between -180 and 180)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]  // Store the actual File object, not just the path
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // If mobile number changes and useSameMobile is checked, update whatsapp number too
      if (name === 'mobileNumber' && useSameMobile) {
        setFormData(prev => ({
          ...prev,
          whatsappNumber: value
        }));
      }
    }
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleNext = async () => {
    if (validateForm()) {
      // Ensure user ID is available
      const userId = ensureUserIdPersistence();
      
      if (!userId) {
        setApiError('User not logged in. Please log in to continue.');
        console.log('No user ID found. Redirecting to login page...');
        navigate('/'); 
        return;
      }
      
      // Save to localStorage for form persistence
      localStorage.setItem('personaldetails', JSON.stringify(formData));
      
      try {
        setIsSubmitting(true);
        setApiError(null);
        setApiErrorDetails(null);
        
        console.log('Submitting form with user_id:', userId);
        
        // Submit to API
        const response = await teacherService.createTeacher(formData);
        console.log('API response:', response);
        
        // If successful, store the teacher ID for future reference
        if (response.data && response.data.data && response.data.data.id) {
          localStorage.setItem('teacher_id', response.data.data.id);
          console.log('Saved teacher_id to localStorage:', response.data.data.id);
        } else if (response.data && response.data.id) {
          localStorage.setItem('teacher_id', response.data.id);
          console.log('Saved teacher_id to localStorage:', response.data.id);
        }
        
        // Navigate to next step
        navigate('/details2');
      } catch (error) {
        console.error('Error submitting form:', error);
        
        // Improved error handling to extract error_description
        let errorMessage = 'Failed to save your information. Please try again.';
        
        // Check for various error response formats
        if (error.response) {
          console.log('API Error Response:', error.response.data);
          
          // Check for error_description in various formats
          if (error.response.data?.error_description) {
            errorMessage = error.response.data.error_description;
          } else if (error.response.data?.message) {
            errorMessage = error.response.data.message;
          } else if (typeof error.response.data === 'string') {
            try {
              // Try to parse if it's a JSON string
              const parsedError = JSON.parse(error.response.data);
              errorMessage = parsedError.error_description || parsedError.message || errorMessage;
            } catch (e) {
              // If not JSON, use as is if it looks like an error message
              if (error.response.data.includes('error') || error.response.data.includes('fail')) {
                errorMessage = error.response.data;
              }
            }
          }
          
          // Store the detailed validation errors if available
          if (error.response.data?.errors) {
            setApiErrorDetails(error.response.data.errors);
          }
        }
        
        setApiError(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen w-screen bg-indigo-100 flex flex-col">
      {/* Header */}
      <header className="bg-[#4527a0] text-white p-4 flex items-center" style={{height: '201px' }}>
        <img 
          src="/assets/LOGO (2).png" 
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
      <div className="flex-grow flex justify-center items-center">
        <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-center mb-8">Personal Details</h1>
          
          {/* API Error Messages - Updated to display error_description clearly */}
          {apiError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{apiError}</span>
              
              {/* Error Details */}
              {apiErrorDetails && (
                <ul className="list-disc pl-5 mt-2">
                  {Object.entries(apiErrorDetails).map(([field, errors]) => (
                    <li key={field}>
                      <strong>{field}:</strong> {Array.isArray(errors) ? errors.join(', ') : errors}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          
          {/* Form Fields */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600">Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 
                    ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 
                    ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Mobile Number <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  placeholder="Enter mobile number"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 
                    ${errors.mobileNumber ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.mobileNumber && <p className="mt-1 text-sm text-red-500">{errors.mobileNumber}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Whatsapp Number </label>
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="sameMobileCheckbox"
                    checked={useSameMobile}
                    onChange={handleSameMobileCheckbox}
                    className="mr-2"
                  />
                  <label htmlFor="sameMobileCheckbox" className="text-sm text-gray-600">
                    Same as mobile number
                  </label>
                </div>
                <input
                  type="tel"
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleInputChange}
                  placeholder="Enter whatsapp number"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 
                    ${errors.whatsappNumber ? 'border-red-500' : 'border-gray-300'}`}
                  disabled={useSameMobile}
                />
                {errors.whatsappNumber && <p className="mt-1 text-sm text-red-500">{errors.whatsappNumber}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Gender <span className="text-red-500">*</span></label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 
                    ${errors.gender ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Choose</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                {errors.gender && <p className="mt-1 text-sm text-red-500">{errors.gender}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Date of Birth <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 
                    ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.dateOfBirth && <p className="mt-1 text-sm text-red-500">{errors.dateOfBirth}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Address <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter your address"
                className={`mt-1 block w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 
                  ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Aadhar Card <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type="file"
                  name="aadharPhoto"
                  onChange={handleInputChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  id="aadhar-input"
                />
                <label
                  htmlFor="aadhar-input" 
                  className={`mt-1 flex items-center w-full px-3 py-2 border rounded-md cursor-pointer
                    ${errors.aadharPhoto ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <span className="text-gray-500">
                    {formData.aadharPhoto ? formData.aadharPhoto.name : 'Click to upload Aadhar Card'}
                  </span>
                </label>
              </div>
              {errors.aadharPhoto && <p className="mt-1 text-sm text-red-500">{errors.aadharPhoto}</p>}
              <p className="mt-1 text-xs text-gray-500">* Upload scanned copy of your Aadhar Card</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Profile Photo <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type="file"
                  name="profilePhoto"
                  onChange={handleInputChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  id="profile-input"
                />
                <label
                  htmlFor="profile-input" 
                  className={`mt-1 flex items-center w-full px-3 py-2 border rounded-md cursor-pointer
                    ${errors.profilePhoto ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <span className="text-gray-500">
                    {formData.profilePhoto ? formData.profilePhoto.name : 'Click to upload Profile Photo'}
                  </span>
                </label>
              </div>
              {errors.profilePhoto && <p className="mt-1 text-sm text-red-500">{errors.profilePhoto}</p>}
              <p className="mt-1 text-xs text-gray-500">* Upload your Profile Photo</p>
            </div>
            {/* Location Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600">Latitude</label>
                <div className="flex">
                  <input
                    type="text"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    placeholder="Enter latitude"
                    className={`mt-1 block w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 
                      ${errors.latitude ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>
                {errors.latitude && <p className="mt-1 text-sm text-red-500">{errors.latitude}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Longitude</label>
                <div className="flex">
                  <input
                    type="text"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    placeholder="Enter longitude"
                    className={`mt-1 block w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 
                      ${errors.longitude ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>
                {errors.longitude && <p className="mt-1 text-sm text-red-500">{errors.longitude}</p>}
              </div>
            </div>
            
            {/* Location status message */}
            {isGettingLocation && (
              <div className="text-sm text-gray-600 flex items-center">
                <svg className="animate-spin mr-2 h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Getting your current location...
              </div>
            )}
            {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
            
            <div className="flex justify-between items-center mt-6">
              <button
                className="px-6 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                onClick={() => navigate('/role')}
                disabled={isSubmitting}
              >
                Back
              </button>
              <button
                className={`px-6 py-2 ${isSubmitting ? 'bg-indigo-400' : 'bg-indigo-600'} text-white rounded-md hover:bg-indigo-700`}
                onClick={handleNext}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetailsForm;