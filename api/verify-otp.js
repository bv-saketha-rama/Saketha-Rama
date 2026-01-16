// Access the same OTP store
const otpStore = globalThis.otpStore || (globalThis.otpStore = {});
import crypto from 'crypto';

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { otp } = req.body;

        if (!otp) {
            return res.status(400).json({ error: 'OTP is required' });
        }

        // Check for lockout
        if (otpStore.lockUntil && Date.now() < otpStore.lockUntil) {
            return res.status(429).json({ error: 'Too many failed attempts. Please try again later.' });
        }

        // Check if OTP exists and is valid
        if (!otpStore.otp || !otpStore.expiry) {
            return res.status(400).json({ error: 'No OTP requested. Please request a new one.' });
        }

        // Check expiry
        if (Date.now() > otpStore.expiry) {
            delete otpStore.otp;
            delete otpStore.expiry;
            return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
        }

        // Verify OTP
        if (otp !== otpStore.otp) {
            otpStore.attempts = (otpStore.attempts || 0) + 1;

            if (otpStore.attempts >= MAX_ATTEMPTS) {
                otpStore.lockUntil = Date.now() + LOCKOUT_MS;
                delete otpStore.otp;
                delete otpStore.expiry;
                delete otpStore.attempts;
                return res.status(429).json({ error: 'Too many failed attempts. Account locked for 15 minutes.' });
            }

            return res.status(401).json({ error: 'Invalid OTP' });
        }

        // Clear OTP and attempts after successful verification
        delete otpStore.otp;
        delete otpStore.expiry;
        delete otpStore.attempts;
        delete otpStore.lockUntil;

        // Generate a secure session token
        const sessionToken = crypto.randomBytes(32).toString('hex');

        return res.status(200).json({
            success: true,
            message: 'Authentication successful',
            token: sessionToken
        });
    } catch (error) {
        console.error('Verify OTP error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
