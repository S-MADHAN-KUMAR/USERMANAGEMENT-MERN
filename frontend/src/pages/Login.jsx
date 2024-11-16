import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LoginStart, LoginSuccess , LoginFailure } from '../redux/user/userSlice.js';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

const {loading ,error}= useSelector((state)=>state.user)

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required!';
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = 'Invalid email format!';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required!';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters!';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        dispatch(LoginStart())
        const res = await fetch('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        const data = await res.json();
        if (data.success === false) {
         dispatch(LoginFailure(data))
        } else {
          dispatch(LoginSuccess(data))
          navigate('/');
        }
      } catch (err) {
        dispatch(LoginFailure(err));
      }
    } else {
      console.log('Form validation failed');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className='flex justify-center items-center min-h-screen p-4'>
      <div className='w-full lg:w-7/12 md:w-10/12 flex flex-col md:flex-row border container shadow shadow-2xl overflow-hidden'>
        {loading ? (
          <img src="https://i.pinimg.com/originals/ce/ca/e6/cecae62ec79ddc1d9d95c3131510f3e6.gif" />
        ) : (
          <>
            <div className='w-full md:w-1/2 flex flex-col justify-center items-center bgc p-4'>
              <img
                src="https://i.pinimg.com/originals/1c/b3/2e/1cb32e5eca87add3785208e57a3e0e3e.gif"
                className='w-48 md:w-80 mt-auto'
              />
              <p className='text-sm text-center m-auto mb-3 text-white font-semibold'>
                New to this?{" "}
                <span
                  onClick={() => navigate('/register')}
                  className='cursor-pointer text-sky-800 font-bold'
                >
                  Register
                </span>
              </p>
            </div>

            <form  onSubmit={handleSubmit} className='w-full md:w-1/2 p-4 md:p-6 flex flex-col flex-1 justify-between'>
              <h1 className='text-sky-600 font-bold text-2xl md:text-3xl mb-6 md:mb-14'>LOGIN</h1>
              <p className="text-red-600 font-bold text-base text-center mb-6">
              {error ? error.message || 'Somthing Went Wrong' : ""}  
              </p>
             
              
              <input
                placeholder='Email'
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`bg-gray-100 p-2 w-full focus:outline-none shadow ${errors.email ? 'border-red-500 border-2 mb-2 ' : 'mb-10'}`}
              />
              {errors.email && <p className="text-red-600 font-semibold text-xs mb-6">{errors.email}</p>}
              
              <input
                placeholder='Password'
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`bg-gray-100 p-2 w-full focus:outline-none shadow ${errors.password ? 'border-red-500 border-2 mb-2' : ''}`}
              />
              {errors.password && <p className="text-red-600 font-semibold text-xs mb-6">{errors.password}</p>}
              
              <button
                className="bg-sky-600 mt-auto px-8 py-2 text-lg rounded-full text-white font-semibold"
                type="submit"
              >
                Login
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
