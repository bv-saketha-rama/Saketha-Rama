import { Calendar } from 'lucide-react';

const posts = [
    {
        title: "Building High-Throughput APIs with Go",
        date: "Coming soon",
        description: "A deep dive into designing and implementing APIs that handle thousands of requests per second."
    },
    {
        title: "Optimizing Database Queries for Scale",
        date: "Coming soon",
        description: "Techniques for profiling and optimizing slow queries in production systems."
    },
    {
        title: "Event-Driven Architecture Patterns",
        date: "Coming soon",
        description: "Exploring patterns for building loosely coupled, scalable systems with message queues."
    }
];

const Writing = () => {
    return (
        <section id="writing" className="py-12 border-b border-[var(--color-border)]">
            <div className="mb-8 text-left">
                <h2 className="text-2xl font-bold text-[var(--color-text)]">Writing</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {posts.map((post, index) => (
                    <article
                        key={index}
                        className="group relative p-6 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-[2.5rem] hover:border-[var(--color-accent)] transition-all duration-500 flex flex-col h-full overflow-hidden"
                    >
                        <div className="text-[10px] font-mono tracking-widest uppercase text-[var(--color-text-secondary)] mb-4 bg-[var(--color-bg)] px-3 py-1 rounded-full w-fit border border-[var(--color-border)]">
                            {post.date}
                        </div>

                        <h3 className="text-lg font-bold text-[var(--color-text)] mb-3 group-hover:text-[var(--color-accent)] transition-colors leading-tight">
                            <a href="#" className="after:absolute after:inset-0">
                                {post.title}
                            </a>
                        </h3>

                        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed line-clamp-3">
                            {post.description}
                        </p>

                        <div className="mt-8 pt-4 border-t border-[var(--color-border)] border-opacity-30 self-start text-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default Writing;

