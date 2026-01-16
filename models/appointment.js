const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true,
    },
    patientName: {
        type: String,
        required: true,
        trim: true,
    },
    department: {
        type: String,
        required: true,
        trim: true,
    },
    disease: {
        type: String,
    },
    phone: {
        type: Number,
        required: true,
        trim: true,
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid 10-digit phone number!`
        }
    },
    availableDates: { 
        type: [Date],
        required: true,
    },
    availableTime: {
        type: String,
        required: function() {
            return !this.customTime;
        }
    },
    customTime: {
        type: String,
        required: function() {
            return !this.availableTime; 
        }
    },
    gender: { 
        type: String,
        required: true, 
    },
    age: {
        type: Number,
        required: true,
        min: 0,
    },
    approved: {
        type: Boolean,
        default: false
    },
    approved: {
        type: Boolean,
        default: false
    },
    approvedBy: {
        type: String,
        default: null
    },
    approvedAt: {
        type: Date,
        default: null
    },
    rating: {
        type: Number,
        default: null,
        min: 1,
        max: 5,
    },
    userToken: {
        type: String, // Store the unique token
        required: true,
    },
}, { timestamps: true });

const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;
