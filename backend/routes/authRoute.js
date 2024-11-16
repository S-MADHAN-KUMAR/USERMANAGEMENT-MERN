// authRoute.js
import express from 'express';
import { login, register , update , getUser } from '../controllers/authController.js';


const router = express.Router();


router.post('/register', register);
router.post('/login', login);
router.post('/update',update)


router.get('/getImageUrl', getUser);

  
  

  

export default router;
