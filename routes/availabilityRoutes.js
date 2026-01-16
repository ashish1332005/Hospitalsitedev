const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor");

// Update availability route
router.post("/updateAvailability", async (req, res) => {
    try {
        let { availableDates, availableTime, doctorId } = req.body;


        // Convert string of dates to an array
        availableDates = availableDates ? availableDates.split(", ") : [];

        const isDoctor = req.session.doctorId;
        const isReceptionist = req.session.user?.type === 'receptionist';


let targetDoctorId = null;
        if (isDoctor) {
            targetDoctorId = req.session.doctorId;
        } else if (isReceptionist && doctorId) {
            targetDoctorId = doctorId; // from hidden input
        } else {
            req.flash("error", "Unauthorized or missing doctor ID.");
            return res.redirect("/login");
        }

        // Update MongoDB document
        const updateFields = {};
        if (availableDates.length) updateFields.availableDates = availableDates;
        if (availableTime) updateFields.availableTime = availableTime;

        const updatedDoctor = await Doctor.findByIdAndUpdate(
            targetDoctorId,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

             if (!updatedDoctor) {
            req.flash("error", "Doctor not found");
            return res.redirect("/dashboard");
        }


        req.flash("success", "Availability updated successfully");
        if(isReceptionist){
        return res.redirect(`/doctorinfo/${targetDoctorId}`);
    }

    else if(isDoctor){
        return res.redirect("/dashboard");
    }
    } catch (error) {
        console.error(" Update Error:", error);
        req.flash("error", "Failed to update availability");
        res.redirect("/dashboard");
    }
});

module.exports = router;