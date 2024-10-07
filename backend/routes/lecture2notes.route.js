import express from 'express';
import multer from 'multer';
import { uploadAndTranscribe } from '../controllers/lecture2notes.controller.js';

const router = express.Router();

// Multer setup for file upload
const upload = multer({ dest: 'uploads/' });

// POST route to upload MP3 file and process transcription
router.post('/upload', upload.single('file'), uploadAndTranscribe);

export default router;
