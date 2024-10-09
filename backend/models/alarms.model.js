import mongoose from "mongoose";

// Define the alarm schema
const alarmSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    time: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['green', 'yellow', 'red'], // Optional, to store the alarm status
        default: 'green',
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Store reference to User
        ref: "User", // Refers to the User model
        required: true, // Ensure every alarm has a userId
    }
});

export const Alarm = mongoose.model("Alarm", alarmSchema);
