import { useState } from 'react';
import { Github, Linkedin, Mail, Twitter, Sun, Moon, Menu, X } from 'lucide-react';
import HashnodeIcon from './icons/HashnodeIcon';

const Header = ({ toggleTheme, isDark }) => {
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

    const toggleMobileNav = () => setIsMobileNavOpen(!isMobileNavOpen);

    const closeMobileNav = () => setIsMobileNavOpen(false);

    const navLinks = [
        { href: "#about", label: "About Me" },
        { href: "#experience", label: "Experience & Education" },
        { href: "#opensource", label: "Open Source Contributions" },
        { href: "#projects", label: "Projects" },
        { href: "#writing", label: "Writing" },
        { href: "#research", label: "Research" }
    ];

    return (
        <header className="sticky top-0 z-50 bg-[var(--color-bg)] border-b border-[var(--color-border)] backdrop-blur-sm bg-opacity-80">
            <nav className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4 md:gap-12">
                <a href="/" className="font-bold text-xl text-[var(--color-text)] hover:no-underline whitespace-nowrap z-50">
                    Saketha Rama
                </a>

                <div className="flex items-center gap-2 md:gap-8">
                    {/* Desktop Navigation */}
                    <div className="hidden xl:flex items-center gap-6">
                        {navLinks.map(link => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] whitespace-nowrap"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 border-l border-[var(--color-border)] pl-3 sm:pl-4 z-50">
                        <a href="https://github.com/bv-saketha-rama" target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hidden sm:block" title="GitHub">
                            <Github size={18} />
                        </a>
                        <a href="https://www.linkedin.com/in/saketha-rama-5b93a81b9/" target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hidden sm:block" title="LinkedIn">
                            <Linkedin size={18} />
                        </a>
                        <a href="https://x.com/SakethaRama1809" target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hidden sm:block" title="X (Twitter)">
                            <Twitter size={18} />
                        </a>
                        <a href="https://hashnode.com/@saketha-rama" target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hidden sm:block" title="Hashnode">
                            <HashnodeIcon size={18} />
                        </a>
                        <a href="mailto:sakethram9999@gmail.com" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hidden sm:block" title="Gmail">
                            <Mail size={18} />
                        </a>

                        <button
                            onClick={toggleTheme}
                            className="p-2 ml-1 sm:ml-2 rounded-full hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
                            aria-label="Toggle Theme"
                        >
                            {isDark ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        {/* Hamburger Button */}
                        <button
                            onClick={toggleMobileNav}
                            className="p-2 ml-1 sm:ml-2 rounded-full xl:hidden hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
                            aria-label={isMobileNavOpen ? "Close menu" : "Open menu"}
                            aria-expanded={isMobileNavOpen}
                        >
                            {isMobileNavOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Navigation Overlay */}
            {isMobileNavOpen && (
                <div className="fixed inset-0 z-40 bg-[var(--color-bg)] flex flex-col justify-center items-center xl:hidden mt-16">
                    <div className="flex flex-col items-center gap-8 p-6 w-full" role="menu">
                        {navLinks.map(link => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={closeMobileNav}
                                className="text-xl font-medium text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors"
                                role="menuitem"
                            >
                                {link.label}
                            </a>
                        ))}

                        <div className="flex gap-6 mt-8 pt-8 border-t border-[var(--color-border)] w-full justify-center">
                            <a href="https://github.com/bv-saketha-rama" target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]" title="GitHub">
                                <Github size={24} />
                            </a>
                            <a href="https://www.linkedin.com/in/saketha-rama-5b93a81b9/" target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]" title="LinkedIn">
                                <Linkedin size={24} />
                            </a>
                            <a href="https://x.com/SakethaRama1809" target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]" title="X (Twitter)">
                                <Twitter size={24} />
                            </a>
                            <a href="https://hashnode.com/@saketha-rama" target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]" title="Hashnode">
                                <HashnodeIcon size={24} />
                            </a>
                            <a href="mailto:sakethram9999@gmail.com" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]" title="Gmail">
                                <Mail size={24} />
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
