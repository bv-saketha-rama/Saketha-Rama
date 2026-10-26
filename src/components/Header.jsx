import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import SocialIcon from './icons/SocialIcon';
import { socialLinks, isExternal } from '../data/socialLinks';

const navLinks = [
    { href: '#about', label: 'About Me' },
    { href: '#experience', label: 'Experience & Education' },
    { href: '#opensource', label: 'Open Source Contributions' },
    { href: '#projects', label: 'Projects' },
    { href: '#writing', label: 'Writing' },
    { href: '#research', label: 'Research' },
];

const Header = () => {
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const [active, setActive] = useState('#about');

    useEffect(() => {
        const sections = navLinks.map((l) => document.querySelector(l.href)).filter(Boolean);
        const io = new IntersectionObserver(
            (entries) => {
                for (const e of entries) if (e.isIntersecting) setActive(`#${e.target.id}`);
            },
            { rootMargin: '-45% 0px -50% 0px' },
        );
        sections.forEach((s) => io.observe(s));
        return () => io.disconnect();
    }, []);

    useEffect(() => {
        document.body.style.overflow = isMobileNavOpen ? 'hidden' : '';
        const onKey = (e) => e.key === 'Escape' && setIsMobileNavOpen(false);
        window.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', onKey);
        };
    }, [isMobileNavOpen]);

    const closeMobileNav = () => setIsMobileNavOpen(false);

    return (
        <header className="sticky top-0 z-50 h-[var(--header-h)] bg-bg border-b border-line">
            <nav className="max-w-page h-full mx-auto px-[var(--gutter)] flex items-center justify-between gap-8" aria-label="Primary">
                <a href="#about" className="font-display font-bold text-[1.05rem] tracking-[-0.02em] text-ink whitespace-nowrap">
                    Saketha Rama
                </a>

                <ul className="hidden xl:flex items-center gap-7">
                    {navLinks.map((link) => (
                        <li key={link.href}>
                            <a
                                href={link.href}
                                aria-current={active === link.href ? 'true' : undefined}
                                className={`nav-link text-sm whitespace-nowrap ${active === link.href ? 'text-ink' : 'text-muted hover:text-ink'}`}
                            >
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>

                <button
                    type="button"
                    onClick={() => setIsMobileNavOpen((v) => !v)}
                    className="xl:hidden -mr-2 p-2 rounded-full text-muted hover:text-ink"
                    aria-label={isMobileNavOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={isMobileNavOpen}
                    aria-controls="mobile-nav"
                >
                    {isMobileNavOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </nav>

            {isMobileNavOpen && (
                <div id="mobile-nav" className="xl:hidden fixed inset-x-0 bottom-0 top-[var(--header-h)] z-50 bg-bg overflow-y-auto">
                    <div className="max-w-page mx-auto px-[var(--gutter)] py-8">
                        <ul className="border-t border-line">
                            {navLinks.map((link, i) => (
                                <li key={link.href} className="border-b border-line">
                                    <a
                                        href={link.href}
                                        onClick={closeMobileNav}
                                        aria-current={active === link.href ? 'true' : undefined}
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
