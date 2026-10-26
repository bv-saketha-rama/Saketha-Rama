export const socialLinks = [
    { id: 'github', name: 'GitHub', url: 'https://github.com/bv-saketha-rama', description: 'Check out my code' },
    { id: 'resume', name: 'Resume', url: 'https://drive.google.com/file/d/1hk10k6hrlSA6LnJNaWV_DeZtYfDur-at/view?usp=sharing', description: 'Check out my Resume' },
    { id: 'leetcode', name: 'LeetCode', url: 'https://leetcode.com/u/bv-saketha-rama/', description: 'check out my DSA skills' },
    { id: 'linkedin', name: 'LinkedIn', url: 'https://www.linkedin.com/in/saketha-rama-5b93a81b9/', description: "Let's connect" },
    { id: 'x', name: 'X', url: 'https://x.com/Srammms', description: 'Follow me' },
    { id: 'email', name: 'Email', url: 'mailto:sakethram9999@gmail.com', description: 'Get in touch' },
    { id: 'hashnode', name: 'Hashnode', url: 'https://hashnode.com/@saketha-rama', description: 'Read my blogs' },
];

export const isExternal = (url) => !url.startsWith('mailto:');
