import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const TuitionFinder = () => {
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false
  });

  // Add refs for input fields
  const inputRefs = {
    emailOrPhone: useRef(),
    password: useRef(),
    confirmPassword: useRef()
  };
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.emailOrPhone) {
      newErrors.emailOrPhone = 'This field is required';
    } else if (formData.emailOrPhone.includes('@')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.emailOrPhone)) {
        newErrors.emailOrPhone = 'Invalid email format';
      }
    } else {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(formData.emailOrPhone)) {
        newErrors.emailOrPhone = 'Invalid phone number (10 digits required)';
      }
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', formData);
      navigate('/role'); // Redirect to /details
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

  const PasswordToggle = ({ field }) => (
    <button
      type="button"
      onClick={() => setShowPassword(prev => ({ ...prev, [field]: !prev[field] }))}
      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100"
      onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
    >
      {showPassword[field] ? (
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
          type={type === 'password' ? (showPassword[name] ? 'text' : 'password') : type}
          name={name}
          placeholder={placeholder}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 
            ${error ? 'border-red-500 focus:ring-red-200' : 'focus:ring-indigo-200 focus:border-indigo-500'}
            pr-20`}
          value={value}
          onChange={handleInputChange}
          autoComplete="off"
        />
        <CrossIcon 
          onClick={(e) => handleClear(e, name)}
          visible={value.length > 0}
        />
        {type === 'password' && <PasswordToggle field={name} />}
      </div>
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );

  return (
    <div 
  className="w-screen h-screen overflow-hidden"
  style={{
    backgroundImage: "url('src/Pages/bg.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  <div className="absolute top-6 left-6 flex items-center text-white">
    <svg className="w-8 h-8 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
    <span className="text-xl font-bold">Tuition Finder</span>
  </div>

  <div className="w-full h-full flex items-center justify-center p-6">
    <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center">
      {/* Left side */}
      <div className="w-full lg:w-1/2 text-white px-6 lg:pr-12 mb-10 lg:mb-0">
        <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-snug">
          Helping students achieve the education they deserve
        </h1>
      </div>

      {/* Right side */}
      <div className="w-full lg:w-1/2 px-6 lg:pl-12">
        <div className="bg-white rounded-lg p-8 shadow-lg w-full max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-2">Welcome to Tuition Finder</h2>
          <p className="text-gray-600 mb-6">Start creating your new account</p>
          
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
              placeholder="Create new password"
              value={formData.password}
              error={errors.password}
            />

            <InputField
              type="password"
              name="confirmPassword"
              placeholder="Re-enter Password"
              value={formData.confirmPassword}
              error={errors.confirmPassword}
            />

            <button
              type="submit"
              className="w-full bg-indigo-800 text-white py-3 rounded-md hover:bg-indigo-700 
                transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 
                focus:ring-offset-2"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>
  );
};

export default TuitionFinder;
