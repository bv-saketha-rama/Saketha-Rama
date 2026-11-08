import { useState } from 'react';
import SectionShell from './SectionShell';

// Oldest to newest. `short` names the stop on the timeline rail.
const experiences = [
    {
        year: "2020",
        timerange: "2020 - 2024",
        emoji: { char: "🧑‍🎓", label: "College student" },
        company: "Indian Institute of Information Technology, Design & Manufacturing, Kancheepuram",
        short: "IIITDM Kancheepuram",
        role: "B.Tech CSE",
        roles: [
            {
                title: "Teaching Assistant",
                period: "Mar 2024 - May 2024",
                bullets: [
                    "Supervised and assisted students in CS1003 (Elementary Data Structures), CS1005 (Discrete Structures), and CS2009 (Theory of Computation).",
                    "Guided students with weekly coding assignments by providing support in formulating, debugging, and optimizing code."
                ]
            },
            {
                title: "Speaker: IEEE Competitive Programming Workshop",
                period: "Oct 2023",
                bullets: [
                    "Presented 'Overview of Problem Solving using Packages in C++' session for student enthusiasts.",
                    "Covered various data structures, algorithms, and performance optimization tricks within the C++ STL.",
                    "Shared high-quality resources and best practices for mastering problem-solving."
                ]
            },
            {
                title: "B.Tech in Computer Science and Engineering",
                period: "8.57 CGPA",
                bullets: []
            }
        ],
        tech: ["Data Structures & Algorithms", "OS", "Database Systems", "Computer Networks", "Object Oriented Programming", "Machine Learning", "Deep Learning", "Data Science", "Reinforcement Learning"]
    },
    {
        year: "2024",
        timerange: "Aug 2024 - Mar 2025",
        emoji: { char: "🧑‍💼", label: "Intern" },
        company: "MassMutual India",
        role: "Data Engineering Intern",
        roles: [
            {
                bullets: [
                    "Engineered automated ETL pipelines using Informatica, Python, and SQL, orchestrated via Apache Airflow and deployed through Jenkins CI/CD, ensuring reliable and maintainable data workflows.",
                    "Designed scalable data storage on Vertica and AWS S3, improving availability, performance, and enabling faster analytics across business intelligence teams."
                ]
            }
        ],
        tech: ["Informatica", "SQL", "Airflow", "Jenkins", "Vertica", "S3", "Python"]
    },
    {
        year: "2025",
        timerange: "Apr 2025 - Present",
        emoji: { char: "🧑‍💻", label: "Software engineer" },
        company: "DeepEdge AI",
        role: "Software Development Engineer I",
        roles: [
            {
                bullets: [
                    "Reduced annotation dashboard backend response time by 96% (7.44 s → 290 ms) through metadata projection and batched permission reads, reducing metadata payload by 99.5%.",
                    "Owned the annotation microservice during a monolith-to-microservices migration, delivering end-to-end annotation workflows and productivity analytics tracking labeling progress, review time and rework.",
                    "Built asynchronous GPU inference pipelines using RabbitMQ and Redis with model-status tracking and inactivity-based shutdown to decouple inference workloads from interactive API requests.",
                    "Integrated and containerized SAM2, SAM 3.1, GroundingDINO, Florence-2, CLIP, and SpeciesNet for object detection, segmentation and classification within AI-assisted annotation workflows.",
                    "Prevented annotation loss during concurrent saves using task-scoped locking, atomic file replacement, and image-scoped updates. Improved batch reliability with resumable checkpoints and duplicate-task prevention.",
                    "Secured JWT-authenticated service calls with role-, ownership-, and workflow-based authorization across annotation, review, and dataset publishing while preserving tenant context.",
                    "Optimized image and video annotation with progressive loading, canvas rendering improvements, persistent tracking identities, and cross-frame editing."
                ]
            }
        ],
        tech: ["Python", "FastAPI", "RabbitMQ", "Redis", "Docker", "AWS", "Inference Engineering", "CI/CD"]
    }
];

