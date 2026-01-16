import { useState } from 'react';
import { Lock, Mail, Loader2 } from 'lucide-react';

const AdminLogin = ({ onLogin }) => {
    const [step, setStep] = useState('request'); // 'request' | 'verify'
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send OTP');
            }

            setMessage(data.message || 'OTP sent to your email!');
            setStep('verify');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();

        if (!otp || otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ otp }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Invalid OTP');
            }

            // Store token securely
            sessionStorage.setItem('adminToken', data.token);
            onLogin(data.token);
        } catch (err) {
            setError(err.message);
            setOtp('');
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)] transition-colors text-center text-2xl tracking-[0.5em]";
    const btnClass = "w-full px-6 py-3 bg-[var(--color-accent)] text-white font-medium rounded-2xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";

    return (
        <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center px-6">
            <div className="w-full max-w-md">
                <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-[2.5rem] p-8">
                    <div className="flex items-center justify-center mb-8">
                        <div className="p-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-full">
                            {step === 'request' ? (
                                <Mail className="text-[var(--color-accent)]" size={32} />
                            ) : (
                                <Lock className="text-[var(--color-accent)]" size={32} />
                            )}
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-center text-[var(--color-text)] mb-2">
                        Admin Access
                    </h1>
                    <p className="text-center text-[var(--color-text-secondary)] mb-8">
                        {step === 'request'
                            ? 'Request a one-time password to access the admin panel'
                            : 'Enter the OTP sent to your email'
                        }
                    </p>

                    {step === 'request' ? (
                        <form onSubmit={handleRequestOTP} className="space-y-6">
                            {message && (
                                <p className="text-sm text-green-500 text-center">{message}</p>
                            )}
                            {error && (
                                <p className="text-sm text-red-500 text-center">{error}</p>
                            )}
                            <button type="submit" disabled={loading} className={btnClass}>
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Sending...
                                    </>
                                ) : (
                                    'Send OTP to Email'
                                )}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOTP} className="space-y-6">
                            <div>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder="000000"
                                    maxLength={6}
                                    className={inputClass}
                                    autoFocus
                                />
                                {error && (
                                    <p className="mt-2 text-sm text-red-500 text-center">{error}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading || otp.length !== 6}
                                className={btnClass}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Verifying...
                                    </>
                                ) : (
                                    'Verify OTP'
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => { setStep('request'); setOtp(''); setError(''); setMessage(''); }}
                                className="w-full text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
                            >
                                Request new OTP
                            </button>
                        </form>
                    )}

                    <div className="mt-6 text-center">
                        <a
                            href="/"
                            className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
                        >
                            ← Back to Portfolio
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
