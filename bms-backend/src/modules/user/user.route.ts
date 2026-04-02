import express from "express";
import * as UserController from './user.controller';
import { verifyUser } from "../../middlewares/auth"; // adjust path as per your project

const router = express.Router();

// Create a new user
router.post('/', UserController.createUser);

// Get all users
router.get('/', UserController.getAllUsers);

// Get a user by ID
router.get('/:id', UserController.getUserById); // dynamic route

// Activate a user
router.put('/:id/activate', UserController.activateUser); // RESTful URL

router.get("/profile", verifyUser, UserController.getUserProfile); 

// Update logged-in user's profile (protected route)
router.put('/profile', verifyUser, UserController.updateUserProfile);

export default router;