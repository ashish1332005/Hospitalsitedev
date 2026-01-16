const session = require("express-session");
const flash = require("connect-flash");
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const flashAndSession = (app) => {
    // Session configuration
    app.use(
        session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: true,
            cookie: { secure: false }, // Set to true if using HTTPS
        })
    );

    // Flash messages
    app.use(flash());
    app.use((req, res, next) => {
        res.locals.success = req.flash("success");
        res.locals.error = req.flash("error");
        next();
    });
};

module.exports = flashAndSession;