import { useData } from '../context/DataContext';
import HashnodeIcon from './icons/HashnodeIcon';

const Writing = () => {
    const { blogs: posts } = useData();

    return (
        <section id="writing" className="py-12 border-b border-[var(--color-border)]">
            <div className="mb-8 text-left">
                <h2 className="text-2xl font-bold text-[var(--color-text)]">Writing</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {posts.map((post) => (
                    <article
                        key={post.id}
                        className="group relative p-6 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-[2.5rem] hover:border-[var(--color-accent)] transition-all duration-500 flex flex-col h-full overflow-hidden"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-[10px] font-mono tracking-widest uppercase text-[var(--color-text-secondary)] bg-[var(--color-bg)] px-3 py-1 rounded-full border border-[var(--color-border)]">
                                {post.date}
                            </div>
                            {post.link && (
                                <a
                                    href={post.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
                                >
                                    <HashnodeIcon size={18} />
                                </a>
                            )}
                        </div>

                        <h3 className="text-lg font-bold text-[var(--color-text)] mb-3 group-hover:text-[var(--color-accent)] transition-colors leading-tight">
                            {post.link ? (
                                <a href={post.link} target="_blank" rel="noopener noreferrer">
                                    {post.title}
                                </a>
                            ) : (
                                post.title
                            )}
                        </h3>

                        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed line-clamp-3 flex-grow">
                            {post.description}
                        </p>

                        {post.link && (
                            <div className="mt-4 pt-4 border-t border-[var(--color-border)] border-opacity-30 self-start text-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14" />
                                    <path d="m12 5 7 7-7 7" />
                                </svg>
                            </div>
                        )}
                    </article>
                ))}
            </div>
        </section>
    );
};

export default Writing;
