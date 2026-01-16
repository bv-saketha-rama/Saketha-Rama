import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import sendOtpHandler from './api/send-otp.js';
import verifyOtpHandler from './api/verify-otp.js';
import path from 'path';
import { fileURLToPath } from 'url';



// Use Vercel KV
import { kv } from '@vercel/kv';

const validateSession = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized: Missing or invalid token format' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }

        // Validate against KV
        const isValid = await kv.get(`session:${token}`);
        if (!isValid) {
            return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
        }

        next();
    } catch (error) {
        console.error('Session validation error:', error);
        return res.status(500).json({ error: 'Internal server error during auth' });
    }
};

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

// Protected route example / session check
app.get('/api/check-session', cors(corsOptions), validateSession, (req, res) => {
    res.json({ valid: true, message: 'Session is active' });
});

app.listen(PORT, () => {
    console.log(`Development backend running at http://localhost:${PORT}`);
});
