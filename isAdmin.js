module.exports = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    req.flash("error", "You must be logged in to access this page.");
    return res.redirect("/login");
  }

  if (!req.session.user.roles || !req.session.user.roles.includes("admin")) {
    req.flash("error", "You do not have permission to access this page.");
    return res.redirect("/");
  }

  next();
};