import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';

const LectureToNotes = () => {
    const [file, setFile] = useState(null);
    const [transcription, setTranscription] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Define API URL based on environment
    const API_URL =
        import.meta.env.MODE === 'development'
            ? 'http://localhost:5000/api/lecture2notes/upload'
            : '/api/lecture2notes/upload';

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setTranscription('');
        setNotes('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(API_URL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setTranscription(response.data.transcription);
            setNotes(response.data.notes);
        } catch (error) {
            console.error('Error uploading file:', error);
            setError('An error occurred during file upload. Please try again.');
        } finally {
            setLoading(false);
            // Optionally reset form
            // setFile(null);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="dark:bg-gray-900 dark:text-gray-100 min-h-screen flex justify-center items-center p-8"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="max-w-3xl w-full bg-gray-800 rounded-lg p-6 shadow-lg"
            >
                <h1 className="text-3xl font-semibold mb-6 text-center text-green-400">
                    Upload Lecture to Convert to Notes
                </h1>
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <input 
                        type="file" 
                        accept=".mp3" 
                        onChange={handleFileChange}
                        className="text-gray-100 w-full text-sm border border-gray-600 rounded-lg p-2 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                        required 
                    />
                    <motion.button 
                        type="submit"
                        disabled={!file || loading}
                        className={`w-full bg-green-400 hover:bg-green-500 text-gray-900 py-2 px-4 rounded-lg font-semibold transition-all duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? <Loader className="w-5 h-5 animate-spin" /> : 'Upload and Convert'}
                    </motion.button>
                </form>

                {error && (
                    <p className="text-red-500 mt-4 text-center font-semibold">
                        {error}
                    </p>
                )}

                {transcription && (
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold mb-2 text-green-400">Transcription</h2>
                        <p className="bg-gray-700 p-4 rounded-lg text-sm leading-relaxed whitespace-pre-wrap">
                            {transcription}
                        </p>
                    </div>
                )}

                {notes && (
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold mb-2 text-green-400">Generated Notes</h2>
                        <p className="bg-gray-700 p-4 rounded-lg text-sm leading-relaxed whitespace-pre-wrap">
                            {notes}
                        </p>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

export default LectureToNotes;
