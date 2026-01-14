const contributions = [
    {
        project: "facebook/pyrefly",
        title: "LSP Navigation Improvement",
        link: "https://github.com/facebook/pyrefly/pull/1981",
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
        bullets: [
            "Introduced a type-safe context helper package for the Gin framework to abstract JWT user extraction.",
            "Reduced repetitive boilerplate code across protected API handlers by over 40%.",
            "Enhanced codebase maintainability and simplified unit testing for secure endpoints."
        ]
    }
];

const OpenSource = () => {
    return (
        <section id="opensource" className="py-12 border-b border-[var(--color-border)]">
            <h2 className="text-2xl font-bold text-[var(--color-text)] mb-8">Open Source Contributions</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contributions.map((item, index) => (
                    <div key={index} className="group relative p-8 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-[2.5rem] hover:border-[var(--color-accent)] transition-all duration-500 hover:shadow-2xl overflow-hidden flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <span className="inline-block px-3 py-1 text-[10px] font-mono tracking-widest uppercase bg-[var(--color-bg)] border border-[var(--color-border)] rounded-full text-[var(--color-accent)] mb-3">
                                    Pull Request
                                </span>
                                <h3 className="text-xl font-bold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                                    {item.project}
                                </h3>
                                <p className="text-sm font-semibold text-[var(--color-text-secondary)] mt-1">
                                    {item.title}
                                </p>
                            </div>
                            <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-accent)] hover:scale-110 transition-transform"
                                title="View on GitHub"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></svg>
                            </a>
                        </div>

                        <ul className="space-y-3 mt-auto">
                            {item.bullets.map((bullet, i) => (
                                <li key={i} className="text-sm text-[var(--color-text-secondary)] leading-relaxed flex gap-3">
                                    <span className="text-[var(--color-accent)] font-bold">•</span>
                                    <span>{bullet}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default OpenSource;
