import React, { useEffect, useRef } from 'react';

const RacingBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let lastTime = 0;
        const targetFPS = 30; // Throttle to 30 FPS
        const frameInterval = 1000 / targetFPS;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        let offset = 0;
        const speed = 1.5; // Slightly slower for smoother feel

        const draw = (currentTime) => {
            animationFrameId = window.requestAnimationFrame(draw);

            // Throttle to target FPS
            const deltaTime = currentTime - lastTime;
            if (deltaTime < frameInterval) return;
            lastTime = currentTime - (deltaTime % frameInterval);

            const width = canvas.width;
            const height = canvas.height;

            ctx.fillStyle = '#0a0a0a';
            ctx.fillRect(0, 0, width, height);

            ctx.strokeStyle = 'rgba(0, 255, 255, 0.15)';
            ctx.lineWidth = 1;

            // Perspective Grid parameters
            const horizonY = height * 0.4;
            const gridSpacing = 60; // Increased spacing = fewer lines

            ctx.beginPath();

            // Vertical lines (converging to vanishing point) - reduced count
            const centerX = width / 2;
            for (let x = -width; x < width * 2; x += gridSpacing * 2) {
                ctx.moveTo(x, height);
                ctx.lineTo(centerX + (x - centerX) * 0.1, horizonY);
            }

            // Horizontal lines - simplified with fewer calculations
            offset = (offset + speed) % gridSpacing;
            const time = Date.now() * 0.0015; // Slower time factor

            for (let i = 0; i < 15; i++) { // Reduced from 20 to 15 lines
                const z = (i + (time % 1)) * 0.5;
                const y = height - (height - horizonY) / z;

                if (y > horizonY && y < height) {
                    ctx.moveTo(0, y);
                    ctx.lineTo(width, y);
                }
            }

            ctx.stroke();

            // Simplified horizon glow - no gradient recreation each frame
            ctx.fillStyle = 'rgba(0, 255, 255, 0.03)';
            ctx.fillRect(0, horizonY, width, height - horizonY);
        };

        animationFrameId = window.requestAnimationFrame(draw);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="absolute inset-0 h-full w-full pointer-events-none">
            {/* Base perspective grid - ONLY animation now for better performance */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 h-full w-full bg-racing-asphalt"
            />
        </div>
    );
};

export default RacingBackground;

