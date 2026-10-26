import profile from '../assets/profile.jpg';
import { socialLinks, isExternal } from '../data/socialLinks';
import SocialIcon from './icons/SocialIcon';

const PHRASE = ['building', 'something', 'that', 'people', 'want'];

// The hero: photo on the left, intro on the right.
const About = () => (
    <section id="about" className="py-14 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] items-center gap-10 md:gap-14">
            <img
                src={profile}
                alt="Saketha Rama speaking at Unfold 2023"
                width="488"
                height="488"
                className="w-40 h-40 md:w-60 md:h-60 rounded-full object-cover border border-line"
            />
            <div className="max-w-[40rem]">
                <p className="font-display text-xl md:text-2xl font-semibold tracking-[-0.02em] text-ink mb-4">Hi, I&apos;m Saketha</p>
                <h1 className="font-display text-[clamp(1.6rem,2.8vw,2.35rem)] font-semibold leading-[1.22] tracking-[-0.025em] text-ink">
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
        </div>
    </section>
);

export default About;
