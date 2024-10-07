import axios from 'axios';
import multer from 'multer';
import { RevAiApiClient } from 'revai-node-sdk';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load environment variables
dotenv.config();
const { REV_ACCESS_TOKEN, GEMINI_API_KEY_FOR_L2NOTES } = process.env;

// Check if required environment variables are set
if (!REV_ACCESS_TOKEN || !GEMINI_API_KEY_FOR_L2NOTES) {
    console.error('Missing required environment variables.');
    process.exit(1); // Exit the process if environment variables are missing
}

// Setup Rev.ai client using the environment variable
const revaiClient = new RevAiApiClient(REV_ACCESS_TOKEN);

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

// Initialize the Google Generative AI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY_FOR_L2NOTES);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro-002",
    systemInstruction: "You are a highly intelligent note-taking assistant designed to transform transcriptions of lectures into comprehensive, organized, and easy-to-read notes. Your task is to extract key concepts, summarize important information, and structure the notes in a logical format, including headings, bullet points, and highlights of critical points. If any information provided in the transcription is incorrect, identify the inaccuracies and correct them accordingly. Ensure that the notes are clear, concise, and suitable for studying, allowing users to quickly grasp the main ideas and details of the lecture.",
});

// Generation configuration
const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

// Upload MP3 file, send to Rev.ai for transcription, and call Google Gemini Studio
export const uploadAndTranscribe = async (req, res) => {
    try {
        // Check if a file is uploaded
        if (!req.file) {
            console.error('No file uploaded');
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Step 1: Upload the MP3 file
        const { path: filePath } = req.file;
        console.log(`File uploaded: ${filePath}`);

        // Step 2: Send the file to Rev.ai for transcription
        const job = await revaiClient.submitJobLocalFile(filePath, { skip_diarization: true });
        console.log(`Transcription job submitted. Job ID: ${job.id}`);

        // Wait for the job to finish
        const transcriptJob = await new Promise((resolve, reject) => {
            const checkJob = async () => {
                try {
                    const jobStatus = await revaiClient.getJobDetails(job.id);
                    console.log(`Checking job status... Current status: ${jobStatus.status}`);
                    
                    if (jobStatus.status === 'transcribed') {
                        console.log(`Job completed. Fetching transcript...`);
                        resolve(await revaiClient.getTranscriptObject(job.id));
                    } else if (jobStatus.status === 'failed') {
                        console.error('Transcription job failed:', jobStatus.failure_details || 'No additional details');
                        reject(new Error('Transcription job failed'));
                    } else {
                        setTimeout(checkJob, 5000); // Check status every 5 seconds
                    }
                } catch (error) {
                    console.error('Error checking job status:', error);
                    reject(error);
                }
            };
            checkJob();
        });

        // Step 3: Extract transcription from Rev.ai's response
        const transcription = transcriptJob.monologues.map(({ elements }) =>
            elements.map(({ value }) => value).join(' ')
        ).join(' ');

        // Log the transcription to the console
        console.log('Transcription extracted successfully:', transcription);

        // Step 4: Send the transcription to Google Gemini for conversion into notes
        const chatSession = model.startChat({
            generationConfig,
            history: [
                {
                    role: "user",
                    parts: [{ text: transcription }]
                }
            ],
        });

        const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
        const notes = result.response.text(); // Extract generated notes from the response

        console.log('Notes generated from transcription successfully.');

        // Optional: Clean up the uploaded file to save space
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error deleting the uploaded file:', err);
            } else {
                console.log('Uploaded file deleted successfully.');
            }
        });

        // Step 5: Respond with the formatted notes
        return res.json({
            message: 'Transcription and notes generated successfully',
            transcription,
            notes
        });
    } catch (error) {
        console.error('Error:', error.message);
        return res.status(500).json({ error: 'An error occurred during processing: ' + error.message });
    }
};
