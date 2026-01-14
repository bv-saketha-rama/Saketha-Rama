import React, { useEffect, useRef } from 'react';

const RacingParticles = () => {
    const canvasRef = useRef(null);
    const mousePosRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        // Throttled mouse move handler - only updates the ref, no state changes
        const handleMouseMove = (e) => {
            mousePosRef.current = { x: e.clientX, y: e.clientY };
        };

        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        resizeCanvas();

        // Particle system for speed lines - reduced count for performance
        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.length = Math.random() * 40 + 20;
                this.speed = Math.random() * 3 + 2;
                this.opacity = Math.random() * 0.5 + 0.2;
            }

            update() {
                this.x -= this.speed * 3;

                if (this.x + this.length < 0) {
                    this.reset();
                    this.x = canvas.width + this.length;
                }
            }

            draw() {
                // Simplified gradient for better performance
                ctx.strokeStyle = `rgba(0, 255, 255, ${this.opacity})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x - this.length, this.y);
                ctx.stroke();
            }
        }

        // Spark particles for mouse interaction
        class Spark {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.vx = (Math.random() - 0.5) * 4;
                this.vy = (Math.random() - 0.5) * 4;
                this.life = 1;
                this.decay = Math.random() * 0.03 + 0.02; // Faster decay
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.vy += 0.1;
                this.life -= this.decay;
            }

            draw() {
                ctx.fillStyle = `rgba(255, 0, 60, ${this.life})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Reduced particle count from 50 to 25
        const particles = Array.from({ length: 25 }, () => new Particle());
        let sparks = [];
        let lastMousePos = { x: 0, y: 0 };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update and draw speed lines
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }

            // Create sparks when mouse moves - using ref instead of state
            const mousePos = mousePosRef.current;
            const dx = mousePos.x - lastMousePos.x;
            const dy = mousePos.y - lastMousePos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 15 && sparks.length < 30) { // Limit max sparks
                sparks.push(new Spark(mousePos.x, mousePos.y));
                lastMousePos = { ...mousePos };
            }

            // Update and draw sparks - optimized filtering
            for (let i = sparks.length - 1; i >= 0; i--) {
                sparks[i].update();
                if (sparks[i].life <= 0) {
                    sparks.splice(i, 1);
                } else {
                    sparks[i].draw();
                }
            }

            animationFrameId = window.requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            window.cancelAnimationFrame(animationFrameId);
        };
    }, []); // Empty dependency array - no re-initialization

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full pointer-events-none"
        />
    );
};

export default RacingParticles;
