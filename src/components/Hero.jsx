import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

// Flippable Telemetry Card Component
const TelemetryCard = ({ f1Label, f1Value, f1Unit, engLabel, engValue, engDetail, color = 'cyan', delay = 0 }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const shouldShowBack = isLocked || isHovered;

    const handleClick = () => {
        setIsLocked(!isLocked);
    };

    const colorClasses = {
        cyan: {
            border: 'border-racing-cyan/20 hover:border-racing-cyan/50',
            bg: 'bg-racing-cyan/5',
            text: 'text-racing-cyan',
            gradient: 'from-racing-cyan/5'
        },
        red: {
            border: 'border-racing-red/20 hover:border-racing-red/50',
            bg: 'bg-racing-red/5',
            text: 'text-racing-red',
            gradient: 'from-racing-red/5'
        }
    };

    return (
        <motion.div
            className={`relative flex flex-col justify-between border ${colorClasses[color].border} ${colorClasses[color].bg} p-4 backdrop-blur-sm overflow-hidden group cursor-pointer transition-colors perspective-1000`}
            whileHover={{ scale: 1.05 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleClick}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color].gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />

            <AnimatePresence mode="wait">
                {!shouldShowBack ? (
                    // F1 Front Side
                    <motion.div
                        key="f1"
                        initial={{ rotateY: 0 }}
                        animate={{ rotateY: 0 }}
                        exit={{ rotateY: 90 }}
                        transition={{ duration: 0.3 }}
                        className="relative z-10"
                    >
                        <span className={`text-xs ${colorClasses[color].text}`}>{f1Label}</span>
                        <div className="flex flex-col items-start gap-0">
                            <span className="text-3xl md:text-4xl font-bold text-white leading-tight">{f1Value}</span>
                            {f1Unit && <span className="text-sm text-gray-400">{f1Unit}</span>}
                        </div>
                    </motion.div>
                ) : (
                    // Engineering Back Side
                    <motion.div
                        key="eng"
                        initial={{ rotateY: -90 }}
                        animate={{ rotateY: 0 }}
                        exit={{ rotateY: -90 }}
                        transition={{ duration: 0.3 }}
                        className="relative z-10 flex flex-col h-full"
                    >
                        <span className={`text-xs ${colorClasses[color].text} font-bold mb-2`}>{engLabel}</span>
                        <div className="text-sm md:text-base font-normal text-white leading-relaxed">
                            {engDetail}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Lock indicator */}
            {isLocked && (
                <div className="absolute top-2 right-2 text-racing-cyan text-xs opacity-50">
                    🔒
                </div>
            )}
        </motion.div>
    );
};

// Rotating Tech Stack Component - Compact version with larger logos only
const RotatingEngine = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const engines = [
        { name: 'Python', logo: '/assets/logos/python.png' },
        { name: 'Go', logo: '/assets/logos/go.png' },
        { name: 'C++', logo: '/assets/logos/C++.png' },
        { name: 'Rust', logo: '/assets/logos/rust.png' }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % engines.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            className="relative flex items-center justify-center border border-racing-cyan/20 bg-racing-cyan/5 p-4 backdrop-blur-sm overflow-hidden group hover:border-racing-cyan/50 transition-colors"
            whileHover={{ scale: 1.05 }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-racing-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <span className="absolute top-3 left-3 text-xs text-racing-cyan z-10 whitespace-nowrap">ENGINE</span>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.4 }}
                    className="relative z-10"
                >
                    <img
                        src={engines[currentIndex].logo}
                        alt={engines[currentIndex].name}
                        className="w-20 h-20 object-contain"
                    />
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
};

