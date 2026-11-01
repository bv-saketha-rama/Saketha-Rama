// Closes the last panel.
const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-[clamp(1.75rem,5vh,3rem)] pt-5 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted">
            <p>© {currentYear} Saketha Rama. All rights reserved.</p>
            <a href="https://github.com/bv-saketha-rama/Saketha-Rama" target="_blank" rel="noopener noreferrer" className="hover:text-ink">
                Source Code
            </a>
        </footer>
    );
};

export default Footer;
