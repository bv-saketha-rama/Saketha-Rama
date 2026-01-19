const skillCategories = [
    {
        title: "Languages / Core",
        skills: ["Python", "Go", "C++", "C", "SQL", "Rust", "Bash"]
    },
    {
        title: "AI / ML Engineering",
        skills: ["Machine Learning", "Deep Learning", "RAG", "PyTorch", "TensorFlow", "LangChain", "LangGraph", "LLM Orchestration", "Vector Databases", "Transformers"]
    },
    {
        title: "Backend & Systems",
        skills: ["FastAPI", "Messaging Queues", "Kernel Programming", "System Design", "gRPC", "REST", "GraphQL", "API Design", "Distributed Systems"]
    },
    {
        title: "Data Engineering & DBs",
        skills: ["PostgreSQL", "MongoDB", "SQLite", "Redis", "Apache Airflow", "Informatica", "Vertica", "Apache Kafka", "ETL Pipelines"]
    },
    {
        title: "Infra & DevOps",
        skills: ["Linux", "AWS", "GCP", "Azure", "Docker", "Kubernetes", "Jenkins", "LGTM Stack", "CI/CD", "Performance Optimization"]
    }
];

const Skills = () => {
    return (
        <section id="skills" className="py-12 border-b border-[var(--color-border)]">
            <h2 className="text-2xl font-bold text-[var(--color-text)] mb-8">Skills</h2>

            <div className="grid md:grid-cols-2 gap-8">
                {skillCategories.map((category, index) => (
                    <div key={index} className="group">
                        <h3 className="font-bold text-[var(--color-text)] mb-4 flex items-center gap-2">
                            <span className="w-1 h-4 bg-[var(--color-accent)] rounded-full"></span>
                            {category.title}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {category.skills.map((skill, i) => (
                                <span
                                    key={i}
                                    className="px-4 py-2 text-sm bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-text)] transition-all duration-300 cursor-default"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Skills;
