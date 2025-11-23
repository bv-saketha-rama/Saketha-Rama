import React, { useEffect, useRef, useState } from 'react';

const RacingParticles = () => {
    const canvasRef = useRef(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

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

        // Particle system for speed lines
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
                const gradient = ctx.createLinearGradient(this.x, this.y, this.x - this.length, this.y);
                gradient.addColorStop(0, `rgba(0, 255, 255, ${this.opacity})`);
                gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');

                ctx.strokeStyle = gradient;
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
                this.decay = Math.random() * 0.02 + 0.01;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.vy += 0.1; // gravity
                this.life -= this.decay;
            }

            draw() {
                ctx.fillStyle = `rgba(255, 0, 60, ${this.life})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const particles = Array.from({ length: 50 }, () => new Particle());
        let sparks = [];
        let lastMousePos = { ...mousePos };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update and draw speed lines
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            // Create sparks when mouse moves
            const distance = Math.sqrt(
                Math.pow(mousePos.x - lastMousePos.x, 2) +
                Math.pow(mousePos.y - lastMousePos.y, 2)
            );

            if (distance > 10) {
                for (let i = 0; i < 3; i++) {
                    sparks.push(new Spark(mousePos.x, mousePos.y));
                }
                lastMousePos = { ...mousePos };
            }

            // Update and draw sparks
            sparks = sparks.filter(spark => spark.life > 0);
            sparks.forEach(spark => {
                spark.update();
                spark.draw();
            });

            animationFrameId = window.requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.cancelAnimationFrame(animationFrameId);
        };
    }, [mousePos]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full pointer-events-none"
        />
    );
};

export default RacingParticles;
