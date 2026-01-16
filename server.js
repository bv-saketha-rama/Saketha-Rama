import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import sendOtpHandler from './api/send-otp.js';
import verifyOtpHandler from './api/verify-otp.js';
import path from 'path';
import { fileURLToPath } from 'url';



const app = express();
const PORT = 3000;

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};

// app.use(cors()); // Global CORS removed
app.use(express.json());

// Mimic Vercel serverless function behavior
const adaptHandler = (handler) => async (req, res) => {
    try {
        await handler(req, res);
    } catch (error) {
        console.error(error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

app.post('/api/send-otp', cors(corsOptions), adaptHandler(sendOtpHandler));
app.post('/api/verify-otp', cors(corsOptions), adaptHandler(verifyOtpHandler));

app.listen(PORT, () => {
    console.log(`Development backend running at http://localhost:${PORT}`);
});