const Hero = () => {
    const [stats, setStats] = useState({ throughput: 1, delivery: 0, uptime: 0, inference: 1 });
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    // Count up animation for telemetry - real achievements
    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => ({
                throughput: Math.min(prev.throughput + 0.1, 5),
                delivery: Math.min(prev.delivery + 1, 40),
                uptime: Math.min(prev.uptime + 2, 99.9),
                inference: Math.min(prev.inference + 0.08, 4)
            }));
        }, 50);
        return () => clearInterval(interval);
    }, []);

    // Mouse tracking for parallax
    useEffect(() => {
        const handleMouseMove = (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            setMousePos({ x, y });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <motion.section
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative flex min-h-screen w-full max-w-7xl flex-col justify-center space-y-8 text-left overflow-hidden"
        >


            <div className="grid gap-8 lg:grid-cols-2 items-center relative z-10 overflow-visible">
                {/* Left Side - Driver Portrait */}
                <motion.div
                    className="relative group z-10 overflow-visible"
                    style={{
                        transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)`
                    }}
                >
                    {/* Glowing background effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-racing-cyan/20 via-racing-red/20 to-transparent blur-3xl transform scale-110 group-hover:scale-125 transition-transform duration-700" />

                    {/* F1 Driver Image */}
                    <div className="relative overflow-hidden rounded-lg border-2 border-racing-cyan/30 shadow-[0_0_50px_rgba(0,255,255,0.3)] group-hover:shadow-[0_0_80px_rgba(0,255,255,0.5)] transition-all duration-500">
                        <img
                            src="/assets/f1-driver-main.jpg"
                            alt="F1 Driver Portrait"
                            className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                            style={{
                                filter: 'brightness(1.1) contrast(1.2) saturate(1.1)',
                            }}
                        />

                        {/* Animated scan line effect */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-b from-transparent via-racing-cyan/10 to-transparent"
                            animate={{
                                y: ['-100%', '200%']
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: 'linear'
                            }}
                        />

                        {/* Corner brackets (HUD style) */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-racing-cyan" />
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-racing-cyan" />
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-racing-cyan" />
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-racing-cyan" />
                    </div>

                    {/* Technical annotations with higher z-index */}
                    <div className="absolute -top-4 -right-4 font-racing text-xs text-racing-cyan bg-racing-asphalt border border-racing-cyan/50 px-3 py-1 rounded z-30">
                        DRIVER_01
                    </div>
                    <div className="absolute -bottom-4 -left-4 font-racing text-xs text-racing-red bg-racing-asphalt border border-racing-red/50 px-3 py-1 rounded z-30">
                        READY
                    </div>
                </motion.div>

                {/* Right Side - Info & Stats */}
                <div className="space-y-6">
                    <div className="space-y-6">
                        {/* Big Title - Saketha Rama */}
                        <h1 className="font-racing text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white drop-shadow-[0_0_30px_rgba(0,255,255,0.5)]">
                            SAKETHA
                            <br />
                            <span className="text-racing-cyan">RAMA</span>
                        </h1>

                        {/* Main Quote */}
                        <p className="max-w-md border-l-4 border-racing-red pl-4 font-mono text-sm md:text-base text-gray-300 leading-relaxed italic">
                            "Optimization is the only strategy. I build backend systems with the precision of a qualifying lap—where every millisecond of latency is a rival to be overtaken."
                        </p>

                        {/* Role Badges */}
                        <div className="flex flex-wrap gap-2">
                            <span className="font-racing text-xs px-3 py-1 bg-racing-cyan/10 border border-racing-cyan/30 text-racing-cyan rounded">
                                BACKEND ENGINEERING
                            </span>
                            <span className="font-racing text-xs px-3 py-1 bg-racing-cyan/10 border border-racing-cyan/30 text-racing-cyan rounded">
                                HIGH THROUGHPUT
                            </span>
                            <span className="font-racing text-xs px-3 py-1 bg-racing-cyan/10 border border-racing-cyan/30 text-racing-cyan rounded">
                                LOW LATENCY
                            </span>
                        </div>
                    </div>

                    {/* Achievements Section Header */}
                    <div className="border-l-4 border-racing-cyan pl-4">
                        <h3 className="font-racing text-sm md:text-base text-racing-cyan uppercase tracking-wider">
                            PEAK PERFORMANCE METRICS
                        </h3>
                        <p className="font-mono text-xs text-gray-400 mt-1">
                            Mission-critical achievements unlocked
                        </p>
                    </div>

                    {/* Telemetry Grid with Flippable Cards */}
                    <div className="grid grid-cols-2 gap-3 font-racing">
                        <TelemetryCard
                            f1Label="THROUGHPUT"
                            f1Value={
                                <>
                                    5×,<br />
                                    18×
                                </>
                            }
                            engLabel="CONCURRENCY & AUTOMATION"
                            engDetail={
                                <>
                                    5×: Fully asynchronous request handlers enabled 5× higher concurrent throughput with zero infrastructure cost increase.
                                    <br /><br />
                                    18×: Built a batch auto-annotation system powered by VLMs, cutting per-image annotation from 2–3 minutes to 10 seconds.
                                </>
                            }
                            color="cyan"
                            delay={0}
                        />

                        <TelemetryCard
                            f1Label="INFERENCE"
                            f1Value="4×"
                            engLabel="MODEL ACCELERATION"
                            engDetail="Accelerated SAM and other model inference by 4× using CPU multiprocessing techniques, optimizing per-request costs by 75% while maintaining accuracy."
                            color="cyan"
                            delay={0.1}
                        />

                        {/* Rotating Engine Block - Compact single column */}
                        <RotatingEngine />
                    </div>
                </div>
            </div>
        </motion.section>
    );
};

export default Hero;
