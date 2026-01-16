const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-[var(--color-border)]">
            <div className="max-w-3xl mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[var(--color-text-secondary)]">
                    <p>© {currentYear} Saketha Rama. All rights reserved.</p>

                    <div className="flex gap-6">
                        <a href="https://github.com/bv-saketha-rama" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-text)] transition-colors">Source Code</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
