const router = require("express").Router();
const passport = require("passport");
const spotifyTokenVerification = require("../../middlewares/spotifyRefreshToken");
const ensureAuth = require("../../middlewares/ensureAuth");
const scope = [
    "user-library-modify",
    "user-follow-read",
    "user-modify-playback-state",
    "user-top-read",
    "user-read-currently-playing",
    "app-remote-control",
    "user-read-playback-state",
    "streaming",
    "user-library-read"
];

router.get("/auth/spotify", passport.authenticate("spotify", { scope }));
router.get(
    "/auth/spotify/callback",
    passport.authenticate("spotify", {
        successRedirect: "/",
        failureRedirect: "/login"
    })
);

router.get(
    "/current_user",
    ensureAuth,
    spotifyTokenVerification,
    (req, res) => {
        const { id } = req.user;
        res.json({ id });
    }
);

router.get("/api/logout", (req, res) => {
    req.logout();
    res.send("User has logged out");
});

module.exports = router;