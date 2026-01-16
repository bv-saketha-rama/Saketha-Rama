import { useState } from 'react';
import { Lock } from 'lucide-react';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

const AdminLogin = ({ onLogin }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            onLogin();
            setError('');
        } else {
            setError('Incorrect password');
            setPassword('');
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center px-6">
            <div className="w-full max-w-md">
                <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-[2.5rem] p-8">
                    <div className="flex items-center justify-center mb-8">
                        <div className="p-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-full">
                            <Lock className="text-[var(--color-accent)]" size={32} />
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-center text-[var(--color-text)] mb-2">
                        Admin Access
                    </h1>
                    <p className="text-center text-[var(--color-text-secondary)] mb-8">
                        Enter password to manage content
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                className="w-full px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                                autoFocus
                            />
                            {error && (
                                <p className="mt-2 text-sm text-red-500">{error}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full px-6 py-3 bg-[var(--color-accent)] text-white font-medium rounded-2xl hover:opacity-90 transition-opacity"
                        >
                            Login
                        </button>
                    </form>

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
