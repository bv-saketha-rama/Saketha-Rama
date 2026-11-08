import { ArrowUpRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import SectionShell from './SectionShell';

const Projects = () => {
    const { projects } = useData();

    return (
        <SectionShell id="projects" index="04" title="Projects">
            <div className="project-gallery">
                {(Array.isArray(projects) ? projects : []).map((project, index) => {
                    const primaryLink = project.links?.website || project.links?.github || project.links?.blog;
                    const preview = project.image && (
                        <img
                            src={project.image}
                            alt={project.imageAlt ?? ''}
                            loading="lazy"
                            decoding="async"
                            width={project.imageWidth ?? 1200}
                            height={project.imageHeight ?? 630}
                            className="project-image"
                        />
                    );

                    return (
                        <article key={project.id} className="project-feature" aria-labelledby={`project-${project.id}-title`}>
                            <span className="meta project-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                            {preview && (primaryLink ? (
                                <a href={primaryLink} target="_blank" rel="noopener noreferrer" className="project-preview" aria-label={`Explore ${project.title} (opens in a new tab)`}>
                                    {preview}
                                    <span className="project-preview-action" aria-hidden="true">
                                        Explore project <ArrowUpRight size={16} />
                                    </span>
                                </a>
                            ) : <div className="project-preview">{preview}</div>)}

                            <div className="project-caption">
                                <div className="project-summary">
                                    <div className="project-title-row">
                                        <h3 id={`project-${project.id}-title`} className="project-title">{project.title}</h3>
                                        {project.comingSoon && <span className="tag tag-yc">Coming soon</span>}
                                    </div>
                                    {project.tagline && <p className="project-tagline">{project.tagline}</p>}
                                    {project.descriptionPoints ? (
                                        <ul className="mt-2 space-y-1">
                                            {project.descriptionPoints.map((point) => <li key={point} className="bullet text-sm text-muted">{point}</li>)}
                                        </ul>
                                    ) : <p className="project-description">{project.description}</p>}
                                </div>

                                <div className="project-details">
                                    {(project.links?.website || project.links?.github || project.links?.blog) && (
                                        <div className="project-links">
                                            {[
                                                ['website', 'Visit site'],
                                                ['github', 'GitHub'],
                                                ['blog', 'Read the story'],
                                            ].map(([key, label]) => project.links?.[key] && (
                                                <a key={key} href={project.links[key]} target="_blank" rel="noopener noreferrer" className="link-quiet" aria-label={`${label}: ${project.title} (opens in a new tab)`}>
                                                    {label} <ArrowUpRight size={15} aria-hidden="true" />
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                    <ul className="project-stack" aria-label={`${project.title} technology stack`}>
                                        {(Array.isArray(project.tech) ? project.tech : []).map((tech) => <li key={tech}>{tech}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>
        </SectionShell>
    );
};

export default Projects;
