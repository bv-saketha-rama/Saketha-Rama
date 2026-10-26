import { Github, Linkedin, Twitter, Mail, FileText } from 'lucide-react';
import HashnodeIcon from './HashnodeIcon';
import LeetCodeIcon from './LeetCodeIcon';

const ICONS = {
    github: Github,
    linkedin: Linkedin,
    x: Twitter,
    email: Mail,
    resume: FileText,
    hashnode: HashnodeIcon,
    leetcode: LeetCodeIcon,
};

const SocialIcon = ({ id, size = 18, className }) => {
    const Icon = ICONS[id];
    return Icon ? <Icon size={size} className={className} aria-hidden="true" /> : null;
};

export default SocialIcon;
