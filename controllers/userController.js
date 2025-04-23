const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// register a new user
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.find({ email });
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    }
    catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// login a user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.find({ email });
        if (user.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user[0].password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user[0]._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, user: { id: user[0]._id, username: user[0].username, email: user[0].email } });
    }
    catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// get user profile
const getUserProfile = async (req, res) => {
    const userId = req.user.id; // Assuming you have middleware to set req.user

    try {
        // Find the user by ID
        const user = await User.findById(userId).select('-password -__v');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({message: 'User Profile Fetched successfully', data: user});
    }
    catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// update user profile
const updateUserProfile = async (req, res) => {
    const userId = req.user.id; // Assuming you have middleware to set req.user
    const { email } = req.body;

    try {
        // Find the user by ID and update
        const updatedUser = await User.findByIdAndUpdate(userId, { name, email }, { new: true }).select('-password -__v');
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(updatedUser);
    }
    catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
// delete user account
const deleteUserAccount = async (req, res) => {
    const userId = req.user.id; // Assuming you have middleware to set req.user

    try {
        // Find the user by ID and delete
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User account deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting user account:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    deleteUserAccount,
};