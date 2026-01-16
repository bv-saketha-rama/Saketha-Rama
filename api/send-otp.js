import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

// Simple in-memory store (Vercel serverless functions are stateless, so we use edge config or KV in production)
// For simplicity, we'll store OTP in a global variable with expiry
const otpStore = globalThis.otpStore || (globalThis.otpStore = {});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes

        // Store OTP with expiry
        otpStore.otp = otp;
        otpStore.expiry = expiry;

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
            return res.status(500).json({ error: 'Failed to send OTP' });
        }

        return res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Send OTP error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
