import { useEffect, useState } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import SocialIcon from './icons/SocialIcon';
import { socialLinks, isExternal } from '../data/socialLinks';

// The initial theme is set on <html> by the inline script in index.html.
const ThemeToggle = () => {
    const [dark, setDark] = useState(() => document.documentElement.dataset.theme === 'dark');

    const toggle = () => {
        const next = dark ? 'light' : 'dark';
        document.documentElement.dataset.theme = next;
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'dark' ? '#0F1013' : '#FAFAF8');
        try {
            localStorage.setItem('theme', next);
        } catch {
            // Storage blocked: the choice just won't be remembered.
        }
        setDark(!dark);
    };

    return (
        <button
            type="button"
            onClick={toggle}
            className="p-2 rounded-full text-muted hover:text-ink transition-colors"
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={dark ? 'Light mode' : 'Dark mode'}
        >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
    );
};

// Fixed over the panels and see-through, so the koi pond on the first panel runs
// up behind it. `links` are the panels; `active` is the one on screen.
const Header = ({ links, active }) => {
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

    useEffect(() => {
        const onKey = (e) => e.key === 'Escape' && setIsMobileNavOpen(false);
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isMobileNavOpen]);

    const closeMobileNav = () => setIsMobileNavOpen(false);

    return (
        <header className={`fixed inset-x-0 top-0 z-50 h-[var(--header-h)] hero-text ${isMobileNavOpen ? 'bg-bg' : ''}`}>
            <nav className="max-w-wide h-full mx-auto px-[var(--gutter)] flex items-center justify-between gap-8 lg:grid lg:grid-cols-[1fr_auto_1fr]" aria-label="Primary">
                <a href="#about" data-pond-focus className="justify-self-start font-display font-bold text-xl tracking-[-0.02em] text-ink whitespace-nowrap">
                    Saketha Rama
                </a>

                <div data-pond-focus className="flex items-center gap-4 xl:gap-7">
                    <ul className="hidden lg:flex items-center gap-7 xl:gap-9">
                        {links.map((link, i) => (
                            <li key={link.id}>
                                <a
                                    href={`#${link.id}`}
                                    aria-current={active === i ? 'true' : undefined}
                                    className={`nav-link text-base font-medium whitespace-nowrap ${active === i ? 'text-ink' : 'text-muted hover:text-ink'}`}
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>

                    <ThemeToggle />

                    <button
                        type="button"
                        onClick={() => setIsMobileNavOpen((v) => !v)}
                        className="lg:hidden -mr-2 p-2 rounded-full text-muted hover:text-ink"
                        aria-label={isMobileNavOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={isMobileNavOpen}
                        aria-controls="mobile-nav"
                    >
                        {isMobileNavOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
                {/* Balances the brand, so the links sit in the middle of the screen. */}
                <span className="hidden lg:block" aria-hidden="true" />
            </nav>

            {isMobileNavOpen && (
                <div id="mobile-nav" className="lg:hidden fixed inset-x-0 bottom-0 top-[var(--header-h)] z-50 bg-bg overflow-y-auto">
                    <div className="max-w-page mx-auto px-[var(--gutter)] py-8">
                        <ul className="border-t border-line">
                            {links.map((link, i) => (
                                <li key={link.id} className="border-b border-line">
                                    <a
                                        href={`#${link.id}`}
                                        onClick={closeMobileNav}
                                        aria-current={active === i ? 'true' : undefined}
                                        className="flex items-baseline gap-4 py-4 font-display text-xl font-semibold text-ink"
                                    >
                                        <span className="meta w-6">0{i + 1}</span>
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-4">
                            {socialLinks.map((link) => (
                                <li key={link.id}>
                                    <a
                                        href={link.url}
                                        {...(isExternal(link.url) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                        className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink"
                                    >
                                        <SocialIcon id={link.id} size={16} />
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
