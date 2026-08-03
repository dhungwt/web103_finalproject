import express from "express";
import passport from "passport";

const router = express.Router();
const CLIENT_URL = process.env.CLIENT_URL;

// login success - the frontend polls this on load to find out who (if anyone) is signed in
router.get("/login/success", (req, res) => {
  if (req.user) {
    return res.status(200).json({ success: true, user: req.user });
  }
  res.status(401).json({ success: false, message: "Not authenticated." });
});

// login failure
router.get("/login/failed", (req, res) => {
  res.status(401).json({ success: false, message: "failure" });
});

// logout
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.clearCookie("connect.sid");
      res.status(200).json({ success: true, status: "logout" });
    });
  });
});

// github login
router.get(
  "/github",
  passport.authenticate("github", { scope: ["read:user"] }),
);

// github callback
router.get(
  "/github/callback",
  passport.authenticate("github", {
    successRedirect: CLIENT_URL,
    failureRedirect: CLIENT_URL+'/locations' ,
  }),
);

export default router;
