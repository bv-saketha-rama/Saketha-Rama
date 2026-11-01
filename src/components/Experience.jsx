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
        role: "B.Tech CSE · Teaching Assistant",
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
                title: "Data Engineering Intern",
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
        role: "Backend & AI/ML Engineer",
        roles: [
            {
                title: "Backend & AI/ML Engineer",
                bullets: [
                    "Built frontend and backend flows for AI-assisted labeling, including model selection, inference request state, loading and timeout handling, annotation result processing and analytics APIs for task, project and annotator activity.",
                    "Contributed to shared authentication infrastructure for user and service identities, including JWT signature and expiry validation, identity and role propagation across service-to-service calls and multi-secret validation for token secret rotation.",
                    "Designed RBAC and ownership-based authorization for multi-tenant annotation workflows, enforcing role-specific visibility, creator and assignee permissions and write restrictions across annotation, validation, rejection and completion states.",
                    "Integrated asynchronous inference using RabbitMQ for job dispatch and Redis for job status and results, with request timeouts, reconnect handling, trace propagation and non-blocking polling between the annotation service and model runtimes.",
                    "Built AI-assisted annotation workflows integrating SAM, GroundingDINO, CLIP, Florence-2, YOLO Pose and other vision models through an existing inference abstraction, with model weights stored on EFS and loaded into Docker-based runtimes.",
                    "Owned a FastAPI annotation microservice as part of a monolith-to-microservices migration, refactoring APIs and schemas for multi-tenant image and video labeling, task lifecycle management, workflow transitions and dataset version publishing."
                ]
            }
        ],
        tech: ["Python", "FastAPI", "RabbitMQ", "Redis", "Docker", "EFS", "AI/ML"]
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
