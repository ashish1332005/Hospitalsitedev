const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor");
const Appointment = require("../models/appointment");
const multer = require('multer');
const fs = require('fs');
const { storage } = require('../cloudConfig');
const { isAuthenticated, isReceptionist,isDoctor } = require("../middleware/middleware");
if(process.env.NODE_KEY != "production"){
    require('dotenv').config();
}

// Initialize multer
const upload = multer({ storage });

router.post("/access", async (req, res) => {
  

    const { accessCode } = req.body;

    if (accessCode === process.env.SECRET_kEY) {
        req.session.user = { type: 'doctor' }; 
        return res.redirect("/register"); // Doctor signup form
    } else if (accessCode === process.env.SECRET_REC) {
        req.session.user = { type: 'receptionist' };
        const appointments = await Appointment.find().populate("doctor");
        return res.render("receptionlistlink/reception-dashboard.ejs", { appointments: appointments });
    } else {
        req.flash("error", "Invalid access code");
        return res.redirect("/access");
    }
});


router.get("/access", (req, res) => {
    res.render("access.ejs", { messages: req.flash() });
});


router.get("/register", isDoctor , (req, res) => {
    res.render("register.ejs");
});
// Adjust according to your directory structure


router.post('/register', upload.single('image'), async (req, res) => {
    const { name, email, password, department, specialization, degrees, description } = req.body;
  
    const newDoctor = new Doctor({
      name,
      email,
      password, // hash if needed
      department,
      specialization,
      degrees,
      description,
      imageUrl: req.file ? req.file.path : '' // Cloudinary URL
    });
  
    await newDoctor.save();
    res.redirect('/dashboard'); // or wherever you list doctors
  });


router.get("/login",isDoctor, (req, res) => {
    res.render("login.ejs");
});


router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const doctor = await Doctor.findOne({ email });
        if (!doctor) {
            req.flash("error", "Doctor not found");
            return res.redirect("/login");
        }

        const isMatch = await doctor.comparePassword(password);
        if (!isMatch) {
            req.flash("error", "Invalid password");
            return res.redirect("/login");
        }

        req.session.doctorId = doctor._id;
        req.flash("success", "Login successful");
        res.redirect("/dashboard");
    } catch (error) {
        console.error("Login Error:", error);
        req.flash("error", "Login failed");
        res.redirect("/login");
    }
});


// Logout route
router.get("/logout", (req, res) => { 

    req.flash("success", "Logged out successfully");

    req.session.destroy((err) => {
        if (err) {
            console.error("Logout Error:", err); 
            req.flash("error", "Logout failed");
            return res.redirect("/dashboard");
        }

        res.clearCookie("connect.sid"); 
        res.redirect("/"); 
    });
});

module.exports = router;
