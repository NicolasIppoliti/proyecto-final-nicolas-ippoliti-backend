import passport from 'passport';

export function isAuthenticated(req, res, next) {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(403).json({ message: 'You are not authenticated' });
    }
    req.user = user;
    next();
  })(req, res, next);
}

export function isAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'You do not have admin privileges' });
}

export function isPremium(req, res, next) {
  if (req.user && req.user.role === 'premium') {
    return next();
  }
  return res.status(403).json({ message: 'You do not have premium privileges' });
}

export function isProductOwner(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  if (req.user && req.user.role === 'premium' && req.user._id === req.params.owner) {
    return next();
  }
  return res.status(403).json({ message: 'You do not have product owner privileges' });
}
