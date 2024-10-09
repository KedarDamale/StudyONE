import { Alarm } from "../models/alarms.model.js"; // Import the Alarm model
import { User } from '../models/user.model.js'; // Import the User model
import mongoose from 'mongoose'; // Import mongoose to validate ObjectId

// Utility function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Create a new alarm for a user
export const createAlarm = async (req, res) => {
    const { userId, title, description, time } = req.body;

    // Check for required fields
    if (!userId || !title || !description || !time) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        // Validate userId format
        if (!isValidObjectId(userId)) {
            return res.status(400).json({ message: "Invalid user ID format." });
        }

        // Create a new alarm with userId reference
        const newAlarm = new Alarm({ title, description, time, userId });
        await newAlarm.save();

        // Find the user and push the new alarm's ObjectId into their alarms array
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.alarms.push(newAlarm._id);
        await user.save();

        res.status(201).json({ message: "Alarm created successfully", alarm: newAlarm });
    } catch (error) {
        console.error("Error creating alarm:", error); // Log the error
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get all alarms for a user
export const getAlarmsByUser = async (req, res) => {
    const { userId } = req.params;

    try {
        // Validate userId format
        if (!isValidObjectId(userId)) {
            return res.status(400).json({ message: "Invalid user ID format." });
        }

        // Find the user and populate their alarms
        const user = await User.findById(userId).populate('alarms');
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ alarms: user.alarms });
    } catch (error) {
        console.error("Error fetching alarms:", error); // Log the error
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update an existing alarm
export const updateAlarm = async (req, res) => {
    const { alarmId } = req.params;
    const { title, description, time } = req.body;

    // Check if at least one field is provided for update
    if (!title && !description && !time) {
        return res.status(400).json({ message: "At least one field is required to update." });
    }

    try {
        // Validate alarmId format
        if (!isValidObjectId(alarmId)) {
            return res.status(400).json({ message: "Invalid alarm ID format." });
        }

        // Find and update the alarm
        const updatedAlarm = await Alarm.findByIdAndUpdate(
            alarmId,
            { title, description, time },
            { new: true }
        );
        if (!updatedAlarm) return res.status(404).json({ message: "Alarm not found" });

        res.status(200).json({ message: "Alarm updated successfully", alarm: updatedAlarm });
    } catch (error) {
        console.error("Error updating alarm:", error); // Log the error
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete an alarm
export const deleteAlarm = async (req, res) => {
    const { alarmId } = req.params; // Get alarmId from params
    const { userId } = req.body; // Get userId from the request body

    // Check for required user ID
    if (!userId) {
        return res.status(400).json({ message: "User ID is required." });
    }

    try {
        // Validate alarmId format
        if (!isValidObjectId(alarmId)) {
            return res.status(400).json({ message: "Invalid alarm ID format." });
        }

        // Find and delete the alarm
        const deletedAlarm = await Alarm.findByIdAndDelete(alarmId);
        if (!deletedAlarm) return res.status(404).json({ message: "Alarm not found" });

        // Remove the alarm from the user's alarms array
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.alarms.pull(alarmId);
        await user.save();

        res.status(200).json({ message: "Alarm deleted successfully" });
    } catch (error) {
        console.error("Error deleting alarm:", error); // Log the error
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
