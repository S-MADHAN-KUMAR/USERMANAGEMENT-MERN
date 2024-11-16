import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterFailure, RegisterStart, RegisterSuccess } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';

const Register = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

const {loading ,error}= useSelector((state)=>state.user)


  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone :''
  });

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone:''
  });


  const validateForm = () => {
    const newErrors = {};

    // Name validation: only letters allowed
    if (!formData.username.trim()) {
      newErrors.username = 'Name is required !';
    } else if (!/^[A-Za-z\s]+$/.test(formData.username)) {
      newErrors.username = 'Name must contain only letters !';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Name must be at least 3 characters !';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required !';
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = 'Invalid email format !';
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required !';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters !';
    }

    // Confirm password validation
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirm Password is required !';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match !';
    }

      // Phone validation
      if (!formData.phone) {
        newErrors.phone = 'Phone number is required !';
      } else if (!/^\d{10}$/.test(formData.phone)) {
        newErrors.phone = 'Phone number must be 10 digits !';
      }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const trimmedFormData = {
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password.trim(),
          phone: formData.phone.trim(),  // Corrected here
          isAdmin: false,
          isBlocked: false,
        };
  
        dispatch(RegisterStart());
  
        // Perform the POST request
        const res = await fetch('http://localhost:3000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(trimmedFormData),
        });
  
        const data = await res.json();
  
        // Handle possible errors from the server
        if (res.status === 400) {
          if (data.message.includes('duplicate key error')) {
            dispatch(RegisterFailure({ message: 'User already exists!' }));
          } else {
            dispatch(RegisterFailure(data));
          }
        } else if (res.status === 500) {
          dispatch(RegisterFailure({ message: 'Server error occurred!' }));
        } else {
          // Successfully registered
          dispatch(RegisterSuccess(data));
          navigate('/');
        }
      } catch (err) {
        // Handle network or other unexpected errors
        dispatch(RegisterFailure({ message: err.message || 'An error occurred' }));
      }
    } else {
      console.log('Form validation failed');
    }
  };
  
  

  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="lg:w-7/12 container md:w-9/12 w-full flex flex-row border shadow shadow-2xl overflow-hidden">

{
  loading ?
  <img src="https://i.pinimg.com/originals/ce/ca/e6/cecae62ec79ddc1d9d95c3131510f3e6.gif" />
  :
  <>
   {/* Left image section */}
   <div className="w-full md:w-1/2 flex flex-col justify-center items-center bgc p-4">
          <img
            src="https://i.pinimg.com/originals/1c/b3/2e/1cb32e5eca87add3785208e57a3e0e3e.gif"
            alt="profile"
            className="w-32 md:w-80 mt-auto"
          />

          <p className="text-sm text-center m-auto mb-3 text-white font-semibold">
            Already a user?{' '}
            <span
              onClick={() => navigate('/login')}
              className="cursor-pointer text-sky-800 font-bold"
            >
              Login
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-1/2 p-6 flex flex-col">
        <h1 className='text-sky-600 font-bold text-2xl md:text-3xl mb-6 md:mb-14'>REGISTER</h1>
              <p className="text-red-600 font-bold text-base text-center mb-6">
              {error ? error.message || 'Somthing Went Wrong' : ""}  
              </p>
          <input
            name="username"
            placeholder="Name"
            type="text"
            value={formData.username}
            onChange={handleChange}
            className={`bg-gray-100 p-2 w-full focus:outline-none shadow ${
              errors.username ? 'border-red-500 border-2 mb-2' : 'mb-10'
            }`}
          />
          {errors.username && (
            <p className="text-red-600 font-semibold text-xs mb-6">
              {errors.username}
            </p>
          )}

          <input
            name="email"
            placeholder="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={`bg-gray-100 p-2 w-full focus:outline-none shadow ${
              errors.email ? 'border-red-500 border-2 mb-2' : 'mb-10'
            }`}
          />
          {errors.email && (
            <p className="text-red-600 font-semibold text-xs mb-6">
              {errors.email}
            </p>
          )}

<input
  name="phone"
  placeholder="Phone Number"
  type="tel"  // Change type to 'tel' for phone numbers
  value={formData.phone}
  onChange={handleChange}
  className={`bg-gray-100 p-2 w-full focus:outline-none shadow ${
    errors.phone ? 'border-red-500 border-2 mb-2' : 'mb-10'
  }`}
/>

          {errors.phone && (
            <p className="text-red-600 font-semibold text-xs mb-6">
              {errors.phone}
            </p>
          )}

          <input
            name="password"
            placeholder="Password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className={`bg-gray-100 p-2 w-full focus:outline-none shadow ${
              errors.password ? 'border-red-500 border-2 mb-2' : 'mb-10'
            }`}
          />
          {errors.password && (
            <p className="text-red-600 font-semibold text-xs mb-6">
              {errors.password}
            </p>
          )}

          <input
            name="confirmPassword"
            placeholder="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`bg-gray-100 p-2 w-full focus:outline-none shadow ${
              errors.confirmPassword ? 'border-red-500 border-2 mb-2' : ''
            }`}
          />
          {errors.confirmPassword && (
            <p className="text-red-600 font-semibold text-xs">
              {errors.confirmPassword}
            </p>
          )}

          

          <button
            className="bg-sky-600 mt-auto px-8 py-2 text-lg rounded-full text-white font-semibold"
            type="submit"
          >
            Register
          </button>
        </form>
  </>
}

     
       

      </div>
    </div>
  );
};

export default Register;
