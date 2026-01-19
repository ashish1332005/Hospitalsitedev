// Import required modules
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const cors = require("cors");
const MongoStore = require('connect-mongo');

const cookieParser = require("cookie-parser");
const { v4: uuidv4 } = require("uuid");
const session = require('express-session');

// Import models

const Appointment = require("./models/appointment");
const News = require("./models/news");
const Doctor = require("./models/Doctor");

// Import routes

const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const availabilityRoutes = require("./routes/availabilityRoutes");
const doctorScheduleRoutes = require("./routes/doctorScheduleRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const newsRoutes = require("./routes/newsRoutes");
const doctorRoutes = require("./routes/doctorsRoute");
const doctorUpdateRoutes = require('./routes/doctorupdateRoutes');
const receptionlistRoutes = require("./routes/receptionlistRoutes");
// Import middleware
const flashAndSession = require("./middleware/flashAndSession");

// Load environment variables
if (process.env.NODE_KEY !== "production") {
    require("dotenv").config();
}

// Initialize Express app
const app = express();

// Set up view engine and static files
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(newsRoutes);
flashAndSession(app); // Use flash and session middleware

// MongoDB connection
async function startServer() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");

        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`App running on port ${port}`);
        });

    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    }
}

startServer();

// Assign a unique token to each user for session-based identification
app.use((req, res, next) => {
    if (!req.cookies.userToken) {
        const userToken = uuidv4();
        res.cookie("userToken", userToken, {
            httpOnly: true,
            secure: false,
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });
        req.userToken = userToken;
    } else {
        req.userToken = req.cookies.userToken;
    }
    next();
});

// Configure session store with MongoDB Atlas
// app.use(session({
//     secret: process.env.SESSION_SECRET || 'defaultSecret', // Use a secure secret from environment variables
//     resave: false,
//     saveUninitialized: true,
//     store: MongoStore.create({
//       mongoUrl: process.env.ATLAS_URL, // MongoDB Atlas connection string
//       ttl: 14 * 24 * 60 * 60, // Session expiration time in seconds (14 days)
//       autoRemove: 'native', // Automatically remove expired sessions
//     }),
//     cookie: {
//       secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
//       httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
//       maxAge: 14 * 24 * 60 * 60 * 1000, // Cookie expiration time in milliseconds (14 days)
//     },
//   }));

// Middleware to clear appointments if the userToken cookie is missing
app.use(async (req, res, next) => {
    if (!req.cookies.userToken) {
        try {
            await mongoose.model("Appointment").deleteMany({});
        } catch (error) {
            console.error("Error clearing appointments:", error);
        }
    }
    next();
});



// Routes
app.get('/doctors', async (req, res) => {
    const { department } = req.query;
    try {
        const query = department ? { department } : {};
        const doctors = await Doctor.find(query);

        if (doctors.length === 0) {
            if (req.accepts('json')) {
                return res.status(404).json({ message: "No doctors found." });
            }
            return res.render('doctors', { doctors: [], message: "No doctors available." });
        }

        if (req.accepts('json')) {
            return res.json(doctors);
        }

        res.render('doctors', { doctors });
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).json({ error: "Server error", details: error.message });
    }
});


// Use imported routes
app.use(doctorScheduleRoutes);
app.use(authRoutes);
app.use(dashboardRoutes);
app.use(availabilityRoutes);
app.use(doctorRoutes);
app.use(appointmentRoutes);
app.use('/', doctorUpdateRoutes);
app.use('/doctors', doctorRoutes);
app.use(receptionlistRoutes);


// Public routes
app.get('/', async (req, res) => {
    try {
        const doctors = await Doctor.find({}); // Fetch all doctors from the database
        const newsList = await News.find({}); 
        res.render('index', { doctors,  newsList}); // Pass doctors to the EJS file
    } catch (error) {
        
        res.status(500).send('Internal Server Error');
    }
});
app.get("/blogs", (req, res) => res.render("blogs.ejs"));
app.get("/news", async (req, res) => {
    try {
        const newsList = await News.find({});
        res.render("news", { newsList });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});
app.get("/aboutBBMH", (req, res) => res.render("about.ejs"));
app.get("/doct", async (req, res) => {
    try {
        const doctors = await Doctor.find({});
        res.render("doctors", { doctors });
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).send("Internal Server Error");
    }
});
app.get("/empanelments", (req, res) => res.render("empalenments.ejs"));
app.get("/specialities", (req, res) => res.render("specialities.ejs"));

// Speciality routes
const specialities = [
    "ent",
    "Gynecology",
    "Gastrology",
    "Neurosurgery",
    "JointReplacement",
    "Orthopedic",
    "Plasticsurgery",
    "SportsInjuries",
    "Urology",
];
specialities.forEach((route) => {
    app.get(`/${route}`, (req, res) => res.render(`${route}.ejs`));
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong! Please try again later.");
});


