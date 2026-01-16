import { Github } from 'lucide-react';
import { useData } from '../context/DataContext';
import HashnodeIcon from './icons/HashnodeIcon';

const Projects = () => {
    const { projects } = useData();

    return (
        <section id="projects" className="py-12 border-b border-[var(--color-border)]">
            <h2 className="text-2xl font-bold text-[var(--color-text)] mb-8">Projects</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(Array.isArray(projects) ? projects : []).map((project) => (
                    <div
                        key={project.id}
                        className="group relative p-8 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-[2.5rem] hover:border-[var(--color-accent)] transition-all duration-500 flex flex-col h-full overflow-hidden"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <h3 className="text-xl font-bold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                                {project.title}
                            </h3>
                            <div className="flex gap-3">
                                <a
                                    href={project.links?.github || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors ${!project.links?.github && 'opacity-50 cursor-not-allowed'}`}
                                    aria-label={`View ${project.title} on GitHub`}
                                >
                                    <Github size={20} />
                                </a>
                                <a
                                    href={project.links?.blog || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors ${!project.links?.blog && 'opacity-50 cursor-not-allowed'}`}
                                    aria-label={`Read blog about ${project.title}`}
                                >
                                    <HashnodeIcon size={20} />
                                </a>
                            </div>
                        </div>

                        <p className="text-[var(--color-text-secondary)] mb-6 leading-relaxed flex-grow">
                            {project.description}
                        </p>

                        <div className="flex flex-wrap gap-2 pt-4 border-t border-[var(--color-border)] border-opacity-50">
                            {(Array.isArray(project.tech) ? project.tech : []).map((tech, i) => (
                                <span
                                    key={i}
                                    className="px-3 py-1 text-[10px] font-mono tracking-wider uppercase bg-[var(--color-bg)] border border-[var(--color-border)] rounded-full text-[var(--color-text-secondary)]"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Projects;
