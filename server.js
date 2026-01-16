import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import sendOtpHandler from './api/send-otp.js';
import verifyOtpHandler from './api/verify-otp.js';
import path from 'path';
import { fileURLToPath } from 'url';



const app = express();
const PORT = 3000;

app.use(cors());
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

app.post('/api/send-otp', adaptHandler(sendOtpHandler));
app.post('/api/verify-otp', adaptHandler(verifyOtpHandler));

app.listen(PORT, () => {
    console.log(`Development backend running at http://localhost:${PORT}`);
});
