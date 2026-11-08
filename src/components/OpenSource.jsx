import SectionShell from './SectionShell';
import GitMergeIcon from './icons/GitMergeIcon';
import { GitPullRequestClosed } from 'lucide-react';
import CardRow from './CardRow';

// Text wrapped in `backticks` renders as inline code.
const contributions = [
    {
        project: "meta/pyrefly",
        title: "LSP Navigation Improvement",
        link: "https://github.com/meta/pyrefly/pull/1981",
        // Meta's sync bot landed the change and closed the GitHub PR.
        // Confirmed by the Merged label and bot comment linking commit 4d38ea0.
        merged: true,
        bullets: [
            "Fixed LSP go-to declaration to stop at module imports when using `ImportBehavior::StopAtEverything`.",
            "Added `TextRange` tracking to module bindings for precise navigation to the import line.",
            "Added a regression test covering go-to declaration for module bindings."
        ]
    },
    {
        project: "rocketmq-rust",
        title: "Reliability & Error Handling",
        link: "https://github.com/mxsm/rocketmq-rust/pull/5462",
        merged: true,
        bullets: [
            "Prevented a panic in `send_oneway_to_queue` when `DefaultMQProducerImpl` is uninitialized.",
            "Replaced a panicking `.unwrap()` with `.ok_or(RocketMQError::not_initialized(...))?`.",
            "Propagated send errors with `?` and returned `Ok(())` on success."
        ]
    },
    {
        project: "go-rest-api-boilerplate",
        title: "Authentication Context Helpers",
        link: "https://github.com/vahiiiid/go-rest-api-boilerplate/pull/29",
        merged: true,
        bullets: [
            "Added typed `Gin` context helpers for JWT claims, user IDs, email, name, and authentication status.",
            "Added `CanAccessUser()` ownership checks to user read, update, and delete handlers; extended JWT claims with email and name.",
            "Added unit tests for valid claims, missing or incorrectly typed context values, and ownership checks."
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
                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="link-quiet shrink-0" aria-label={`View ${item.merged ? 'merged' : 'closed, unmerged'} PR for ${item.title} on GitHub`}>
                                {item.merged ? 'Merged PR' : 'Closed PR'}
                                {item.merged ? <GitMergeIcon size={15} className="pr-icon" /> : <GitPullRequestClosed size={15} className="text-muted" aria-hidden="true" />}
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
