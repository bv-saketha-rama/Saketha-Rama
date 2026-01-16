import { Resend } from 'resend';
import crypto from 'crypto';

const resendApiKey = process.env.RESEND_API_KEY;
// Only initialize Resend if key looks real (not placeholder)
const resend = (resendApiKey && resendApiKey !== 'your_resend_api_key_here')
    ? new Resend(resendApiKey)
    : null;

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

// Simple in-memory store
const otpStore = globalThis.otpStore || (globalThis.otpStore = {});
const otpThrottle = globalThis.otpThrottle || (globalThis.otpThrottle = new Map());
const COOLDOWN_MS = 60000; // 60 seconds

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const lastSent = otpThrottle.get(clientIp);

    if (lastSent && Date.now() - lastSent < COOLDOWN_MS) {
        return res.status(429).json({ error: 'Too many requests, try again later' });
    }

    try {
        // Generate secure 6-digit OTP
        const otp = crypto.randomInt(100000, 1000000).toString();
        const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes

        // Store OTP with expiry
        otpStore.otp = otp;
        otpStore.expiry = expiry;

        // Update throttle
        otpThrottle.set(clientIp, Date.now());

        // If no valid Resend key, just log it (Dev Mode)
        if (!resend) {
            console.log('================================================');
            console.log(`[DEV MODE] OTP Generated for ${ADMIN_EMAIL}: ${otp}`);
            console.log('================================================');

            // Simulating a delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            return res.status(200).json({
                success: true,
                message: 'OTP sent (Check console for Dev Mode)'
            });
        }

        // Send email via Resend
        const { error } = await resend.emails.send({
            from: 'Portfolio Admin <onboarding@resend.dev>',
            to: ADMIN_EMAIL,
            subject: 'Your Portfolio Admin OTP',
            html: `
                <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #333;">Portfolio Admin Access</h2>
                    <p>Your one-time password is:</p>
                    <div style="background: #f0f0f0; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; border-radius: 8px;">
                        ${otp}
                    </div>
                    <p style="color: #666; font-size: 14px; margin-top: 20px;">
                        This OTP expires in 5 minutes. Do not share it with anyone.
                    </p>
                </div>
            `,
        });

        if (error) {
            console.error('Email error:', error);
            // Fallback for demo purposes if email fails
            console.log('================================================');
            console.log(`[FALLBACK] Email failed. OTP is: ${otp}`);
            console.log('================================================');
            return res.status(200).json({ success: true, message: 'OTP generated (Email failed, check console)' });
        }

        return res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Send OTP error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
