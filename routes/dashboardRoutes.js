const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor");
const { isAuthenticated, isReceptionist,isDoctor } = require("../middleware/middleware");

// Dashboard route
router.get("/dashboard", isAuthenticated, async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.session.doctorId);
        if (!doctor) {
            req.flash("error", "Doctor not found");
            return res.redirect("/login");
        }
        res.render("dashboard", { doctor });
    } catch (error) {
        console.error("Dashboard error:", error);
        req.flash("error", "Something went wrong");
        res.redirect("/login");
    }
});

module.exports = router;