import { Resend } from 'resend';
import { kv } from '@vercel/kv';
import crypto from 'crypto';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = (resendApiKey && resendApiKey !== 'your_resend_api_key_here')
    ? new Resend(resendApiKey)
    : null;

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const COOLDOWN_MS = 60000; // 60 seconds

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // IP Detection with proxy safety
    const trustProxy = process.env.TRUST_PROXY === 'true';
    let clientIp = req.socket.remoteAddress;

    if (trustProxy && req.headers['x-forwarded-for']) {
        const forwarded = req.headers['x-forwarded-for'].split(',')[0].trim();
        if (forwarded) {
            clientIp = forwarded;
        }
    }
    clientIp = clientIp || 'unknown';

    try {
        // Rate Limiting via KV
        const throttleKey = `otp_throttle:${clientIp}`;
        const isThrottled = await kv.exists(throttleKey);

        if (isThrottled) {
            return res.status(429).json({ error: 'Too many requests, try again later' });
        }

        // Generate secure 6-digit OTP
        const otp = crypto.randomInt(100000, 1000000).toString();

        // Store OTP in KV with 5 minute expiration
        // Key: otp_val:<otp> -> Value: <admin_email>? Or typically verify against something known.
        // Actually, we usually store the OTP *for the user/session*.
        // Since this is a single admin login, we can store it under a fixed key "admin_otp" 
        // OR better, allow concurrent requests but validate specifically.
        // For simple admin: `admin_otp` key is fine.
        await kv.set('admin_otp', otp, { ex: 300 }); // 5 mins

        // Set throttle for IP (60s)
        await kv.set(throttleKey, '1', { ex: 60 });

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
