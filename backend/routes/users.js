const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const jwt = require('express-jwt');

// JWT middleware
const authJwt = require('../helpers/jwt');

// Protected route - Update user
router.put('/:id', authJwt(), async (req, res) => {
    if (!req.auth) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                street: req.body.street,
                apartment: req.body.apartment,
                city: req.body.city,
                zip: req.body.zip,
                country: req.body.country
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                street: user.street,
                apartment: user.apartment,
                city: user.city,
                zip: user.zip,
                country: user.country
            }
        });
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating user',
            error: error.message
        });
    }
});

module.exports = router; 