import { ArrowUpRight } from 'lucide-react';
import SectionShell from './SectionShell';
import SocialIcon from './icons/SocialIcon';
import Testimonials from './Testimonials';
import Footer from './Footer';
import { socialLinks, isExternal } from '../data/socialLinks';

const Connect = () => (
    <SectionShell id="connect" index="07" title="Connect">
        <p className="max-w-2xl text-[1.02rem] leading-relaxed">
            I&apos;m always open to discussing new projects, opportunities, or just having a chat
            about technology. Feel free to reach out!
        </p>

        <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-px bg-line border border-line rounded-xl overflow-hidden">
            {socialLinks.map((link) => (
                <li key={link.id} className="bg-surface">
                    <a
                        href={link.url}
                        {...(isExternal(link.url) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        className="group relative flex items-center gap-4 px-5 py-4 h-full hover:bg-bg lg:flex-col lg:items-start lg:gap-3 lg:px-4"
                    >
                        <SocialIcon id={link.id} size={18} className="text-muted transition-colors group-hover:text-accent" />
                        <span className="min-w-0 flex-1">
                            <span className="block font-medium text-ink">{link.name}</span>
                            <span className="block text-xs text-muted">{link.description}</span>
                        </span>
                        <ArrowUpRight size={15} className="text-muted opacity-0 transition-opacity group-hover:opacity-100 lg:absolute lg:right-3 lg:top-3" aria-hidden="true" />
                    </a>
                </li>
            ))}
        </ul>

        <div className="mt-[clamp(1.75rem,5vh,3rem)]">
            <Testimonials />
        </div>

        <Footer />
    </SectionShell>
);

export default Connect;
