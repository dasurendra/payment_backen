// src/controllers/authController.ts
import { Request, Response } from 'express';
import { signupUser, loginUser } from '../services/authService';

export const signup = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Attempt to sign up the user
    const result = await signupUser(email, password);
    
    // If successful, send success response
    res.json({ message: 'User signed up successfully', result });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Signup Error:', error.message);
      // Check for specific Auth0 error indicating user already exists
      if (error.message.includes('The user already exists.')) {
        res.status(409).json({ message: 'User already exists' });
        console.log('User already exists:', error.message);
      } else {
        // Handle other errors
        res.status(400).json({ message: error.message });
        console.log('Other Error:', error.message);
      }
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await loginUser(email, password);
    res.json({ message: 'User logged in successfully', result });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Login Error:', error.message);
      // Handle specific authentication errors
      if (error.message.includes('Unauthorized')) {
        res.status(401).json({ message: 'Unauthorized: Invalid credentials' });
      } else {
        res.status(400).json({ message: error.message });
        console.log('Login Error:', error.message);
      }
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};
