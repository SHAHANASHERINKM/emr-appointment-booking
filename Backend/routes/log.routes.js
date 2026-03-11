const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorize');
const Log = require('../models/log.model');

router.get('/', authMiddleware, authorize('super_admin'), async (req, res) => {
    try {
        const { action, entity, page = 1, limit = 15 } = req.query;
        const filter = {};
        if (action) filter.action = action;
        if (entity) filter.entity = entity;
        const skip = (Number(page) - 1) * Number(limit);
        const total = await Log.countDocuments(filter);
        const logs = await Log.find(filter)
            .populate('userId', 'name email role')
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(Number(limit));
        return res.status(200).json({
            success: true,
            data: logs,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit)),
                limit: Number(limit)
            }
        });
    } catch (error) {
        console.error("Get logs error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;