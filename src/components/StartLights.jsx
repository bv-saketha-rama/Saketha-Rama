import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const StartLights = ({ onComplete }) => {
    const [lights, setLights] = useState(0);
    const [showLights, setShowLights] = useState(true);

    useEffect(() => {
        const sequence = [
            { delay: 500, lights: 1 },
            { delay: 1000, lights: 2 },
            { delay: 1500, lights: 3 },
            { delay: 2000, lights: 4 },
            { delay: 2500, lights: 5 },
            { delay: 3000, lights: 0 }, // Lights out!
        ];

        sequence.forEach(({ delay, lights }) => {
            setTimeout(() => setLights(lights), delay);
        });

        setTimeout(() => {
            setShowLights(false);
            if (onComplete) onComplete();
        }, 3500);
    }, [onComplete]);

    return (
        <AnimatePresence>
            {showLights && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm pointer-events-none"
                >
                    <div className="flex gap-4">
                        {[1, 2, 3, 4, 5].map((num) => (
                            <motion.div
                                key={num}
                                initial={{ scale: 0 }}
                                animate={{
                                    scale: lights >= num ? 1 : 0,
                                    backgroundColor: lights === 0 && lights !== num
                                        ? 'rgba(0, 255, 0, 0.9)'
                                        : lights >= num
                                            ? 'rgba(255, 0, 0, 0.9)'
                                            : 'rgba(50, 50, 50, 0.5)'
                                }}
                                transition={{ duration: 0.2 }}
                                className="w-12 h-20 rounded-lg border-2 border-white/20 shadow-lg"
                                style={{
                                    boxShadow: lights >= num
                                        ? '0 0 30px rgba(255, 0, 0, 0.8)'
                                        : 'none'
                                }}
                            />
                        ))}
                    </div>
                    {lights === 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute text-6xl font-racing font-black text-racing-cyan"
                        >
                            LIGHTS OUT!
                        </motion.div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default StartLights;
