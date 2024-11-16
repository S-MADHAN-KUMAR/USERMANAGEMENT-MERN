import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Logout } from '../redux/user/userSlice';

const Header = () => {
   const dispatch = useDispatch();
   const { currentUser } = useSelector((state) => state.user);
   const navigate = useNavigate();

   const handleAuthAction = () => {
     if (currentUser) {
       dispatch(Logout());
       navigate('/login');
     } else {
       navigate('/login');
     }
   };

   const welcomeMessage = currentUser ? 
      ` ${currentUser.username}'s HOME` : 
      'Welcome To The Home Page, Please LOGIN >';

   return (
      <nav className='bgc uppercase shadow shadow-xl text-black items-center font-bold text-xl flex justify-between p-3'>
         <h1 className='inline-flex'>{welcomeMessage}</h1>
         <div className='flex flex-row gap-x-8'>
            <button onClick={() => { navigate('/profile') }} className='bg-black px-6 py-2 text-base font-semibold shadow shadow-lg rounded-lg text-white'>
               Profile
            </button>

            {
             currentUser &&  currentUser.isAdmin ? <button onClick={() => { navigate('/admindashboard') }} className='bg-black px-6 py-2 text-base font-bold shadow shadow-lg rounded-lg text-white'>
               AdminDash Board
            </button> : null
            }
           
            <button onClick={handleAuthAction} className="bg-black px-6 py-2 text-base font-bold shadow shadow-lg rounded-lg text-white">
               {currentUser ? 'Logout' : 'Login'}
            </button>


            <img
               src={currentUser?.imageUrl || 'https://i.pinimg.com/originals/5e/53/12/5e5312ab982e6620087882ce7ff1ac23.gif'}
               onClick={() => { navigate('/profile') }}
               className='shadow shadow-lg rounded-full object-cover w-10  h-10' />

         </div>
      </nav>
   );
}

export default Header;
