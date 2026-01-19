const express = require('express');
const router = express.Router();
const multer = require('multer');
const Doctor = require("../models/Doctor"); 
const Appointment = require("../models/appointment");
const { isAuthenticated, isReceptionist,isDoctor } = require("../middleware/middleware");
const { storage , cloudinary} = require('../cloudConfig');
const upload = multer({ storage });


router.get('/receptionlistlink/doctors', isReceptionist , async (req, res) => {
  try {
    const doctors = await Doctor.find();
    const user = req.session.user; 
    res.render('receptionlistlink/doctors', { doctors, user });
  } catch (error) {
    res.status(500).send(error.message);
  }
});


router.get('/doctor/update/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).send('Doctor not found');
    }
    res.render('updateDoctor', { doctor });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Handle Update Form Submission
router.post('/doctor/update/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, specialization, degrees, description } = req.body;
    const updateData = { name, specialization, degrees, description };

    if (req.file) {
      updateData.imageUrl = req.file.path; // Cloudinary URL
    }

    await Doctor.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.redirect('/receptionlistlink/doctors'); // or wherever you list doctors
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete Doctor
router.get('/doctor/delete/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).send('Doctor not found');
    }

    // Check if imageUrl exists and is a string
    if (doctor.imageUrl[0] && typeof doctor.imageUrl[0] === 'string') {
      const publicId = doctor.imageUrl[0].split('/').slice(-2).join('/').split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await Appointment.deleteMany({ doctor: req.params.id });

    await Doctor.findByIdAndDelete(req.params.id);
    res.redirect('/receptionlistlink/doctors');
  } catch (error) {
    console.error('Error deleting doctor:', error);
    res.status(500).send('Error deleting doctor');
  }
});

router.get('/doctorinfo/:id',isReceptionist,  async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    const appointments = await Appointment.find({ doctor: req.params.id });

    const user = req.session.user;
    res.render('receptionlistlink/doctorinfo', { doctor,
      appointments,
      user,
      availableDates: doctor.availableDates || [],
      availableTime: doctor.availableTime || ''
 });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading doctor info');
  }
});

router.get('/doctors/:id', async (req, res) => {
  try {
      const doctor = await Doctor.findById(req.params.id);
      if (!doctor) {
          return res.status(404).send('Doctor not found');
      }

      // Fetch appointments for the specific doctor
      const appointments = await Appointment.find({ doctor: req.params.id });

      // Render the doctor info page with doctor and appointments
      res.render('doctorinfo', { doctor, appointments });
  } catch (err) {
      console.error('Error loading doctor info:', err);
      res.status(500).send('Error loading doctor info');
  }
});

module.exports = router;




