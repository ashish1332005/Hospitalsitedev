const express = require("express");
const router = express.Router();
const methodOverride = require("method-override");
router.use(methodOverride("_method"));
const Appointment = require("../models/Appointment");

// Appointment form route
router.get("/appointment", (req, res) => {
    try {
        res.render("appointment.ejs");
    } catch (error) {
        console.error(error);
        req.flash("error", "Something went wrong");
        res.redirect("/");
    }
});

// Route to get appointments for the current user
router.get("/appointments", async (req, res) => {
    try {
        const appointments = await Appointment.find({ userToken: req.userToken }).populate("doctor"); // Fetch only the user's appointments
        res.render("appointments", { appointments });
    } catch (error) {
        console.error(error);
        req.flash("error", "Failed to fetch appointments.");
        res.redirect("/");
    }
});
router.post("/appointments", async (req, res) => {
    const { doctor, patientName, department, disease, phone, availableDates, availableTime, customTime, gender, age } = req.body;


    if (!req.userToken) {
        req.flash("error", "User token is missing. Please login again.");
        return res.redirect("/appointments");
    }

    try {
        const appointment = new Appointment({
            doctor,
            patientName,
            department,
            disease,
            phone,
            availableDates,
            availableTime,
            customTime,
            gender,
            age,
            userToken: req.userToken, 
        });
        await appointment.save();
        res.render("rating.ejs" , { appointment});
    } catch (error) {
        console.error("Actual Error while booking appointment:", error.message);
        if (error.errors) {
            for (let key in error.errors) {
                console.error(`Validation error on ${key}:`, error.errors[key].message);
            }
        }
        req.flash("error", error.message || "Failed to book appointment.");
        res.redirect("/appointments");
    }
});

// Save a rating for an appointment
router.post("/appointments/:id/rating", async (req, res) => {
    try {
        const { id } = req.params;
        const { rating } = req.body;

        if (!id) {
            throw new Error("Appointment ID is missing.");
        }

        if (!rating) {
            throw new Error("Rating is missing.");
        }

        await Appointment.findByIdAndUpdate(id, { rating });
        req.flash("success", "Rating saved successfully");
        res.redirect("/appointments");
    } catch (err) {
        console.error("Error saving rating:", err);
        req.flash("error", "Failed to save rating");
        res.redirect("/appointments");
    }
});

// Delete an appointment (Receptionist-specific route)
router.delete("/receptionist/appointments/:id", async (req, res) => {
    try {
        const { id } = req.params;// Debugging log
        await Appointment.deleteOne({ _id: id });
        req.flash("success", "Appointment deleted successfully");
        res.redirect(req.get('referer')); // Redirects to the referring page
    } catch (err) {
        console.error("Error deleting appointment:", err);
        req.flash("error", "Failed to delete appointment");
        res.redirect(req.get('referer')); // Redirects to the referring page
    }
});


// Delete an appointment
router.delete("/appointments/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await Appointment.deleteOne({ _id: id });
        req.flash("success", "Appointment deleted successfully");
        res.redirect("back"); // Redirects to the same page
    } catch (err) {
        console.error("Error deleting appointment:", err);
        req.flash("error", "Failed to delete appointment");
        res.redirect("back"); // Redirects to the same page
    }
});

router.delete("/delete-news/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedNews = await News.findByIdAndDelete(id);

        if (!deletedNews) {
            return res.status(404).json({ error: "Image not found" });
        }

        res.status(200).json({ message: "Image deleted successfully" });
    } catch (error) {
        console.error("Error deleting image:", error);
        res.status(500).json({ error: "Failed to delete image" });
    }
});

router.post('/appointments/:id/approve', async (req, res) => {
    try {
      const appointment = await Appointment.findById(req.params.id);
  
      if (!appointment) {
        return res.status(404).send("Appointment not found");
      }
  
      appointment.approved = true;
      await appointment.save();
  
    
      res.redirect(`/receptionlistlink/reception-dashboard?approvedName=${encodeURIComponent(appointment.patientName)}`);
    } catch (error) {
      console.error("Error approving appointment:", error);
      res.status(500).send("Internal Server Error");
    }
  });
  

  router.get('/reception-dashboard', async (req, res) => {
    try {
      const appointments = await Appointment.find();
      const approvedName = req.query.approvedName;
  
      res.render('reception-dashboard', { appointments, approvedName });
    } catch (error) {
      console.error("Error loading dashboard:", error);
      res.status(500).send("Failed to load dashboard");
    }
  });
  


module.exports = router;