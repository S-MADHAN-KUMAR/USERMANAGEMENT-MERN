import User from "../model/userModel.js"
import bcryptjs from 'bcryptjs'

const getUsers = async(req, res)=> {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        console.log(error)
    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndDelete(id);

        if (user) {
            return res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
            });
        } else {
            // Send a 404 error if the user isn't found
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        // Send a 500 server error if an unexpected error occurs
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};


const editUser = async (req, res) => {
    try {
      const id = req.params.id;
      const { username, email } = req.body;
  
      const user = await User.findById(id);
  
      if (user) {
        user.username = username || user.username; // Ensure to use `username` instead of `namename`
        user.email = email || user.email;
  
        const updatedUser = await user.save();
        res.status(200).json({
          _id: updatedUser._id,
          username: updatedUser.username,
          email: updatedUser.email,
        });
      } else {
        res.status(404);
        throw new Error('User not found');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Server error' });
    }
  };

  const createUser = async (req, res) => {
    try {
      const { username, email, password, imageUrl } = req.body;
  
      // Check if the user with the provided email already exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
  
      // Hash the password
      const hashedPassword = await bcryptjs.hash(password, 10);
  
      // Create the user
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        imageUrl
      });
  
      if (user) {
        // Respond with the created user's data
        return res.status(201).json({
          _id: user._id,
          username: user.username,
          email: user.email,
          imageUrl: user.imageUrl
        });
      } else {
        return res.status(400).json({ message: 'Invalid user data' });
      }
    } catch (error) {
      console.error("Error in createUser function:", error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  
  

export {getUsers,deleteUser,editUser,createUser}