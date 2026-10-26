import { ArrowUpRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import SectionShell from './SectionShell';

const Projects = () => {
    const { projects } = useData();

    return (
        <SectionShell id="projects" index="04" title="Projects">
            <div className="grid grid-cols-1 gap-5">
                {(Array.isArray(projects) ? projects : []).map((project) => (
                    <article key={project.id} className="reveal card overflow-hidden">
                        {project.image && (
                            <img src={project.image} alt="" loading="lazy" className="block w-full aspect-[16/9] object-cover border-b border-line" />
                        )}
                        <div className="p-6 md:p-8">
                            <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
                                <h3 className="text-xl md:text-2xl leading-snug">{project.title}</h3>
                                {project.comingSoon && <span className="tag tag-yc">Coming soon</span>}
                            </div>

                            {project.descriptionPoints ? (
                                <ul className="mt-5 space-y-2.5">
                                    {project.descriptionPoints.map((point) => (
                                        <li key={point} className="bullet text-[0.95rem] leading-relaxed text-muted">
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="mt-5 text-[0.95rem] leading-relaxed">{project.description}</p>
                            )}

                            <div className="mt-6 flex flex-wrap gap-1.5">
                                {(Array.isArray(project.tech) ? project.tech : []).map((tech) => (
                                    <span key={tech} className="tag">{tech}</span>
                                ))}
                            </div>

                            {(project.links?.website || project.links?.github || project.links?.blog) && (
                                <div className="mt-6 pt-5 border-t border-line flex flex-wrap gap-6">
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
