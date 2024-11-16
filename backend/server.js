// server.js or app.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import UserRoute from './routes/userRoute.js';
import AuthRoute from './routes/authRoute.js';
import AdminRoute from './routes/adminRoute.js'

dotenv.config();



// Connect to MongoDB
mongoose.connect(process.env.MONGO)
  .then(() => {
    console.log("DB Connected....");
  })
  .catch((err) => {
    console.log(err);
  });

// Initialize express app
const app = express();

app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// CORS configuration
app.use(cors(
    { origin: 'http://localhost:5173', 
        methods: 'GET,POST,PUT,DELETE', 
        allowedHeaders: 'Content-Type,Authorization,userid'
     })) // Add 'userid' here }));

// Middleware to parse JSON request bodies
app.use(express.json());


app.use('/api/user', UserRoute);
app.use('/api/auth', AuthRoute);
app.use('/api/admin', AdminRoute);





// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error('Error:', message);
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000.....');
});
