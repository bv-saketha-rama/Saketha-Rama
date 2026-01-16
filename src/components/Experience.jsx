import { GraduationCap, Briefcase, Mic2 } from 'lucide-react';

const experiences = [
    {
        timerange: "Apr 2025 - Present",
        company: "DeepEdge.ai",
        role: "Software Engineer",
        roles: [
            {
                title: "Backend & AI/ML Engineer",
                bullets: [
                    "Migrated a legacy monolith to a FastAPI microservices architecture, significantly improving deployment frequency and system uptime.",
                    "Refactored request handlers to be fully asynchronous, increasing concurrent throughput without requiring additional infrastructure.",
                    "Standardized APIs using ReDoc and reusable JSON schemas, which streamlined partner onboarding and reduced technical support overhead.",
                    "Established a robust pytest framework with mocking patterns, resulting in higher code coverage and fewer production incidents.",
                    "Leveraged CPU multiprocessing to accelerate model inference, reducing latency and operational costs per request.",
                    "Developed a VLM-powered batch auto-annotation system, replacing manual workflows to drastically reduce labeling time and increase data throughput."
                ]
            }
        ],
        tech: ["Linux", "Git", "Python", "FastAPI", "CI/CD", "Docker"],
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

const Experience = () => {
    return (
        <section id="experience" className="py-12 border-b border-[var(--color-border)]">
            <h2 className="text-2xl font-bold text-[var(--color-text)] mb-8">Experience & Education</h2>

            <div className="relative pl-8 max-w-2xl">
                {/* Vertical line */}
                <div className="absolute left-0 top-2 bottom-2 w-px bg-[var(--color-border)]" />

                <div className="space-y-12">
                    {experiences.map((exp, index) => (
                        <div key={index} className="relative">
                            {/* Dot/Icon on line */}
                            <div className="absolute -left-[40px] top-1 w-6 h-6 rounded-full border-2 border-[var(--color-accent)] bg-[var(--color-bg)] flex items-center justify-center z-10 text-[var(--color-accent)]">
                                {exp.type === 'education' ? (
                                    <GraduationCap size={12} />
                                ) : exp.type === 'talk' ? (
                                    <Mic2 size={12} />
                                ) : (
                                    <Briefcase size={12} />
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
                                    <div className="font-bold text-lg text-[var(--color-text)]">
                                        {exp.company}
                                    </div>
                                    <div className="text-sm font-mono text-[var(--color-text-secondary)]">
                                        {exp.timerange}
                                    </div>
                                </div>

                                <div className="p-6 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl text-[var(--color-text-secondary)] shadow-sm">
                                    <div className="space-y-8">
                                        {exp.roles.map((role, ri) => (
                                            <div key={ri} className={ri > 0 ? "pt-6 border-t border-[var(--color-border)] border-opacity-30" : ""}>
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                                                    <div className="font-bold text-[var(--color-text)] flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]"></span>
                                                        {role.title}
                                                    </div>
                                                    {role.period && (
                                                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)]">
                                                            {role.period}
                                                        </span>
                                                    )}
                                                </div>

                                                {role.bullets.length > 0 && (
                                                    <ul className="space-y-3">
                                                        {role.bullets.map((bullet, i) => (
                                                            <li key={i} className="text-sm leading-relaxed flex items-start gap-3">
                                                                <span className="mt-[0.6em] w-1 h-1 rounded-full bg-[var(--color-accent)] opacity-60 flex-shrink-0"></span>
                                                                <span className="flex-1">{bullet}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-[var(--color-border)] border-opacity-30">
                                        {exp.tech.map((t, i) => (
                                            <span key={i} className="px-2 py-0.5 text-[10px] font-mono bg-[var(--color-bg)] border border-[var(--color-border)] rounded text-[var(--color-text-secondary)]">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Experience;
