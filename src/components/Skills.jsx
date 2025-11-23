import { motion } from 'framer-motion';

const skills = [
    { category: "Core Languages", items: ["JavaScript (ES6+)", "Python", "SQL", "HTML5/CSS3"] },
    { category: "Special FX (Frameworks)", items: ["React", "Tailwind CSS", "Three.js", "Framer Motion"] },
    { category: "Production (Tools)", items: ["Git", "Vite", "Figma", "VS Code"] },
];

const Skills = () => {
    return (
        <section className="w-full max-w-4xl py-20">
            <div className="mb-12 flex items-center gap-4">
                <div className="h-8 w-2 bg-racing-cyan skew-x-[-20deg]" />
                <h2 className="font-racing text-4xl font-bold italic text-white">
                    SETUP SHEET <span className="text-racing-red">// SKILLS</span>
                </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                {skills.map((group, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="border border-racing-cyan/20 bg-racing-asphalt p-6"
                    >
                        <h3 className="mb-6 font-racing text-sm text-racing-cyan">
                            {group.category.toUpperCase()}
                        </h3>
                        <div className="space-y-4">
                            {group.items.map((skill, j) => (
                                <div key={j} className="space-y-1">
                                    <div className="flex justify-between text-xs font-bold text-white">
                                        <span>{skill}</span>
                                        <span>{Math.floor(Math.random() * 20 + 80)}%</span>
                                    </div>
                                    <div className="h-1 w-full bg-gray-800">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${Math.random() * 20 + 80}%` }}
                                            transition={{ duration: 1, delay: 0.5 + j * 0.1 }}
                                            className="h-full bg-racing-red"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default Skills;
