import { ArrowUpRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import SectionShell from './SectionShell';

const Writing = () => {
    const { blogs: posts } = useData();

    return (
        <SectionShell id="writing" index="05" title="Writing">
            <ul className="border-t border-line">
                {posts.map((post) => (
                    <li key={post.id} className="reveal border-b border-line">
                        <article className="group grid grid-cols-1 sm:grid-cols-[7.5rem_1fr] gap-x-6 gap-y-2 py-7">
                            <p className="meta pt-1">{post.date}</p>
                            <div className="min-w-0">
                                <h3 className="text-lg leading-snug">
                                    {post.link ? (
                                        <a href={post.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-1.5 hover:text-accent">
                                            {post.title}
                                            <ArrowUpRight size={16} className="mt-1 shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                                        </a>
                                    ) : (
                                        post.title
                                    )}
                                </h3>
                                <p className="mt-2 text-[0.94rem] leading-relaxed">{post.description}</p>
                            </div>
                        </article>
                    </li>
                ))}
            </ul>
        </SectionShell>
    );
};

export default Writing;
