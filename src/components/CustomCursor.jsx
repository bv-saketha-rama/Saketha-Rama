import { useEffect, useRef } from 'react';

const CustomCursor = () => {
    const cursorRef = useRef(null);

    useEffect(() => {
        const updateMousePosition = (e) => {
            if (cursorRef.current) {
                // Direct update - no animation loop needed
                cursorRef.current.style.transform = `translate3d(${e.clientX - 12}px, ${e.clientY - 12}px, 0)`;
            }
        };

        window.addEventListener('mousemove', updateMousePosition, { passive: true });

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
        };
    }, []);

    return (
        <div
            ref={cursorRef}
            className="pointer-events-none fixed left-0 top-0 z-50 flex h-6 w-6 items-center justify-center text-racing-cyan mix-blend-difference"
            style={{
                willChange: 'transform',
                transition: 'transform 0.05s linear'
            }}
        >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
        </div>
    );
};

export default CustomCursor;
