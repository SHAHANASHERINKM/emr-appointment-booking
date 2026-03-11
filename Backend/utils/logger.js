const Log = require('../models/log.model');

const createLog = async ({ userId, role, action, entity, description, ipAddress }) => {
    try {
        await Log.create({
            userId: userId || null,
            role: role || null,
            action,
            entity,
            description,
            ipAddress: ipAddress || null
        });
    } catch (error) {
        console.error('Logging error:', error);
    }
};

module.exports = createLog;