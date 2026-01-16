const express = require('express');
const router = express.Router();
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const { isAuthenticated, isReceptionist,isDoctor } = require("../middleware/middleware");

router.get("/receptionlistlink/news", isReceptionist,(req, res) => {
    res.render("receptionlistlink/news");
});

router.get("/receptionlistlink/reception-dashboard",isReceptionist, async (req, res) => {
    try {
        const appointments = await Appointment.find().populate("doctor");
        res.render("receptionlistlink/reception-dashboard", { appointments });
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get("/receptionlistlink/doctors", isReceptionist, async (req, res) => {
    try {
        const doctors = await Doctor.find(); 
        res.render("receptionlistlink/doctors", { doctors }); 
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).send("Server Error");
    }
});

module.exports = router;