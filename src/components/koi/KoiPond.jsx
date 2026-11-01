import { useEffect, useRef } from 'react';
import { createPond } from './pond';

// Decorative koi pond filling its parent. Pointer and clicks are read from the
// parent, so the pond still reacts under any content laid over it.
//
// Text marked data-pond-focus (the intro, and the header laid over the top of
// the pond) fades the fish that swim under it. Each box is measured from the
// words themselves (not the full-width blocks holding them), so only the area
// around them is affected.
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

        const area = canvas.parentElement;
        const header = document.querySelector('header');
        const focusEls = () => [header, area].flatMap((el) => (el ? [...el.querySelectorAll('[data-pond-focus]')] : []));
        const range = document.createRange();
        const textBox = (el) => {
            let [l, t, r, b] = [Infinity, Infinity, -Infinity, -Infinity];
            for (const node of el.children.length ? el.children : [el]) {
                range.selectNodeContents(node);
                const box = range.getBoundingClientRect();
                if (!box.width || !box.height) continue;
                l = Math.min(l, box.left);
                t = Math.min(t, box.top);
                r = Math.max(r, box.right);
                b = Math.max(b, box.bottom);
            }
            return r > l ? { l, t, r, b } : null;
        };
        // Measured afresh each frame, so the zones follow the panel sliding and the
        // intro settling in; the mask is only rebuilt when they actually move.
        const measureFocus = () => {
            const c = canvas.getBoundingClientRect();
            const rects = [];
            const add = (box) => {
                if (!box || box.r < c.left || box.l > c.right || box.b < c.top || box.t > c.bottom) return;
                rects.push({ x: Math.round(box.l - c.left), y: Math.round(box.t - c.top), w: Math.round(box.r - box.l), h: Math.round(box.b - box.t) });
            };
            for (const el of focusEls()) add(textBox(el));
            pond.setFocus(rects);
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
            measureFocus();
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
        // Without the animation loop (reduced motion), the zones are re-measured
        // whenever something settles or is clicked.
        const refocus = () => {
            if (raf) return;
            measureFocus();
            pond.draw(ctx, dpr);
        };
        const refocusSoon = () => requestAnimationFrame(refocus);
        document.addEventListener('transitionend', refocus);
        document.addEventListener('animationend', refocus);
        area.addEventListener('click', refocusSoon);
        document.fonts?.ready.then(refocus);
        const io = new IntersectionObserver(([e]) => {
            visible = e.isIntersecting;
            if (visible) start();
            else stop();
        });
        io.observe(canvas);
        const onVisibility = () => (document.hidden ? stop() : start());
        document.addEventListener('visibilitychange', onVisibility);

        // Pond coordinates of the pointer, or null when it's off the pond (the
        // header still listens while another panel is on screen).
        const local = (e) => {
            const r = canvas.getBoundingClientRect();
            const [x, y] = [e.clientX - r.left, e.clientY - r.top];
            return x >= 0 && x <= r.width && y >= 0 && y <= r.height ? [x, y] : null;
        };
        const onMove = (e) => {
            const p = !reduced && local(e);
            if (p) pond.pointerMove(...p, performance.now() / 1000);
            else pond.pointerLeave();
        };
        const onLeave = () => pond.pointerLeave();
        // A click (not pointerdown, so a scroll on touch doesn't drop food) feeds
        // the fish; clicks on links and buttons are left alone.
        const onClick = (e) => {
            const p = !reduced && !e.target.closest('a, button') && local(e);
            if (p) pond.tap(...p);
        };
        // The header sits over the top of the pond, so it listens too.
        const areas = [area, header].filter(Boolean);
        for (const a of areas) {
            a.addEventListener('pointermove', onMove);
            a.addEventListener('pointerleave', onLeave);
            a.addEventListener('click', onClick);
        }

        return () => {
            stop();
            ro.disconnect();
            mo.disconnect();
            io.disconnect();
            document.removeEventListener('visibilitychange', onVisibility);
            document.removeEventListener('transitionend', refocus);
            document.removeEventListener('animationend', refocus);
            area.removeEventListener('click', refocusSoon);
            for (const a of areas) {
                a.removeEventListener('pointermove', onMove);
                a.removeEventListener('pointerleave', onLeave);
                a.removeEventListener('click', onClick);
            }
        };
    }, []);

    return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
};

export default KoiPond;
