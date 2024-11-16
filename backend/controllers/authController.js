import User from "../model/userModel.js"
import bcryptjs from "bcryptjs"
import { errorHandaler } from "../utils/error.js"
import jwt from "jsonwebtoken"

const register = async (req, res, next) => {
  const { username, email, password, phone } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);

  try {
      // Check for duplicate email
      const existUser = await User.findOne({ email });
      if (existUser) {
          return res.status(400).json({ message: "Email already in use" });
      }

      // Check for duplicate phone number
      if (phone) {
          const existPhone = await User.findOne({ phone });
          if (existPhone) {
              return res.status(400).json({ message: "Phone number already in use" });
          }
      }

      const newUser = new User({ username, email, password: hashedPassword, phone });
      const savedUser = await newUser.save();
      const { password: _, ...userDetails } = savedUser._doc;
      res.status(201).json(userDetails);
  } catch (error) {
      console.error("Registration Error:", error); // Log the error for debugging
      res.status(500).json({ message: "Server error", error: error.message });
  }
};



const login=async(req,res,next)=>{
    const { email, password} = req.body
   
   try {
     const validUser = await User.findOne({email});
     if(!validUser){
        return next (errorHandaler(401 , "User not Font.."))
     }
     const validPassword = bcryptjs.compareSync(password,validUser.password)
     if(!validPassword) return next(errorHandaler(401,"Wrong Crendials..."))
const token = jwt.sign({id:validUser._id},process.env.JWT_SECRET)
     const {password:hassedPassword,...rest} = validUser._doc
     const expiresTime = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) //30 days
     res.cookie('access_token',token,{httpOnly:true,expires:expiresTime})
     .status(200).json(rest)
   } catch (error) {
       next(error)
   }
   }

   const update = async (req, res) => {
    try {
      const id = req.body.userId;
      const { username, email, password, phone, imageUrl, isAdmin, isBlocked } = req.body;
  
      const user = await User.findById(id);
      if (user) {
        const profileEmail = user.email;
  
        // Check if the new email is already taken by another user
        let NotvalidEmail = null;
        if (email && email !== profileEmail) {
          NotvalidEmail = await User.findOne({ email });
        }
  
        if (NotvalidEmail) {
          return res.status(404).json({ message: 'User Email Already exists!' });
        }
  
 
        // Check if the phone number is already taken by another user
        if (phone && phone !== user.phone) {
          const existingUser = await User.findOne({ phone });
          if (existingUser && existingUser._id.toString() !== user._id.toString()) {
            return res.status(400).json({ message: 'Phone number already exists' });
          }
        }
  
        // Update the user fields
        user.username = username || user.username;
        if (email && email !== profileEmail) {
          user.email = email;
        }
  
        // Hash the password if it's being updated
        if (password) {
          const salt = await bcryptjs.genSalt(10);
          user.password = await bcryptjs.hash(password, salt);
        }
  
        user.phone = phone || user.phone;  
        user.imageUrl = imageUrl || user.imageUrl;
        user.isAdmin = isAdmin !== undefined ? isAdmin : user.isAdmin;
        user.isBlocked = isBlocked !== undefined ? isBlocked : user.isBlocked;
  
        // Save the updated user with the hashed password
        const updatedUser = await user.save();
  
        res.status(200).json({
          _id: updatedUser._id,
          username: updatedUser.username,
          email: updatedUser.email,
          password:null,
          phone: updatedUser.phone,  // Return the phone as well
          imageUrl: updatedUser.imageUrl,
          isAdmin: updatedUser.isAdmin,
          isBlocked: updatedUser.isBlocked,
        });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error updating user' });
    }
  };
  
  
  

  const getUser = async (req, res) => {
    try {
       const { userId } = req.query  // Get userId from headers
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
  
      const user = await User.findById(userId);  // Find user by ID
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Return the user's imageUrl
      res.status(200).json({ imageUrl: user.imageUrl , username : user.username , email :user.email});
  
    } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ message: 'Error fetching image URL' });
    }
  }


export {register,login ,update,getUser }



// .................................................................................................................


