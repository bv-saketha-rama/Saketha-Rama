import { Github, Linkedin, Mail, Twitter, Sun, Moon } from 'lucide-react';
import HashnodeIcon from './icons/HashnodeIcon';

const Header = ({ toggleTheme, isDark }) => {
    return (
        <header className="sticky top-0 z-50 bg-[var(--color-bg)] border-b border-[var(--color-border)] backdrop-blur-sm bg-opacity-80">
            <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-12">
                <a href="/" className="font-bold text-xl text-[var(--color-text)] hover:no-underline whitespace-nowrap">
                    Saketha Rama
                </a>

                <div className="flex items-center gap-4 md:gap-8">
                    <div className="hidden xl:flex items-center gap-6">
                        <a href="#about" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] whitespace-nowrap">About Me</a>
                        <a href="#experience" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] whitespace-nowrap">Experience & Education</a>
                        <a href="#opensource" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] whitespace-nowrap">Open Source Contributions</a>
                        <a href="#projects" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] whitespace-nowrap">Projects</a>
                        <a href="#writing" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] whitespace-nowrap">Writing</a>
                        <a href="#research" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] whitespace-nowrap">Research</a>
                    </div>

                    <div className="flex items-center gap-3 border-l border-[var(--color-border)] pl-4">
                        <a href="https://github.com/bv-saketha-rama" target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]" title="GitHub">
                            <Github size={18} />
                        </a>
                        <a href="https://www.linkedin.com/in/saketha-rama-5b93a81b9/" target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]" title="LinkedIn">
                            <Linkedin size={18} />
                        </a>
                        <a href="https://x.com/SakethaRama1809" target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]" title="X (Twitter)">
                            <Twitter size={18} />
                        </a>
                        <a href="https://hashnode.com/@saketha-rama" target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]" title="Hashnode">
                            <HashnodeIcon size={18} />
                        </a>
                        <a href="mailto:sakethram9999@gmail.com" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]" title="Gmail">
                            <Mail size={18} />
                        </a>

                        <button
                            onClick={toggleTheme}
                            className="p-2 ml-2 rounded-full hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
                            aria-label="Toggle Theme"
                        >
                            {isDark ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
