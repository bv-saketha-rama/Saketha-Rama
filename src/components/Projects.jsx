import ProjectCard from './ProjectCard';

const projects = [
    {
        title: "The Chat System",
        role: "Lead Developer",
        description: "A real-time communication infrastructure built for high concurrency.",
        tech: ["Go", "WebSocket", "Redis", "Docker"]
    },
    {
        title: "E-Commerce API",
        role: "Backend Architect",
        description: "Scalable microservices architecture handling thousands of transactions.",
        tech: ["Node.js", "PostgreSQL", "Kubernetes", "gRPC"]
    },
    {
        title: "Data Pipeline",
        role: "Data Engineer",
        description: "ETL pipeline processing terabytes of log data daily.",
        tech: ["Python", "Apache Kafka", "AWS S3", "ClickHouse"]
    }
];

const Projects = () => {
    return (
        <section className="w-full max-w-6xl py-20">
            <div className="mb-12 flex items-center gap-4">
                <div className="h-8 w-2 bg-racing-red skew-x-[-20deg]" />
                <h2 className="font-racing text-4xl font-bold italic text-white">
                    CIRCUIT DATA <span className="text-racing-cyan">// PROJECTS</span>
                </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project, index) => (
                    <ProjectCard key={index} {...project} index={index} />
                ))}
            </div>
        </section>
    );
};

export default Projects;
