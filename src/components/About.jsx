import { useRef } from 'react';
import KoiPond from './koi/KoiPond';
import { socialLinks, isExternal } from '../data/socialLinks';
import SocialIcon from './icons/SocialIcon';

const PHRASE = ['building', 'something', 'that', 'people', 'want'];

// The hero: intro in the left column (~40%), a koi pond filling the rest.
const About = () => {
    const textRef = useRef(null);

    return (
        <section id="about" className="hero relative flex flex-col pt-12 md:flex-row md:items-center md:py-0">
            <div ref={textRef} className="relative z-10 max-w-[36rem] md:max-w-none md:w-[48%] lg:w-[40%] md:py-16">
                <p className="font-display text-xl md:text-2xl font-semibold tracking-[-0.02em] text-ink">Hi, I&apos;m Saketha</p>
                <span className="block w-7 h-[2px] bg-yc mt-3 mb-6" aria-hidden="true" />
                <h1 className="font-display text-[clamp(1.6rem,2.4vw,2.1rem)] font-semibold leading-[1.22] tracking-[-0.025em] text-ink">
                    I&apos;m a passionate software engineer with 1.5+ years of experience driven by the motivation of{' '}
                    <a href="https://www.ycombinator.com" target="_blank" rel="noopener noreferrer" className="yc-phrase">
                        {PHRASE.map((word, i) => (
                            <span key={word}>
                                <span className="w">
                                    {i === 0 && <span className="q">&apos;</span>}
                                    {word}
                                    {i === PHRASE.length - 1 && <span className="q">&apos;.</span>}
                                </span>
                                {i < PHRASE.length - 1 && ' '}
                            </span>
                        ))}
                    </a>
                </h1>
                <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-3" aria-label="Elsewhere">
                    {socialLinks.map((link) => (
                        <li key={link.id}>
                            <a
                                href={link.url}
                                {...(isExternal(link.url) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                className="group inline-flex items-center gap-2 text-sm text-muted hover:text-ink"
                            >
                                <SocialIcon id={link.id} size={16} className="transition-colors group-hover:text-accent" />
                                {link.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
            <KoiPond avoidRef={textRef} className="pond" />
        </section>
    );
};

export default About;
