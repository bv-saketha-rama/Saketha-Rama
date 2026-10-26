import SectionShell from './SectionShell';

const experiences = [
    {
        timerange: "Apr 2025 - Present",
        company: "DeepEdge AI",
        role: "Backend & AI/ML Engineer",
        roles: [
            {
                title: "Backend & AI/ML Engineer",
                bullets: [
                    "Owned a FastAPI annotation microservice as part of a monolith-to-microservices migration, refactoring APIs and schemas for multi-tenant image and video labeling, task lifecycle management, workflow transitions and dataset version publishing.",
                    "Built AI-assisted annotation workflows integrating SAM, GroundingDINO, CLIP, Florence-2, YOLO Pose and other vision models through an existing inference abstraction, with model weights stored on EFS and loaded into Docker-based runtimes.",
                    "Integrated asynchronous inference using RabbitMQ for job dispatch and Redis for job status and results, with request timeouts, reconnect handling, trace propagation and non-blocking polling between the annotation service and model runtimes.",
                    "Designed RBAC and ownership-based authorization for multi-tenant annotation workflows, enforcing role-specific visibility, creator and assignee permissions and write restrictions across annotation, validation, rejection and completion states.",
                    "Contributed to shared authentication infrastructure for user and service identities, including JWT signature and expiry validation, identity and role propagation across service-to-service calls and multi-secret validation for token secret rotation.",
                    "Built frontend and backend flows for AI-assisted labeling, including model selection, inference request state, loading and timeout handling, annotation result processing and analytics APIs for task, project and annotator activity."
                ]
            }
        ],
        tech: ["Python", "FastAPI", "RabbitMQ", "Redis", "Docker", "EFS", "AI/ML"],
        type: "work"
    },
    {
        timerange: "Aug 2024 - Mar 2025",
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
        tech: ["Informatica", "SQL", "Airflow", "Jenkins", "Vertica", "S3", "Python"],
        type: "work"
    },
    {
        timerange: "2020 - 2024",
        company: "Indian Institute of Information Technology, Design & Manufacturing, Kancheepuram",
        type: "education",
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
    }
];

const Experience = () => (
    <SectionShell id="experience" index="02" title="Experience & Education">
        <ol className="relative border-l border-line ml-1">
            {experiences.map((exp) => (
                <li key={exp.company} className="reveal relative pl-8 pb-14 last:pb-0">
                    <span className="absolute -left-[5px] top-[0.55rem] h-[9px] w-[9px] rounded-full border border-ink bg-bg" aria-hidden="true" />
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-6">
                        <h3 className="text-lg md:text-xl leading-snug">{exp.company}</h3>
                        <p className="meta shrink-0">{exp.timerange}</p>
                    </div>
                    <p className="meta mt-1 uppercase">{exp.type === 'education' ? 'education' : 'work'}</p>

                    <div className="mt-6 space-y-8">
                        {exp.roles.map((role) => (
                            <div key={role.title}>
                                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                                    <p className="font-medium text-ink">{role.title}</p>
                                    {role.period && <span className="meta">{role.period}</span>}
                                </div>
                                {role.bullets.length > 0 && (
                                    <ul className="mt-3 space-y-2.5">
                                        {role.bullets.map((bullet) => (
                                            <li key={bullet} className="bullet text-[0.94rem] leading-relaxed text-muted">
                                                {bullet}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex flex-wrap gap-1.5">
                        {exp.tech.map((t) => (
                            <span key={t} className="tag">{t}</span>
                        ))}
                    </div>
                </li>
            ))}
        </ol>
    </SectionShell>
);

export default Experience;
