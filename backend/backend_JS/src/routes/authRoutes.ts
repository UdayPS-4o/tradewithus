import express, { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import UserService from '../services/UserService';
import jwt from 'jsonwebtoken';
import { auth } from '../middleware/auth';

const router = express.Router();

// Config
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Signup route
router.post(
  '/signup',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ],
  async (req: Request, res: Response): Promise<void> => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ message: errors.array()[0].msg });
        return;
      }

      const { name, email, password } = req.body;

      // Check if user already exists
      const existingUser = await UserService.findUserByEmail(email);
      if (existingUser) {
        res.status(400).json({ message: 'User already exists with this email' });
        return;
      }

      // Create new user
      const user = await UserService.createUser({ name, email, password });

      res.status(201).json({
        message: 'User created successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Login route
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req: Request, res: Response): Promise<void> => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ message: errors.array()[0].msg });
        return;
      }

      const { email, password } = req.body;

      // Authenticate user
      const user = await UserService.authenticateUser({ email, password });
      if (!user) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email, name: user.name },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get current user route (protected)
router.get('/me', auth, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      res.status(401).json({ message: 'User not found in token' });
      return;
    }
    
    // Return user data from token
    // No need to query database again as we have user info in the token
    res.status(200).json({
      user: {
        id: req.user?.userId,
        name: req.user?.name,
        email: req.user?.email
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user route (protected)
router.delete('/user/:userId', auth, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    // Check if user exists
    const user = await UserService.findUserById(userId);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    
    // Check if user is deleting their own account or is admin
    if (req.user?.userId !== userId) {
      res.status(403).json({ success: false, message: 'Not authorized to delete this user' });
      return;
    }
    
    // Delete the user
    const deleted = await UserService.deleteUser(userId);
    
    if (deleted) {
      res.status(200).json({ success: true, message: 'User deleted successfully' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to delete user' });
    }
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router; 