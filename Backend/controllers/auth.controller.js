const User = require("../models/user.model");
const jwt = require("jsonwebtoken");


module.exports = {

      login: async (req, res) => {
        try {
            const email = req.body.email?.trim().toLowerCase();
            const password = req.body.password;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Email and password are required"
                });
            }

            const user = await User.findOne({ email }).select('+password');

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials"
                });
            }

            if (!user.isActive) {
                return res.status(401).json({
                    success: false,
                    message: "Your account has been deactivated. Contact admin."
                });
            }

            const isPasswordMatch = await user.comparePassword(password);
            if (!isPasswordMatch) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials"
                });
            }

            const accessToken = jwt.sign(
                { id: user._id, role: user.role, email: user.email },
                process.env.JWT_ACCESS_SECRET,
                { expiresIn: '15m' }
            );

            const refreshToken = jwt.sign(
                { id: user._id, role: user.role },
                process.env.JWT_REFRESH_SECRET,
                { expiresIn: '7d' }
            );

            user.refreshTokens = [
                { token: refreshToken },
                ...user.refreshTokens.slice(0, 4)
            ];
            await user.save({ validateBeforeSave: false });

            return res.status(200).json({
                success: true,
                message: "Login successful",
                data: {
                    accessToken,
                    refreshToken,
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        specialization: user.specialization,
                        department: user.department
                    }
                }
            });

        } catch (error) {
            console.error("Login error:", error);
            res.status(500).json({
                success: false,
                message: "Server error during login"
            });
        }
    },

    refresh: async (req, res) => {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(401).json({
                    success: false,
                    message: "Refresh token is required"
                });
            }

            let decoded;
            try {
                decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            } catch (err) {
                return res.status(401).json({
                    success: false,
                    message: err.name === 'TokenExpiredError'
                        ? "Refresh token expired, please login again"
                        : "Invalid refresh token"
                });
            }

            const user = await User.findById(decoded.id);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "User not found"
                });
            }

            const tokenExists = user.refreshTokens.some(
                (t) => t.token === refreshToken
            );
            if (!tokenExists) {
                return res.status(401).json({
                    success: false,
                    message: "Refresh token mismatch, please login again"
                });
            }

            const newAccessToken = jwt.sign(
                { id: user._id, role: user.role, email: user.email },
                process.env.JWT_ACCESS_SECRET,
                { expiresIn: '15m' }
            );

            const newRefreshToken = jwt.sign(
                { id: user._id, role: user.role },
                process.env.JWT_REFRESH_SECRET,
                { expiresIn: '7d' }
            );

            user.refreshTokens = user.refreshTokens.filter(
                (t) => t.token !== refreshToken
            );
            user.refreshTokens.unshift({ token: newRefreshToken });
            await user.save({ validateBeforeSave: false });

            return res.status(200).json({
                success: true,
                message: "Token refreshed successfully",
                data: {
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken
                }
            });

        } catch (error) {
            console.error("Refresh token error:", error);
            res.status(500).json({
                success: false,
                message: "Server error during token refresh"
            });
        }
    },
  

    logout: async (req, res) => {
        try {
            const { refreshToken } = req.body;
            const userId = req.user.id;

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            user.refreshTokens = user.refreshTokens.filter(
                (t) => t.token !== refreshToken
            );
            await user.save({ validateBeforeSave: false });

            return res.status(200).json({
                success: true,
                message: "Logged out successfully"
            });

        } catch (error) {
            console.error("Logout error:", error);
            res.status(500).json({
                success: false,
                message: "Server error during logout"
            });
        }
    },

    getMe: async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-refreshTokens');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {
        console.error("Get me error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}
}