import mongoose from "mongoose";
import { Alarm } from "./alarms.model.js"; // Add .js extension


// Define the user schema
const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        lastLogin: {
            type: Date,
            default: Date.now,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        resetPasswordToken: String,
        resetPasswordExpiresAt: Date,
        verificationToken: String,
        verificationTokenExpiresAt: Date,

        // Store references to the alarms created by the user
        alarms: [{
            type: mongoose.Schema.Types.ObjectId,  // Store references to Alarm documents
            ref: "Alarm"  // Refers to the Alarm model
        }]
    },
    { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
