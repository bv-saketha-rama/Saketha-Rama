import SectionShell from './SectionShell';

const skillCategories = [
    {
        title: "Languages / Core",
        skills: ["Python", "Go", "C++", "C", "TypeScript", "SQL", "Rust", "Bash"]
    },
    {
        title: "AI / ML Engineering",
        skills: ["Machine Learning", "Deep Learning", "RAG", "PyTorch", "TensorFlow", "LangChain", "LangGraph", "LLM Orchestration", "Vector Databases", "Transformers", "vLLM"]
    },
    {
        title: "Backend & Systems",
        skills: ["FastAPI", "Messaging Queues", "Kernel Programming", "System Design", "gRPC", "REST", "GraphQL", "API Design", "Distributed Systems", "RabbitMQ", "Kafka"]
    },
    {
        title: "Data Engineering & DBs",
        skills: ["PostgreSQL", "MongoDB", "SQLite", "Redis", "Apache Airflow", "Informatica", "Vertica", "Apache Kafka", "ETL Pipelines"]
    },
    {
        title: "Infra & DevOps",
        skills: ["Linux", "AWS", "GCP", "Azure", "Docker", "Kubernetes", "Jenkins", "LGTM Stack", "CI/CD", "Performance Optimization", "EFS", "OpenTelemetry"]
    },
    {
        title: "Security & Identity",
        skills: ["OAuth2", "OpenID Connect", "JWT", "RBAC", "IAM", "Token Management", "Multi-tenancy"]
    },
    {
        title: "AI Coding Tools",
        skills: ["Claude Code", "Codex", "Cursor"]
    },
];

const Skills = () => (
    <SectionShell id="skills" index="07" title="Skills">
        <dl className="border-t border-line">
            {skillCategories.map((category) => (
                <div key={category.title} className="reveal grid grid-cols-1 md:grid-cols-[14rem_1fr] gap-x-8 gap-y-3 border-b border-line py-6">
                    <dt className="font-display font-semibold text-ink">{category.title}</dt>
                    <dd className="m-0 flex flex-wrap gap-1.5">
                        {category.skills.map((skill) => (
                            <span key={skill} className="tag">{skill}</span>
                        ))}
                    </dd>
                </div>
            ))}
        </dl>
    </SectionShell>
);

export default Skills;
