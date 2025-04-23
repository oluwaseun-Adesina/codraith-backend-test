const express = require('express');
const userRoutes = express.Router();
const userController = require('../controllers/userController');
const { validateUser } = require('../validators/userValidator');
const  authenticate  = require('../middleware/authenticate');

// User registration route
userRoutes.post('/register', validateUser, userController.registerUser);

// User login route
userRoutes.post('/login', userController.loginUser);

// User profile route (protected)
userRoutes.get('/profile', authenticate, userController.getUserProfile);

// Update user profile route (protected)
userRoutes.put('/profile', authenticate, validateUser, userController.updateUserProfile);

// Delete user account route (protected)
userRoutes.delete('/profile', authenticate, userController.deleteUserAccount);



module.exports = userRoutes