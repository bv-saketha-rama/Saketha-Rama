const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-line">
            <div className="max-w-page mx-auto px-[var(--gutter)] py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted">
                <p>© {currentYear} Saketha Rama. All rights reserved.</p>
                <a href="https://github.com/bv-saketha-rama/Saketha-Rama" target="_blank" rel="noopener noreferrer" className="hover:text-ink">
                    Source Code
                </a>
            </div>
        </footer>
    );
};

export default Footer;
