// authentication middleware
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/User'); // Assuming you have a User model defined

dotenv.config();

const authenticate = async (req, res, next) => {

    const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        req.user = await User.findById(decoded.id); // Find the user by ID in the token
        if (!req.user) {
            return res.status(404).json({ message: 'User not found' });
        }
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
}
//     

module.exports = authenticate;