import { motion } from 'framer-motion';
import { Activity, GitBranch } from 'lucide-react';

const ProjectCard = ({ title, role, description, tech, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, x: 10 }}
            className="group relative overflow-hidden border border-racing-cyan/30 bg-racing-asphalt p-6 transition-all hover:border-racing-cyan hover:shadow-[0_0_20px_rgba(0,243,255,0.2)]"
        >
            {/* Technical markings */}
            <div className="absolute -right-4 -top-4 h-16 w-16 border border-racing-cyan/10" />
            <div className="absolute bottom-2 right-2 font-racing text-[10px] text-racing-cyan/40">
                SEC-0{index + 1} // AERO-DYNAMICS
            </div>

            <div className="mb-4 flex items-start justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Activity size={14} className="text-racing-red" />
                        <span className="font-mono text-xs text-racing-cyan">TELEMETRY ACTIVE</span>
                    </div>
                    <h3 className="font-racing text-2xl font-bold italic text-white group-hover:text-racing-cyan">
                        {title}
                    </h3>
                </div>
                <GitBranch className="text-racing-cyan/50" />
            </div>

            <div className="mb-4 border-l-2 border-racing-red/50 pl-4">
                <p className="font-mono text-sm text-gray-400">{description}</p>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-gray-800 pb-1 text-xs text-gray-500">
                    <span>ENGINE SPECS</span>
                    <span>V.2.0.4</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {tech.map((t, i) => (
                        <span key={i} className="bg-racing-cyan/10 px-2 py-1 font-mono text-xs text-racing-cyan">
                            {t}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default ProjectCard;
