// Use Vercel KV
import { kv } from '@vercel/kv';
import crypto from 'crypto';

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60; // 15 minutes in seconds for KV

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
        const isLocked = await kv.exists('admin_lockout');
        if (isLocked) {
            return res.status(429).json({ error: 'Too many failed attempts. Please try again later.' });
        }

        // Retrieve stored OTP
        const storedOtp = await kv.get('admin_otp');

        // Check if OTP exists
        if (!storedOtp) {
            return res.status(400).json({ error: 'OTP expired or not requested. Request a new one.' });
        }

        // Verify OTP
        // Ensure string comparison
        if (String(otp) !== String(storedOtp)) {
            // Increment attempts
            const attempts = await kv.incr('admin_otp_attempts');
            // Set expiry on attempts key if new (e.g., 15 mins window)
            if (attempts === 1) await kv.expire('admin_otp_attempts', 900);

            if (attempts >= MAX_ATTEMPTS) {
                // Lockout
                await kv.set('admin_lockout', 'true', { ex: LOCKOUT_MS });
                await kv.del('admin_otp', 'admin_otp_attempts');
                return res.status(429).json({ error: 'Too many failed attempts. Account locked for 15 minutes.' });
            }

            return res.status(401).json({ error: 'Invalid OTP' });
        }

        // Clear OTP and attempts after successful verification
        await kv.del('admin_otp', 'admin_otp_attempts', 'admin_lockout');

        // Generate a secure session token
        const sessionToken = crypto.randomBytes(32).toString('hex');

        // Store session token for 1 hour (3600 seconds)
        // We can verify this token in middleware later
        await kv.set(`session:${sessionToken}`, 'valid', { ex: 3600 });


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
