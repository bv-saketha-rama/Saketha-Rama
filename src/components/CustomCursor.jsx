import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const updateMousePosition = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', updateMousePosition);

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
        };
    }, []);

    return (
        <motion.div
            className="pointer-events-none fixed left-0 top-0 z-50 flex h-6 w-6 items-center justify-center text-terminal-green mix-blend-difference"
            animate={{ x: mousePosition.x - 12, y: mousePosition.y - 12 }}
            transition={{ type: 'spring', stiffness: 500, damping: 28 }}
        >
            <div className="h-full w-full animate-spin-slow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
            </div>
        </motion.div>
    );
};

export default CustomCursor;
