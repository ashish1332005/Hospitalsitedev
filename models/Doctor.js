const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const doctorSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim:true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    availableDates: {
        type: [Date], // Stores multiple selected dates
        required: true
    },    
    availableTime: {
        type: [String],  
        default: [],
    },
    
    specialization: {
        type:[String]
    },
    degrees:{ 
        type:[String]
    },
    imageUrl:{ type:[String]},
  
    department: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }]
}, { timestamps: true });

//  Hash password before saving (only if changed)
doctorSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); // Only hash if password is new/modified
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare password method
doctorSchema.methods.comparePassword = async function (inputPassword) {
    return await bcrypt.compare(inputPassword, this.password);
};

const Doctor = mongoose.models.Doctor || mongoose.model("Doctor", doctorSchema);
module.exports = Doctor;