// The selected entry in full. Several roles sit side by side; one role's long
// list of bullets flows into two columns.
const ExperienceDetail = ({ exp, index }) => {
    const multi = exp.roles.length > 1;
    return (
        <article
            role="tabpanel"
            id="experience-detail"
            aria-labelledby={`experience-tab-${index}`}
            className="card exp-detail mt-[clamp(1rem,3vh,1.75rem)] p-5 xl:p-7"
        >
            {/* The rail above already names the place; the heading is for screen readers. */}
            <h3 className="sr-only">{exp.company}</h3>
            <div className="flex items-start justify-between gap-4">
                <p className="meta">{exp.timerange}</p>
                <span role="img" aria-label={exp.emoji.label} title={exp.emoji.label} className="shrink-0 text-2xl leading-none select-none">
                    {exp.emoji.char}
                </span>
            </div>

            <div className={`mt-3 ${multi ? 'grid grid-cols-1 gap-x-8 gap-y-5 lg:grid-cols-3' : ''}`}>
                {exp.roles.map((role) => (
                    <div key={role.title} className="min-w-0">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                            <p className="font-display text-lg font-semibold text-ink">{role.title}</p>
                            {role.period && <span className="meta">{role.period}</span>}
                        </div>
                        {role.bullets.length > 0 && (
                            <ul className={`mt-2 ${multi ? '' : 'lg:columns-2 lg:gap-10'}`}>
                                {role.bullets.map((bullet) => (
                                    <li key={bullet} className="bullet card-text text-muted break-inside-avoid pb-1.5">
                                        {bullet}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
                {exp.tech.map((t) => (
                    <span key={t} className="tag">{t}</span>
                ))}
            </div>
        </article>
    );
};

// A rail of stops, one per entry, always in view; the selected one is shown in
// full below. Opens on the latest.
const Experience = () => {
    const [selected, setSelected] = useState(experiences.length - 1);

    // Arrow keys move along the rail (and stop there, so the panels don't slide).
    const onKeyDown = (e) => {
        const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (!step) return;
        e.preventDefault();
        const next = (selected + step + experiences.length) % experiences.length;
        setSelected(next);
        document.getElementById(`experience-tab-${next}`)?.focus();
    };

    return (
        <SectionShell id="experience" index="02" title="Experience">
            <div role="tablist" aria-label="Experience timeline" className="timeline-stops" onKeyDown={onKeyDown}>
                {experiences.map((exp, i) => {
                    const on = i === selected;
                    return (
                        <button
                            key={exp.company}
                            type="button"
                            role="tab"
                            id={`experience-tab-${i}`}
                            aria-selected={on}
                            aria-controls="experience-detail"
                            tabIndex={on ? 0 : -1}
                            onClick={() => setSelected(i)}
                            className="timeline-stop group"
                        >
                            <span className="relative mb-3 flex items-center gap-2.5" aria-hidden="true">
                                <span className="timeline-rail" />
                                <span className={`relative h-[9px] w-[9px] rounded-full border transition-colors ${on ? 'bg-yc border-yc' : 'bg-bg border-ink'}`} />
                                <span className={`meta relative bg-bg pr-2.5 transition-colors ${on ? 'text-yc' : 'text-ink'}`}>{exp.year}</span>
                            </span>
                            <span className={`block font-display font-semibold leading-snug transition-colors text-[1.05rem] xl:text-lg ${on ? 'text-ink' : 'text-muted group-hover:text-ink'}`}>
                                {exp.short ?? exp.company}
                            </span>
                            <span className="mt-0.5 block text-sm text-muted">{exp.role}</span>
                        </button>
                    );
                })}
            </div>

            <ExperienceDetail key={selected} exp={experiences[selected]} index={selected} />
        </SectionShell>
    );
};

export default Experience;
