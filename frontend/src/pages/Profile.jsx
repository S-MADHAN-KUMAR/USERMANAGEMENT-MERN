import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RegisterFailure, RegisterStart, RegisterSuccess } from '../redux/user/userSlice';

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [previewImage, setPreviewImage] = useState(currentUser?.imageUrl || '');
  const [formData, setFormData] = useState({
    name: currentUser?.username || '',
    email: currentUser?.email || '',
    password: currentUser?.password || '',
    phone: currentUser?.phone || '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    image: '',
    server: ''
  });

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required !';
    } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      newErrors.name = 'Name must contain only letters !';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters !';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required !';
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = 'Invalid email format !';
    }

    // Password validation (only if password is entered)
    if (formData.password.trim()) {
      if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters !';
      }
    }

    // Phone validation
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required !';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits !';
    }

    // Image validation
    if (!previewImage) {
      newErrors.image = 'Profile image is required !';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => {
        console.error("Error converting file to Base64:", error);
        reject(error);
      };
    });
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      setErrors((prevErrors) => ({ ...prevErrors, image: 'Please select an image file' }));
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prevErrors) => ({ ...prevErrors, image: 'Please upload a valid image (JPG, PNG)' }));
      return;
    }

    try {
      const base64String = await convertToBase64(file);
      setPreviewImage(base64String);
      setErrors((prevErrors) => ({ ...prevErrors, image: '' })); // Clear any previous errors
    } catch (error) {
      console.error("Error during file conversion:", error);
      setErrors((prevErrors) => ({ ...prevErrors, image: 'Error converting file to Base64' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        dispatch(RegisterStart())
        const res = await fetch('http://localhost:3000/api/auth/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
          body: JSON.stringify({
            userId: currentUser._id,
            username: formData.name,
            email: formData.email,
            password:formData.password,
            phone: formData.phone,
            imageUrl: previewImage,
            isAdmin: currentUser.isAdmin,
            isBlocked: currentUser.isBlocked,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          console.log("Profile updated successfully", data);
          dispatch(RegisterSuccess(data));  // Ensure updated user data is dispatched to Redux
          navigate('/');
        } else {
          dispatch(RegisterFailure(data))
          setErrors((prevErrors) => ({
            ...prevErrors,
            server: data.message || 'Failed to update profile',
          }));
          console.error("Error updating profile:", data);
        }
      } catch (error) {
        dispatch(RegisterFailure(data))
        console.error("Error during profile update:", error);
        setErrors((prevErrors) => ({
          ...prevErrors,
          server: 'Server error. Please try again later.',
        }));
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="w-full lg:w-7/12 md:w-9/12 flex flex-col md:flex-row border container shadow-lg shadow-2xl overflow-hidden">
        <div className="w-full bgc md:w-1/2 flex flex-col items-center p-4">
          <div className={`my-8 w-40 h-40 overflow-hidden rounded-full ${errors.image ? 'border-2 border-red-500' : ''}`}>
            <img
              src={previewImage || currentUser.imageUrl || 'https://i.pinimg.com/originals/5e/53/12/5e5312ab982e6620087882ce7ff1ac23.gif'}
              className="h-full w-full object-cover"
              alt="Profile"
            />
          </div>
          <p className="text-white font-semibold mb-4">Upload Profile Image</p>
          <div className="relative w-fit mt-auto mb-10">
            <label
              htmlFor="file-upload"
              className="block w-full px-4 py-2 text-center cursor-pointer text-white bg-sky-600 rounded font-semibold"
            >
              Choose a file
            </label>
            <input
              id="file-upload"
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept=".jpg,.png,.jpeg"
              onChange={handleFileUpload}
            />
          </div>
          {errors.image && <p className="text-red-600 font-semibold text-xs">{errors.image}</p>}
        </div>

        <form noValidate onSubmit={handleSubmit} className="w-1/2 p-6 flex flex-col">
          <h1 className="text-sky-600 font-bold text-2xl md:text-3xl mb-6 md:mb-14">PROFILE</h1>
          <p className="text-red-600 font-bold text-base text-center mb-6">
            {errors.server || ""}
          </p>

          <input
            name="name"
            placeholder="Name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className={`bg-gray-100 p-2 w-full focus:outline-none shadow ${errors.name ? 'border-red-500 border-2 mb-2' : 'mb-10'}`}
          />
          {errors.name && <p className="text-red-600 font-semibold text-xs mb-6">{errors.name}</p>}

          <input
            name="email"
            placeholder="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={`bg-gray-100 p-2 w-full focus:outline-none shadow ${errors.email ? 'border-red-500 border-2 mb-2' : 'mb-10'}`}
          />
          {errors.email && <p className="text-red-600 font-semibold text-xs mb-6">{errors.email}</p>}

          <input
            name="password"
            placeholder="Password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className={`bg-gray-100 p-2 w-full focus:outline-none shadow ${errors.password ? 'border-red-500 border-2 mb-2' : 'mb-10'}`}
          />
          {errors.password && <p className="text-red-600 font-semibold text-xs mb-6">{errors.password}</p>}

          <input
            name="phone"
            placeholder="Phone Number"
            type="text"  
            value={formData.phone}
            onChange={handleChange}
            className={`bg-gray-100 p-2 w-full focus:outline-none shadow ${errors.phone ? 'border-red-500 border-2 mb-2' : 'mb-10'}`}
          />
          {errors.phone && <p className="text-red-600 font-semibold text-xs mb-6">{errors.phone}</p>}


          <button
            type="submit"
            className="bg-sky-600 text-white font-semibold py-2 px-4 rounded"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
