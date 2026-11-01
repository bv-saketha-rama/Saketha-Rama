import { ArrowUpRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import SectionShell from './SectionShell';

const Projects = () => {
    const { projects } = useData();

    return (
        <SectionShell id="projects" index="04" title="Projects">
            <div className="grid grid-cols-1 gap-5">
                {(Array.isArray(projects) ? projects : []).map((project) => (
                    <article key={project.id} className="card overflow-hidden grid grid-cols-1 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] md:items-center">
                        {project.image && (
                            <img
                                src={project.image}
                                alt={project.imageAlt ?? ''}
                                loading="lazy"
                                width="1200"
                                height="630"
                                className="block w-full aspect-[1200/630] object-cover border-b md:border-b-0 border-line"
                            />
                        )}
                        <div className="flex flex-col p-6">
                            <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                                <h3 className="text-lg md:text-xl leading-snug">{project.title}</h3>
                                {project.comingSoon && <span className="tag tag-yc">Coming soon</span>}
                            </div>

                            {project.descriptionPoints ? (
                                <ul className="mt-3 space-y-2">
                                    {project.descriptionPoints.map((point) => (
                                        <li key={point} className="bullet text-[0.92rem] leading-relaxed text-muted">
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="mt-3 text-[0.95rem] leading-relaxed">{project.description}</p>
                            )}

                            <div className="mt-5 flex flex-wrap gap-1.5">
                                {(Array.isArray(project.tech) ? project.tech : []).map((tech) => (
                                    <span key={tech} className="tag">{tech}</span>
                                ))}
                            </div>

                            {(project.links?.website || project.links?.github || project.links?.blog) && (
                                <div className="mt-auto pt-6 flex flex-wrap gap-6">
                                    {project.links?.website && (
                                        <a href={project.links.website} target="_blank" rel="noopener noreferrer" className="link-quiet">
                                            Visit site <ArrowUpRight size={14} aria-hidden="true" />
                                        </a>
                                    )}
                                    {project.links?.github && (
                                        <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="link-quiet" aria-label={`View ${project.title} on GitHub`}>
                                            GitHub <ArrowUpRight size={14} aria-hidden="true" />
                                        </a>
                                    )}
                                    {project.links?.blog && (
                                        <a href={project.links.blog} target="_blank" rel="noopener noreferrer" className="link-quiet" aria-label={`Read blog about ${project.title}`}>
                                            Blog <ArrowUpRight size={14} aria-hidden="true" />
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    </article>
                ))}
            </div>
        </SectionShell>
    );
};

export default Projects;
