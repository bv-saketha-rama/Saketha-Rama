import React, { useEffect, useRef } from 'react';
import CircuitDiagram from './CircuitDiagram';
import RacingParticles from './RacingParticles';

const RacingBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        let offset = 0;
        const speed = 2; // Speed of the grid movement

        const draw = () => {
            ctx.fillStyle = '#0a0a0a'; // Racing Asphalt (Darker)
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.strokeStyle = 'rgba(0, 255, 255, 0.15)'; // Racing Cyan (Brighter but low opacity)
            ctx.lineWidth = 1;

            const width = canvas.width;
            const height = canvas.height;

            // Perspective Grid parameters
            const horizonY = height * 0.4; // Horizon line
            const gridSpacing = 40;

            ctx.beginPath();

            // Vertical lines (converging to vanishing point)
            const centerX = width / 2;

            for (let x = -width; x < width * 2; x += gridSpacing * 2) {
                ctx.moveTo(x, height);
                // Simple perspective approximation
                ctx.lineTo(centerX + (x - centerX) * 0.1, horizonY);
            }

            // Horizontal lines (moving towards camera)
            offset = (offset + speed) % gridSpacing;

            // Better approach for infinite scrolling floor:
            // Draw horizontal lines at calculated perspective depths
            const time = Date.now() * 0.002;

            for (let i = 0; i < 20; i++) {
                // Exponential spacing for depth
                const z = (i + (time % 1)) * 0.5;
                const y = height - (height - horizonY) / z;

                if (y > horizonY && y < height) {
                    ctx.moveTo(0, y);
                    ctx.lineTo(width, y);
                }
            }

            ctx.stroke();

            // Draw a "Sun" or "Glow" at the horizon
            const gradient = ctx.createLinearGradient(0, horizonY - 50, 0, horizonY + 100);
            gradient.addColorStop(0, 'rgba(0, 255, 255, 0)');
            gradient.addColorStop(1, 'rgba(0, 255, 255, 0.05)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, horizonY, width, height - horizonY);

            animationFrameId = window.requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="absolute inset-0 h-full w-full pointer-events-none">
            {/* Base perspective grid */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 h-full w-full bg-racing-asphalt"
            />

            {/* Circuit diagram overlay */}
            <CircuitDiagram />

            {/* Racing particles and effects */}
            <RacingParticles />
        </div>
    );
};

export default RacingBackground;

