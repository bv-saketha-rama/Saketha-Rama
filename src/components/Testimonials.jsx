import { MessageCircle } from 'lucide-react';
import BrandLogo from './icons/BrandIcons';

// Playful, fictional reviews from AI coding tools.
const testimonials = [
    { brand: 'claude', name: 'Claude Code', handle: '@claudecode', quote: "He said it was a small change. We're on our fourth architecture redesign." },
    { brand: 'codex', name: 'Codex', handle: '@codex', quote: 'He reviews my code like I personally offended him. Then asks me to write the tests.' },
    { brand: 'cursor', name: 'Cursor', handle: '@cursor_ai', quote: "I've seen his side projects have side projects. At this point, I'm just managing tabs." },
    { brand: 'pi', name: 'Pi', handle: '@pi', quote: 'Finally, someone who appreciates a terminal. Unfortunately, he still wants to build an entire startup in it.' },
    { brand: 'copilot', name: 'GitHub Copilot', handle: '@githubcopilot', quote: 'I suggested one line. He rewrote the whole function. We have trust issues.' },
];

const Card = ({ brand, name, handle, quote }) => {
    return (
        <figure className="testimonial card w-[300px] sm:w-[360px] shrink-0 p-5 flex flex-col gap-4">
            <figcaption className="flex items-center gap-3">
                <BrandLogo brand={brand} />
                <span className="min-w-0 flex-1 leading-tight">
                    <span className="block font-display font-semibold text-ink">{name}</span>
                    <span className="block text-[0.8rem] text-muted truncate">{handle} · AI coworker</span>
                </span>
                <MessageCircle size={16} className="text-muted shrink-0" aria-hidden="true" />
            </figcaption>
            <blockquote className="text-[0.95rem] leading-relaxed text-ink">&ldquo;{quote}&rdquo;</blockquote>
        </figure>
    );
};

const Testimonials = () => (
    <section id="testimonials" className="section" aria-labelledby="testimonials-title">
        <header className="mb-10">
            <p className="meta mb-3">unsolicited, entirely fictional reviews</p>
            <h2 id="testimonials-title" className="text-[clamp(1.75rem,3.2vw,2.5rem)]">
                Here&apos;s what my colleagues say about me
            </h2>
        </header>

        <div className="marquee">
            <div className="marquee-track">
                {[0, 1].map((copy) => (
                    <div key={copy} className="marquee-group" aria-hidden={copy === 1 ? 'true' : undefined}>
                        {testimonials.map((t) => (
                            <Card key={t.brand} {...t} />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default Testimonials;
