import { useEffect, useRef } from 'react';
import { createPond } from './pond';

// Decorative koi pond. Fish avoid (and are never drawn over) the element in avoidRef.
const KoiPond = ({ avoidRef, className = '' }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return undefined;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const pond = createPond({ reduced });
        let dpr = 1;
        let raf = 0;
        let visible = false;
        let last = 0;

        const layout = () => {
            const r = canvas.getBoundingClientRect();
            if (!r.width || !r.height) return;
            dpr = Math.min(2, window.devicePixelRatio || 1);
            canvas.width = Math.round(r.width * dpr);
            canvas.height = Math.round(r.height * dpr);
            let text = null;
            const el = avoidRef?.current;
            if (el) {
                const tr = el.getBoundingClientRect();
                const box = { x: tr.left - r.left, y: tr.top - r.top, w: tr.width, h: tr.height };
                if (box.x < r.width && box.x + box.w > 0 && box.y < r.height && box.y + box.h > 0) text = box;
            }
            pond.resize(r.width, r.height, text, r.width < 768);
            pond.draw(ctx, dpr);
        };

        const frame = (now) => {
            pond.update(Math.min(0.05, (now - last) / 1000));
            last = now;
            pond.draw(ctx, dpr);
            raf = requestAnimationFrame(frame);
        };
        const start = () => {
            if (reduced || raf || !visible || document.hidden) return;
            last = performance.now();
            raf = requestAnimationFrame(frame);
        };
        const stop = () => {
            cancelAnimationFrame(raf);
            raf = 0;
        };

        layout();
        const ro = new ResizeObserver(layout);
        ro.observe(canvas);
        if (avoidRef?.current) ro.observe(avoidRef.current);
        const io = new IntersectionObserver(([e]) => {
            visible = e.isIntersecting;
            if (visible) start();
            else stop();
        });
        io.observe(canvas);
        const onVisibility = () => (document.hidden ? stop() : start());
        document.addEventListener('visibilitychange', onVisibility);

        const local = (e) => {
            const r = canvas.getBoundingClientRect();
            return [e.clientX - r.left, e.clientY - r.top];
        };
        const onMove = (e) => !reduced && pond.pointerMove(...local(e), performance.now() / 1000);
        const onLeave = () => pond.pointerLeave();
        const onDown = (e) => !reduced && pond.tap(...local(e));
        canvas.addEventListener('pointermove', onMove);
        canvas.addEventListener('pointerleave', onLeave);
        canvas.addEventListener('pointerdown', onDown);

        return () => {
            stop();
            ro.disconnect();
            io.disconnect();
            document.removeEventListener('visibilitychange', onVisibility);
            canvas.removeEventListener('pointermove', onMove);
            canvas.removeEventListener('pointerleave', onLeave);
            canvas.removeEventListener('pointerdown', onDown);
        };
    }, [avoidRef]);

    return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
};

export default KoiPond;
