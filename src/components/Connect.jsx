import { Github, Linkedin, Twitter, Mail, FileText } from 'lucide-react';
import HashnodeIcon from './icons/HashnodeIcon';
import LeetCodeIcon from './icons/LeetCodeIcon';

const socialLinks = [
    {
        name: "GitHub",
        icon: <Github size={20} />,
        url: "https://github.com/bv-saketha-rama",
        description: "Check out my code"
    },
    {
        name: "Resume",
        icon: <FileText size={20} />,
        url: "https://drive.google.com/file/d/1m6jIYbU_qrYiGd7D4E_2xWTlKXHCJHEN/view?usp=sharing",
        description: "Check out my Resume"
    },
    {
        name: "LeetCode",
        icon: <LeetCodeIcon size={20} />,
        url: "https://leetcode.com/u/bv-saketha-rama/",
        description: "check out my DSA skills"
    },
    {
        name: "LinkedIn",
        icon: <Linkedin size={20} />,
        url: "https://www.linkedin.com/in/saketha-rama-5b93a81b9/",
        description: "Let's connect"
    },
    {
        name: "Twitter",
        icon: <Twitter size={20} />,
        url: "https://x.com/SakethaRama1809",
        description: "Follow me"
    },
    {
        name: "Email",
        icon: <Mail size={20} />,
        url: "mailto:sakethram9999@gmail.com",
        description: "Get in touch"
    },
    {
        name: "Hashnode",
        icon: <HashnodeIcon size={20} />,
        url: "https://hashnode.com/@saketha-rama",
        description: "Read my blogs"
    }
];

const Connect = () => {
    return (
        <section id="connect" className="py-12">
            <h2 className="text-2xl font-bold text-[var(--color-text)] mb-6">Connect</h2>

            <p className="text-[var(--color-text-secondary)] mb-6">
                I'm always open to discussing new projects, opportunities, or just having a chat
                about technology. Feel free to reach out!
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {socialLinks.map((link) => (
                    <a
                        key={link.name}
                        href={link.url}
                        target={link.url.startsWith('mailto:') ? undefined : '_blank'}
                        rel={link.url.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                        className="flex items-center gap-3 p-4 border border-[var(--color-border)] rounded-lg hover:border-[var(--color-accent)] hover:no-underline transition-colors"
                    >
                        <span className="text-[var(--color-accent)]">{link.icon}</span>
                        <div>
                            <div className="font-medium text-[var(--color-text)]">{link.name}</div>
                            <div className="text-xs text-[var(--color-text-secondary)]">{link.description}</div>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
};

export default Connect;

