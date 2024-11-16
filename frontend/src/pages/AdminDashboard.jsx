import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editMode, setEditMode] = useState(false);
  const [createMode, setCreateMode] = useState(false);
  const [currentEditingUserId, setCurrentEditingUserId] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [searchInput, setSearchInput] = useState("");

  const [filteredData, setFilteredData] = useState([]);

  const navigate = useNavigate()

  //add users
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: ''
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/admin/getUsers', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }

        const result = await res.json();
        setData(result);
        setFilteredData(result);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (currentUser && currentUser.isAdmin) {
      fetchUserData();
    }

  
  }, [currentUser]);


  useEffect(() => {
    // Filter the data based on the search input by username or email
    const filtered = data.filter(user =>
      user.username.toLowerCase().includes(searchInput.toLowerCase()) ||
      user.email.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchInput, data]);



  const handleEdit = (user) => {
    setEditMode(true);
    setCurrentEditingUserId(user._id);
    setUsername(user.username);
    setEmail(user.email);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/admin/editUser/${currentEditingUserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to save user');
      }

      const updatedUser = await res.json();
      setData((prevData) =>
        prevData.map((user) =>
          user._id === updatedUser._id ? { ...user, username: updatedUser.username, email: updatedUser.email } : user
        )
      );

      setEditMode(false);
      setCurrentEditingUserId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (userId) => {
    alert("Are you want to delte")
    try {
      const res = await fetch(`http://localhost:3000/api/admin/deleteUser/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Failed to delete user');
      }

      setData((prevData) => prevData.filter((user) => user._id !== userId));
    } catch (err) {
      setError(err.message);
    }

  };



  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreateMode(true);
    const trimmedDatas = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzCb4DonWw5pT1-A3Su9HzG6TTN4nMOmj7tg&s"
    };
    if (validateForm()) {
      try {
        const res = await fetch(`http://localhost:3000/api/admin/createUser`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(trimmedDatas),
        });

        if (!res.ok) {
          throw new Error('Failed to add user');
        }

        // Refetch the updated data after adding the user
        const newUser = await res.json();
        setData((prevData) => [...prevData, newUser]);
        setFilteredData((prevData) => [...prevData, newUser]);
        alert('User Added');
        setCreateMode(false)
      } catch (err) {
        alert(err.message);
      }
    }
    else {
      console.log('Failed to create user');

    }
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (

    <>
      <div className='flex bgc justify-between shadow shadow-lg p-5 mb-10'>
        <div className='flex items-center  shadow shadow-lg w-2/4'>
          <h1 className='font-bold w-1/4 text-white px-4 py-2 bg-black uppercase text-lg'>Search User</h1>
          <input type="text" className='border focus:outline-none px-4 py-2 w-3/4 border-2 border-white' value={searchInput} onChange={e => setSearchInput(e.target.value)} />
        </div>
      </div>
      <div className="admin-dashboard flex justify-around items-center mb-10">
        <table className="bordered-table">
          <thead>
            <tr>
              <th>PROFILE</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredData && filteredData.length > 0 ? (
              filteredData.map((user) => (
                <tr key={user._id}>
                  <td>
                    <img
                      className="w-14 h-14 object-cover rounded-full"
                      src={user.imageUrl || 'default-image-url.jpg'}
                      alt="Profile Preview"
                    />
                  </td>
                  <td>
                    {editMode && currentEditingUserId === user._id ? (
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    ) : (
                      user.username
                    )}
                  </td>
                  <td>
                    {editMode && currentEditingUserId === user._id ? (
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td>
                    <div className="flex gap-x-10">
                      {editMode && currentEditingUserId === user._id ? (
                        <>
                          <button onClick={handleSave} className="btn-edit">
                            Save
                          </button>
                          <button onClick={() => setEditMode(false)} className="shadow shadow-lg btn-delete">
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEdit(user)} className="shadow shadow-lg btn-edit">
                            Edit
                          </button>
                          <button onClick={() => handleDelete(user._id)} className="btn-delete">
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No users available</td>
              </tr>
            )}
          </tbody>


        </table>
       <div className='w-80 flex flex-col gap-y-12 justify-center items-center '>
       <button onClick={() => navigate('/')} className='shadow shadow-lg font-bold w-1/4 text-white px-4 py-2 bg-black uppercase text-lg  w-full'> HOME</button>
       <button onClick={() => setCreateMode(prev => !prev)} className='shadow shadow-lg font-bold w-1/4 text-white px-4 py-2 bg-black uppercase text-lg  w-full'>Add User</button>
       </div>







      </div>
      {
          createMode ? <>

            <div className='flex justify-center items-center bg-black/80 absolute popup'>
              <form onSubmit={handleCreateUser} className="w-1/2 p-6 flex bg-white flex-col">
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

<div className='w-full flex justify-between'>

                  <button type='submit' className='btn-edit'>Add</button>

                  <button onClick={() => setCreateMode(prev => !prev)} className='btn-delete'>Close</button>

                </div>
        </form>
            </div>


          </> : null
        }

    </>

  );
};

export default AdminDashboard;
