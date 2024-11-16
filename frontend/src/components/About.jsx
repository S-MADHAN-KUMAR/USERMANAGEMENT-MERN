// import React, { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';

// const About = () => {
//   const [imageUrl, setImageUrl] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { currentUser } = useSelector((state) => state.user);

//   const userId = currentUser?._id; // Ensure userId is available

//   useEffect(() => {
//     if (userId) {
//       fetchImageUrlFromDatabase();
//     }
//   }, [userId]); // Ensure that the effect runs when userId changes

//   // Fetch the image URL from the server/database
//   const fetchImageUrlFromDatabase = async () => {
//     try {
//       const response = await fetch(`http://localhost:3000/api/auth/getImageUrl?userId=${userId}`, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Add authorization if necessary
//         },
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch image');
//       }

//       const data = await response.json();
//       // Construct the full URL to the image
//       setImageUrl(`http://localhost:3000/backend/uploads/${data.imageUrl}`); // Combine the base URL with the image path
//     } catch (error) {
//       setError(error.message); // Handle errors
//     } finally {
//       setLoading(false); // Stop loading once data is fetched
//     }
//   };

//   return (
//     <>
//       <div>
//         {loading && <p>Loading...</p>}
//         {error && <p>Error: {error}</p>}
//         {imageUrl ? (
//           <img src={imageUrl} alt="Uploaded" />
//         ) : (
//           <p>No image found</p>
//         )}
//       </div>
//     </>
//   );
// };

// export default About;

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const About = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  const userId = currentUser?._id; // Ensure userId is available

  useEffect(() => {
    if (userId) {
      fetchImageUrlFromDatabase();
    }
  }, [userId]); // Ensure the effect runs when userId changes

  // Fetch the image URL from the server/database
  const fetchImageUrlFromDatabase = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/auth/getImageUrl?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Add authorization if necessary
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }

      const data = await response.json();
      // Construct the full URL to the image
      setImageUrl(data.imageUrl); // Combine the base URL with the image path
      
    } catch (error) {
      setError(error.message); // Handle errors
    } finally {
      setLoading(false); // Stop loading once data is fetched
    }
  };

  return (
    <div className='flex flex-col justify-center items-center'>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {
        currentUser.username ? <>
        <h1 className='text-4xl mt-24 font-semibold'>Wellcome Back <span className='text-red-700 font-bold ml-2'>MR.{currentUser.username}</span></h1>
        </> : null
      }
      {imageUrl ? (
        <img className='shadow-lg shadow shadow-gray-400 w-1/3 h-1/3 mt-10  object-contain' src={imageUrl} alt="Uploaded" />
      ) : (
        <p>No image found</p>
      )}



    </div>
  );
};

export default About;
