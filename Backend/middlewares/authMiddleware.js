const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

module.exports = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: "Access token is required"
            });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        const user = await User.findById(decoded.id).select('-refreshTokens');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User no longer exists"
            });
        }

        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: "Your account has been deactivated"
            });
        }

        req.user = user;
        next();

    } catch (err) {
        return res.status(401).json({
            success: false,
            message: err.name === 'TokenExpiredError'
                ? "Access token expired, please refresh"
                : "Invalid access token"
        });
    }
};