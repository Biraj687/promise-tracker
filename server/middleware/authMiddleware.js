const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Token is invalid or expired' });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ error: 'Authorization header is missing' });
  }
};

const requireAdmin = (req, res, next) => {
  requireAuth(req, res, () => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ error: "Access Denied. You don't have Admin privileges." });
    }
  });
};

module.exports = { requireAuth, requireAdmin };
