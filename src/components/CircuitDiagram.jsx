import React, { useEffect, useRef } from 'react';

const CircuitDiagram = () => {
    const canvasRef = useRef(null);

    // Famous F1 circuits (simplified coordinates)
    const circuits = {
        monaco: [
            { x: 0.3, y: 0.2 },
            { x: 0.4, y: 0.3 },
            { x: 0.5, y: 0.3 },
            { x: 0.6, y: 0.4 },
            { x: 0.6, y: 0.6 },
            { x: 0.5, y: 0.7 },
            { x: 0.3, y: 0.7 },
            { x: 0.2, y: 0.5 },
            { x: 0.3, y: 0.2 }
        ],
        silverstone: [
            { x: 0.2, y: 0.3 },
            { x: 0.5, y: 0.2 },
            { x: 0.7, y: 0.3 },
            { x: 0.8, y: 0.5 },
            { x: 0.7, y: 0.7 },
            { x: 0.4, y: 0.8 },
            { x: 0.2, y: 0.6 },
            { x: 0.2, y: 0.3 }
        ],
        spa: [
            { x: 0.3, y: 0.2 },
            { x: 0.6, y: 0.3 },
            { x: 0.7, y: 0.5 },
            { x: 0.6, y: 0.8 },
            { x: 0.3, y: 0.7 },
            { x: 0.2, y: 0.4 },
            { x: 0.3, y: 0.2 }
        ]
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let progress = 0;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const circuitKeys = Object.keys(circuits);
        let currentCircuitIndex = 0;

        const draw = () => {
            const width = canvas.width;
            const height = canvas.height;

            ctx.clearRect(0, 0, width, height);

            // Cycle through circuits every 10 seconds
            const circuitChangeInterval = 10000;
            const timePassed = Date.now() % (circuitChangeInterval * circuitKeys.length);
            currentCircuitIndex = Math.floor(timePassed / circuitChangeInterval);

            const currentCircuit = circuits[circuitKeys[currentCircuitIndex]];

            // Draw circuit outline
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.15)';
            ctx.lineWidth = 3;
            ctx.setLineDash([5, 10]);
            ctx.beginPath();

            currentCircuit.forEach((point, index) => {
                const x = point.x * width * 0.6 + width * 0.2;
                const y = point.y * height * 0.5 + height * 0.25;

                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });

            ctx.stroke();

            // Draw animated racing line
            progress = (progress + 0.005) % 1;

            ctx.strokeStyle = 'rgba(255, 0, 60, 0.6)';
            ctx.lineWidth = 2;
            ctx.setLineDash([]);
            ctx.beginPath();

            const progressPoint = Math.floor(progress * currentCircuit.length);

            for (let i = 0; i <= progressPoint; i++) {
                const point = currentCircuit[i];
                const x = point.x * width * 0.6 + width * 0.2;
                const y = point.y * height * 0.5 + height * 0.25;

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }

            ctx.stroke();

            // Draw DRS zones (random sections)
            ctx.fillStyle = 'rgba(0, 255, 255, 0.1)';
            const drsStart = Math.floor(currentCircuit.length * 0.3);
            const drsEnd = Math.floor(currentCircuit.length * 0.5);

            ctx.beginPath();
            for (let i = drsStart; i <= drsEnd && i < currentCircuit.length; i++) {
                const point = currentCircuit[i];
                const x = point.x * width * 0.6 + width * 0.2;
                const y = point.y * height * 0.5 + height * 0.25;

                if (i === drsStart) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.lineWidth = 8;
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)';
            ctx.stroke();

            // Add sector markers
            const sectors = [0, Math.floor(currentCircuit.length / 3), Math.floor(2 * currentCircuit.length / 3)];
            sectors.forEach((sectorIndex, i) => {
                const point = currentCircuit[sectorIndex];
                const x = point.x * width * 0.6 + width * 0.2;
                const y = point.y * height * 0.5 + height * 0.25;

                ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
                ctx.beginPath();
                ctx.arc(x, y, 6, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = 'rgba(0, 255, 255, 0.6)';
                ctx.font = '12px Orbitron, sans-serif';
                ctx.fillText(`S${i + 1}`, x + 10, y + 5);
            });

            animationFrameId = window.requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full pointer-events-none opacity-30"
        />
    );
};

export default CircuitDiagram;
