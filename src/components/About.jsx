import KoiPond from './koi/KoiPond';
import { socialLinks, isExternal } from '../data/socialLinks';
import SocialIcon from './icons/SocialIcon';

const PHRASE = ['make', 'something', 'people', 'want'];

// The intro keeps to the essentials; Connect has the full list.
const HERO_LINKS = ['github', 'email', 'linkedin', 'x'].map((id) => socialLinks.find((link) => link.id === id));

// The first panel: intro in a column set in from the left (~14% in, ~30% wide)
// over a koi pond that fills the whole panel, up behind the header too. Sizes
// follow the viewport width so the proportions hold on any screen.
const About = () => (
    <section id="about" className="hero" aria-label="About me">
        <div className="relative z-10 flex h-full flex-col px-[var(--gutter)] pt-[calc(var(--header-h)+3rem)] md:flex-row md:items-center md:pl-[14vw] md:pt-[var(--header-h)]">
            <div data-pond-focus className="hero-text max-w-[36rem] md:max-w-none md:w-[max(26rem,30vw)]">
                <p className="font-display text-xl md:text-[clamp(1.25rem,1.5vw,1.9rem)] font-semibold tracking-[-0.02em] text-ink">Hi, I&apos;m Saketha</p>
                <span className="block w-7 h-[2px] bg-yc mt-3 mb-6 md:mb-[clamp(1.5rem,2.2vw,2.75rem)]" aria-hidden="true" />
                <h1 className="font-display text-[clamp(1.6rem,2.25vw,2.9rem)] font-semibold leading-[1.22] tracking-[-0.025em] text-ink">
                    I&apos;m a passionate software engineer with 1.5+ years of experience driven by a simple idea:{' '}
                    <a href="https://www.ycombinator.com" target="_blank" rel="noopener noreferrer" className="yc-phrase">
                        {PHRASE.map((word, i) => (
                            <span key={word}>
                                <span className="w">
                                    {word}
                                    {i === PHRASE.length - 1 && '.'}
                                </span>
                                {i < PHRASE.length - 1 && ' '}
                            </span>
                        ))}
                    </a>
                </h1>
                <ul className="mt-8 md:mt-[clamp(2rem,2.6vw,3.25rem)] flex flex-wrap gap-x-[clamp(1.25rem,1.4vw,1.75rem)] gap-y-3" aria-label="Elsewhere">
                    {HERO_LINKS.map((link) => (
                        <li key={link.id}>
                            <a
                                href={link.url}
                                {...(isExternal(link.url) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                className="group inline-flex items-center gap-2 text-sm md:text-[clamp(0.875rem,0.92vw,1.125rem)] text-muted hover:text-ink"
                            >
                                <SocialIcon id={link.id} size={17} className="transition-colors group-hover:text-accent" />
                                {link.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
        <KoiPond className="pond" />
    </section>
);

export default About;
