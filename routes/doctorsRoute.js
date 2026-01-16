const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');


router.get("/doct", async (req, res) => {
    try {
        const doctors = await Doctor.find({});
        res.render("doctors", { doctors });
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).send("Internal Server Error");
    }
});
module.exports = router;