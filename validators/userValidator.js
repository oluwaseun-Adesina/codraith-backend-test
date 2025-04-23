const joi = require('joi');
const User = require('../models/User');

const userSchema = joi.object({
    name: joi.string().min(3).max(20).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
    createdAt: joi.date(),
    updatedAt: joi.date(),
});

const validateUser = async (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    // Check if the username or email already exists in the database
    const existingUser = await User.findOne({
        $or: [{ username: req.body.username }, { email: req.body.email }],
    });

    if (existingUser) {
        return res.status(400).json({ message: 'Username or email already exists' });
    }

    next();
}

module.exports = {validateUser};