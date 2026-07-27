// Blocks unauthenticated requests. Use on any route that reads/writes a specific user's data.
export const requireAuth = (req, res, next) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ success: false, message: "Not authenticated." });
  }
  next();
};

// Blocks a logged-in user from touching another user's data via the :userId param.
export const requireSelf = (req, res, next) => {
  if (String(req.user.id) !== String(req.params.userId)) {
    return res.status(403).json({ success: false, message: "Forbidden." });
  }
  next();
};
