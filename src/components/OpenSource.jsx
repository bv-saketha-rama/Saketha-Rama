import { ArrowUpRight } from 'lucide-react';
import SectionShell from './SectionShell';

const contributions = [
    {
        project: "facebook/pyrefly",
        title: "LSP Navigation Improvement",
        link: "https://github.com/facebook/pyrefly/pull/1981",
        blog: null,
        bullets: [
            "Fixed Language Server Protocol (LSP) behavior where 'go-to declaration' incorrectly skipped import statements.",
            "Implemented module binding support by respecting ImportBehavior::StopAtEverything for module definitions.",
            "Integrated TextRange tracking to ensure precise navigation directly to import lines in Python modules."
        ]
    },
    {
        project: "rocketmq-rust",
        title: "Reliability & Error Handling",
        link: "https://github.com/mxsm/rocketmq-rust/pull/5462",
        blog: null,
        bullets: [
            "Identified and eliminated potential runtime panics in the send_oneway_to_queue method.",
            "Replaced unsafe .unwrap() calls with robust error handling using .ok_or() and RocketMQError types.",
            "Implemented idiomatic Rust error propagation using the '?' operator for cleaner code flow."
        ]
    },
    {
        project: "go-rest-api-boilerplate",
        title: "Architectural Refactoring",
        link: "https://github.com/vahiiiid/go-rest-api-boilerplate/pull/29",
        blog: null,
        bullets: [
            "Introduced a type-safe context helper package for the Gin framework to abstract JWT user extraction.",
            "Reduced repetitive boilerplate code across protected API handlers by over 40%.",
            "Enhanced codebase maintainability and simplified unit testing for secure endpoints."
        ]
    }
];

const OpenSource = () => (
    <SectionShell id="opensource" index="03" title="Open Source Contributions">
        <ul className="border-t border-line">
            {contributions.map((item) => (
                <li key={item.link} className="reveal border-b border-line py-8">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                        <div className="min-w-0">
                            <p className="meta">pull request</p>
                            <h3 className="mt-1.5 text-lg md:text-xl font-mono font-medium tracking-tight">{item.project}</h3>
                            <p className="mt-1 text-[0.95rem] text-muted">{item.title}</p>
                        </div>
                        <div className="flex items-center gap-5">
                            {item.link && (
                                <a href={item.link} target="_blank" rel="noopener noreferrer" className="link-quiet" aria-label={`View PR for ${item.title} on GitHub`}>
                                    View PR <ArrowUpRight size={14} aria-hidden="true" />
                                </a>
                            )}
                            {item.blog && (
                                <a href={item.blog} target="_blank" rel="noopener noreferrer" className="link-quiet" aria-label={`Read blog about ${item.title}`}>
                                    Blog <ArrowUpRight size={14} aria-hidden="true" />
                                </a>
                            )}
                        </div>
                    </div>
                    <ul className="mt-5 space-y-2.5">
                        {item.bullets.map((bullet) => (
                            <li key={bullet} className="bullet text-[0.94rem] leading-relaxed text-muted">
                                {bullet}
                            </li>
                        ))}
                    </ul>
                </li>
            ))}
        </ul>
    </SectionShell>
);

export default OpenSource;
