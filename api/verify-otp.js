// Access the same OTP store
const otpStore = globalThis.otpStore || (globalThis.otpStore = {});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { otp } = req.body;

        if (!otp) {
            return res.status(400).json({ error: 'OTP is required' });
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
            return res.status(401).json({ error: 'Invalid OTP' });
        }

        // Clear OTP after successful verification
        delete otpStore.otp;
        delete otpStore.expiry;

        // Generate a simple session token
        const sessionToken = Buffer.from(`${Date.now()}-${Math.random()}`).toString('base64');

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
