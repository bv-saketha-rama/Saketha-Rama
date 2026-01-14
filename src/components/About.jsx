import profileImg from '../assets/profile.jpg';

const About = () => {
    return (
        <section id="about" className="py-12 border-b border-[var(--color-border)]">
            <h2 className="text-2xl font-bold text-[var(--color-text)] mb-8">About Me</h2>

            <div className="flex flex-col md:flex-row gap-10 items-start">
                <div className="w-full md:w-1/3 flex-shrink-0 group">
                    <div className="relative">
                        <div className="absolute -inset-2 bg-gradient-to-r from-[var(--color-accent)] to-transparent rounded-2xl opacity-20 blur-xl group-hover:opacity-40 transition duration-500"></div>
                        <div className="relative w-full aspect-square bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-2xl">
                            <img
                                src={profileImg}
                                alt="Saketha Rama"
                                className="w-full h-full object-cover object-center transition-all duration-500 hover:scale-105"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex-1 space-y-6">
                    <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed">
                        I am a <strong className="text-[var(--color-text)]">Software Engineer</strong> driven by the intersection of
                        <strong className="text-[var(--color-text)]"> AI/ML</strong>, <strong className="text-[var(--color-text)]">MLOps</strong>, and
                        <strong className="text-[var(--color-text)]"> Infrastructure</strong>. I thrive on the engineering challenges that come with bringing AI to production: crafting resilient APIs, building/fine-tuning models, optimizing inference pipelines, and architecting systems that scale. I love
                        <strong className="text-[var(--color-text)]"> Systems Programming</strong> and the hands-on nature of
                        <strong className="text-[var(--color-text)]"> Forward-Deployed Engineering</strong>, where I can engage with customers to deeply understand their problems and turn complex requirements into stable, robust, and efficient software.
                    </p>

                    <p className="text-[var(--color-text-secondary)] leading-relaxed">
                        When I'm not coding, you'll find me exploring new technologies, contributing to
                        open source, writing blogs or diving deep into system design patterns.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default About;
