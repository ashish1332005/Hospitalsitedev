const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor");

// API to get available schedule for a selected doctor
router.get("/doctor-schedule/:doctorId", async (req, res) => {
    const { doctorId } = req.params;

    try {
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ error: "Doctor not found" });
        }

        res.json({
            availabledoctor : doctor.name,
            availableDates: doctor.availableDates, // Ensure this field exists in your Doctor schema
            availableTime: doctor.availableTime,
        });
    } catch (error) {
        console.error("Error fetching doctor schedule:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;