import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api'; // Import the auth service

const TuitionFinder = () => {
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Add refs for input fields
  const inputRefs = {
    emailOrPhone: useRef(),
    password: useRef()
  };
  const navigate = useNavigate();

  // Effect to handle navigation after successful login and user ID is available
  useEffect(() => {
    if (loginSuccess) {
      const checkForUserId = async () => {
        try {
          await authService.waitForUserId(5000); // Wait up to 5 seconds for user ID
          navigate('/details');
        } catch (error) {
          console.error('Failed to get user ID:', error);
          setErrors({
            apiError: 'Login successful but failed to get user information. Please try again.'
          });
          setIsLoading(false);
          setLoginSuccess(false);
        }
      };
      
      checkForUserId();
    }
  }, [loginSuccess, navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.emailOrPhone) {
      newErrors.emailOrPhone = 'This field is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
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

  const handleClear = (e, field) => {
    e.preventDefault();
    e.stopPropagation();
    setFormData(prev => ({ ...prev, [field]: '' }));
    setErrors(prev => ({ ...prev, [field]: '' }));
    // Refocus the input after clearing
    const input = e.target.closest('.relative').querySelector('input');
    if (input) {
      input.focus();
    }
  };

  // Helper function to recursively search for user ID in nested objects
  const findUserIdInObject = (obj, maxDepth = 3, currentDepth = 0) => {
    // Prevent too deep recursion
    if (!obj || typeof obj !== 'object' || currentDepth > maxDepth) {
      return null;
    }
    
    // Direct check for id
    if (obj.id && typeof obj.id === 'number') {
      return obj.id;
    }
    
    // Check for nested id in typical locations
    if (obj.profile && obj.profile.id) {
      return obj.profile.id;
    }
    
    // Search in nested objects
    for (const key in obj) {
      // Skip certain keys that are unlikely to contain user data
      if (['token_type', 'expires_in', 'created_at', 'updated_at'].includes(key)) {
        continue;
      }
      
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        // If the key is 'user' or contains 'user', prioritize this path
        if (key === 'user' || key.includes('user') || key === 'profile') {
          if (obj[key].id) {
            return obj[key].id;
          }
        }
        
        // Recursive search
        const result = findUserIdInObject(obj[key], maxDepth, currentDepth + 1);
        if (result) {
          return result;
        }
      }
    }
    
    return null;
  };

  // Enhanced handleLogin function with more robust error handling
  const handleLogin = async (credentials) => {
    try {
      const response = await authService.signIn(credentials);
      
      // Make sure to save the auth token
      if (response.data && response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
      } else if (response.data && response.data.refresh_token) {
        // Some APIs return refresh_token instead of token
        localStorage.setItem('auth_token', response.data.refresh_token);
      } else {
        throw new Error('No auth token received');
      }
      
      // Search for user ID in multiple possible locations based on the API response structure
      let userId = null;
      
      // Check for direct id in response
      if (response.data && response.data.id) {
        userId = response.data.id;
        console.log('Found direct user_id in response:', userId);
      }
      // Check for id in user object
      else if (response.data && response.data.user && response.data.user.id) {
        userId = response.data.user.id;
        console.log('Found user_id in user object:', userId);
      }
      // Check for specific user_id field
      else if (response.data && response.data.user_id) {
        userId = response.data.user_id;
        console.log('Found specific user_id field:', userId);
      }
      // Check in profile object (as seen in your console log)
      else if (response.data && response.data.profile && response.data.profile.id) {
        userId = response.data.profile.id;
        console.log('Found user_id in profile:', userId);
      }
      // Deep search for id field (recursive function)
      else {
        userId = findUserIdInObject(response.data);
        if (userId) {
          console.log('Found user_id through deep search:', userId);
        }
      }
      
      if (userId) {
        localStorage.setItem('user_id', userId);
        setLoginSuccess(true);
        return true;
      } else {
        console.error('Could not find user ID in response:', response.data);
        throw new Error('User ID not found in response');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setIsLoading(true);
        
        // Create credentials object based on input type
        const credentials = formData.emailOrPhone.includes('@') 
          ? { email: formData.emailOrPhone, password: formData.password }
          : { phone: formData.emailOrPhone, password: formData.password };
        
        // Use the enhanced handleLogin function
        await handleLogin(credentials);
      } catch (error) {
        console.error('Login error:', error);
        
        // Handle API errors
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          if (error.response.data && error.response.data.message) {
            setErrors({
              apiError: error.response.data.message
            });
          } else {
            setErrors({
              apiError: 'Authentication failed. Please check your credentials.'
            });
          }
        } else if (error.request) {
          // The request was made but no response was received
          setErrors({
            apiError: 'No response from server. Please try again later.'
          });
        } else {
          // Something happened in setting up the request
          setErrors({
            apiError: error.message || 'An error occurred. Please try again.'
          });
        }
        setIsLoading(false);
      }
    }
  };

  const CrossIcon = ({ onClick, visible }) => (
    <button
      type="button"
      onClick={onClick}
      className={`absolute right-10 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 
        ${visible ? 'opacity-100' : 'opacity-0'} transition-opacity`}
      onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
    >
      <svg 
        className="w-4 h-4 text-gray-500" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    </button>
  );

  const PasswordToggle = () => (
    <button
      type="button"
      onClick={() => setShowPassword(prev => !prev)}
      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100"
      onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
    >
      {showPassword ? (
        <svg 
          className="w-4 h-4 text-gray-500" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      ) : (
        <svg 
          className="w-4 h-4 text-gray-500" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )}
    </button>
  );

  const InputField = ({ type, placeholder, value, name, error }) => (
    <div className="space-y-1">
      <div className="relative">
        <input
          ref={inputRefs[name]}
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          name={name}
          placeholder={placeholder}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 
            ${error ? 'border-red-500 focus:ring-red-200' : 'focus:ring-indigo-200 focus:border-indigo-500'}
            pr-20`}
          value={value}
          onChange={handleInputChange}
          autoComplete={type === 'password' ? 'current-password' : 'username'}
        />
        <CrossIcon 
          onClick={(e) => handleClear(e, name)}
          visible={value.length > 0}
        />
        {type === 'password' && <PasswordToggle />}
      </div>
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );

  return (
    <div 
      className="h-screen w-screen overflow-hidden"
      style={{
        backgroundImage: "url('src/Pages/bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="fixed top-4 sm:top-6 left-4 sm:left-6 flex items-center text-white z-10">
        <svg className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <span className="text-lg sm:text-xl font-bold">Tuition Finder</span>
      </div>

      <div className="h-screen w-full flex items-center justify-center">
        <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-12 px-4 sm:px-6">
          {/* Left side */}
          <div className="w-full lg:w-1/2 text-white text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight sm:leading-snug">
              Helping students achieve the education they deserve
            </h1>
          </div>

          {/* Right side */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white rounded-lg p-6 sm:p-8 shadow-lg w-full max-w-md mx-auto">
              <h2 className="text-xl sm:text-2xl font-bold mb-2">Welcome to Tuition Finder</h2>
              <p className="text-gray-600 mb-6">Log in to your account</p>
              
              {errors.apiError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                  {errors.apiError}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <InputField
                  type="text"
                  name="emailOrPhone"
                  placeholder="Enter Mobile No. or Email Id"
                  value={formData.emailOrPhone}
                  error={errors.emailOrPhone}
                />

                <InputField
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  error={errors.password}
                />

                <div className="flex justify-end">
                  <a href="/forgot-password" className="text-indigo-600 hover:text-indigo-800 text-sm">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  className={`w-full bg-indigo-800 text-white py-3 rounded-md ${
                    isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:bg-indigo-700'
                  } transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 
                  focus:ring-offset-2 text-sm sm:text-base flex items-center justify-center`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {loginSuccess ? 'Preparing your dashboard...' : 'Processing...'}
                    </>
                  ) : (
                    'Log in'
                  )}
                </button>

                <div className="text-center mt-4">
                  <p className="text-gray-600">
                    Don't have an account? <a href="/signup" className="text-indigo-600 hover:text-indigo-800">Sign up</a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TuitionFinder;