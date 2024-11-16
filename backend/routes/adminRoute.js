// authRoute.js
import express from 'express';
import { deleteUser, getUsers ,editUser, createUser} from '../controllers/adminController.js';


const router = express.Router();


router.get('/getUsers',getUsers)
router.delete('/deleteUser/:id', deleteUser);
router.put('/editUser/:id', editUser);
router.post('/createUser',createUser)

  
  

  

export default router;
