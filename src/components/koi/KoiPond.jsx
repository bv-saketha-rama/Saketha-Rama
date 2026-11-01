import { useEffect, useRef } from 'react';
import { createPond } from './pond';

// Decorative koi pond filling its parent. Pointer and clicks are read from the
// parent, so the pond still reacts under any content laid over it.
const KoiPond = ({ className = '' }) => {
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

        // Text marked data-pond-focus fades the fish that swim under it. Its box is
        // measured from the text itself (not the full-width blocks holding it), so
        // only the area around the words is affected.
        const area = canvas.parentElement;
        const focusEl = area.querySelector('[data-pond-focus]');
        const measureFocus = () => {
            if (!focusEl) return;
            const c = canvas.getBoundingClientRect();
            const range = document.createRange();
            let [l, t, r, b] = [Infinity, Infinity, -Infinity, -Infinity];
            for (const child of focusEl.children) {
                range.selectNodeContents(child);
                const box = range.getBoundingClientRect();
                if (!box.width || !box.height) continue;
                l = Math.min(l, box.left);
                t = Math.min(t, box.top);
                r = Math.max(r, box.right);
                b = Math.max(b, box.bottom);
            }
            pond.setFocus(r > l ? { x: Math.round(l - c.left), y: Math.round(t - c.top), w: Math.round(r - l), h: Math.round(b - t) } : null);
        };

        const layout = () => {
            const r = canvas.getBoundingClientRect();
            if (!r.width || !r.height) return;
            dpr = Math.min(2, window.devicePixelRatio || 1);
            canvas.width = Math.round(r.width * dpr);
            canvas.height = Math.round(r.height * dpr);
            pond.resize(r.width, r.height, r.width < 768);
            measureFocus();
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

        // Follow the site theme (set on <html> by the header toggle).
        const root = document.documentElement;
        const applyTheme = () => pond.setTheme(root.dataset.theme === 'dark');
        applyTheme();
        const mo = new MutationObserver(() => {
            applyTheme();
            pond.draw(ctx, dpr);
        });
        mo.observe(root, { attributes: true, attributeFilter: ['data-theme'] });

        layout();
        const ro = new ResizeObserver(layout);
        ro.observe(canvas);
        // The text reflows on its own too (e.g. once the web fonts load).
        const refocus = () => {
            measureFocus();
            pond.draw(ctx, dpr);
        };
        const fro = new ResizeObserver(refocus);
        if (focusEl) fro.observe(focusEl);
        document.fonts?.ready.then(refocus);
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
        // A click (not pointerdown, so a scroll on touch doesn't drop food) feeds
        // the fish; clicks on links and buttons are left alone.
        const onClick = (e) => !reduced && !e.target.closest('a, button') && pond.tap(...local(e));
        area.addEventListener('pointermove', onMove);
        area.addEventListener('pointerleave', onLeave);
        area.addEventListener('click', onClick);

        return () => {
            stop();
            ro.disconnect();
            fro.disconnect();
            mo.disconnect();
            io.disconnect();
            document.removeEventListener('visibilitychange', onVisibility);
            area.removeEventListener('pointermove', onMove);
            area.removeEventListener('pointerleave', onLeave);
            area.removeEventListener('click', onClick);
        };
    }, []);

    return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
};

export default KoiPond;
