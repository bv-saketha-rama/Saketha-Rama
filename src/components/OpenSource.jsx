import SectionShell from './SectionShell';
import GitMergeIcon from './icons/GitMergeIcon';
import CardRow from './CardRow';

// Text wrapped in `backticks` renders as inline code.
const contributions = [
    {
        project: "facebook/pyrefly",
        title: "LSP Navigation Improvement",
        link: "https://github.com/facebook/pyrefly/pull/1981",
        bullets: [
            "Fixed Language Server Protocol (LSP) behavior where 'go-to declaration' incorrectly skipped `import` statements.",
            "Implemented module binding support by respecting `ImportBehavior::StopAtEverything` for module definitions.",
            "Integrated `TextRange` tracking to ensure precise navigation directly to import lines in Python modules."
        ]
    },
    {
        project: "rocketmq-rust",
        title: "Reliability & Error Handling",
        link: "https://github.com/mxsm/rocketmq-rust/pull/5462",
        bullets: [
            "Identified and eliminated potential runtime panics in the `send_oneway_to_queue` method.",
            "Replaced unsafe `.unwrap()` calls with robust error handling using `.ok_or()` and `RocketMQError` types.",
            "Implemented idiomatic Rust error propagation using the `?` operator for cleaner code flow."
        ]
    },
    {
        project: "go-rest-api-boilerplate",
        title: "Architectural Refactoring",
        link: "https://github.com/vahiiiid/go-rest-api-boilerplate/pull/29",
        bullets: [
            "Introduced a type-safe context helper package for the `Gin` framework to abstract JWT user extraction.",
            "Reduced repetitive boilerplate code across protected API handlers by over 40%.",
            "Enhanced codebase maintainability and simplified unit testing for secure endpoints."
        ]
    }
];

const withCode = (text) =>
    text.split('`').map((part, i) => (i % 2 ? <code key={i} className="code-inline">{part}</code> : part));

const OpenSource = () => (
    <SectionShell id="opensource" index="03" title="Open Source Contributions">
        <CardRow
            label="Open source contributions"
            items={contributions.map((item) => ({
                key: item.link,
                content: (
                    <article className="card p-5 xl:p-6">
                        <div className="flex items-start justify-between gap-6">
                            <div className="min-w-0">
                                <h3 className="text-lg xl:text-xl font-mono font-medium tracking-tight break-words">{item.project}</h3>
                                <p className="mt-1.5 text-base text-muted">{item.title}</p>
                            </div>
                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="link-quiet shrink-0" aria-label={`View merged PR for ${item.title} on GitHub`}>
                                View PR <GitMergeIcon size={15} className="pr-icon" />
                            </a>
                        </div>
                        <ul className="mt-4 space-y-2">
                            {item.bullets.map((bullet) => (
                                <li key={bullet} className="bullet card-text text-muted">
                                    {withCode(bullet)}
                                </li>
                            ))}
                        </ul>
                    </article>
                ),
            }))}
        />
    </SectionShell>
);

export default OpenSource;
