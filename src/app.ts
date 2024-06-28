import express, { json } from 'express';
import cors from 'cors';
import { auth } from 'express-openid-connect';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';

// Load environment variables from .env file
dotenv.config();

const config = {
  authRequired: true, // Set to true to require authentication for protected routes
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASEURL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.ISSUERBASEURL,
};

const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors());

// Routes
app.use('/auth', authRoutes); // Your auth routes for signup, login, etc.

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
