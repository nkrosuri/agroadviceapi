const Token = require("../utils/token");

module.exports = async (req, res, next) => {
    try {
        const token = req.header('x-access-token');
        if (!token) {
            return res.status(401).send({ error: 'please provide token' });
        }
        const payload = await Token.verifyToken(token);
        req.user = payload.userId;
        next();
    } catch (err) {
        return res.status(401).send({ error: 'Unauthorized' });
    }
}