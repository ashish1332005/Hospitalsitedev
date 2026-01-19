// =====================
// Core Modules
// =====================
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { v4: uuidv4 } = require("uuid");

// =====================
// Load Environment Variables
// =====================
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

// =====================
// Initialize App
// =====================
const app = express();

// =====================
// View Engine & Static Files
// =====================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// =====================
// Global Middleware
// =====================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(cors());
app.use(cookieParser());

// =====================
// Session Configuration (Production Ready)
// =====================
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
            ttl: 14 * 24 * 60 * 60, // 14 days
        }),
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 14 * 24 * 60 * 60 * 1000,
        },
    })
);

// =====================
// Flash & Custom Middleware
// =====================
const flashAndSession = require("./middleware/flashAndSession");
flashAndSession(app);

// =====================
// Assign User Token (Safe)
// =====================
app.use((req, res, next) => {
    if (!req.cookies.userToken) {
        const userToken = uuidv4();
        res.cookie("userToken", userToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        req.userToken = userToken;
    } else {
        req.userToken = req.cookies.userToken;
    }
    next();
});

// =====================
// Models
// =====================
const Appointment = require("./models/appointment");
const Doctor = require("./models/Doctor");
const News = require("./models/news");

// =====================
// Routes
// =====================
const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const availabilityRoutes = require("./routes/availabilityRoutes");
const doctorScheduleRoutes = require("./routes/doctorScheduleRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const newsRoutes = require("./routes/newsRoutes");
const doctorRoutes = require("./routes/doctorsRoute");
const doctorUpdateRoutes = require("./routes/doctorupdateRoutes");
const receptionlistRoutes = require("./routes/receptionlistRoutes");

// =====================
// Route Usage
// =====================
app.use(newsRoutes);
app.use(authRoutes);
app.use(dashboardRoutes);
app.use(availabilityRoutes);
app.use(doctorScheduleRoutes);
app.use(appointmentRoutes);
app.use("/doctors", doctorRoutes);
app.use("/", doctorUpdateRoutes);
app.use(receptionlistRoutes);

// =====================
// Public Routes
// =====================
app.get("/", async (req, res) => {
    try {
        const doctors = await Doctor.find({});
        const newsList = await News.find({});
        res.render("index", { doctors, newsList });
    } catch (err) {
        res.status(500).send("Internal Server Error");
    }
});

app.get("/blogs", (req, res) => res.render("blogs"));
app.get("/news", async (req, res) => {
    const newsList = await News.find({});
    res.render("news", { newsList });
});
app.get("/aboutBBMH", (req, res) => res.render("about"));
app.get("/empanelments", (req, res) => res.render("empalenments"));
app.get("/specialities", (req, res) => res.render("specialities"));

// =====================
// Error Handler
// =====================
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!");
});

// =====================
// Database Connection & Server Start
// =====================
async function startServer() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB connected");

        const PORT = process.env.PORT ;
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("❌ MongoDB connection failed:", err);
        process.exit(1);
    }
}

startServer();
