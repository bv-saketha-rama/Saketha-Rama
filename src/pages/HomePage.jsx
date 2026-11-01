import { useCallback, useEffect, useRef, useState } from 'react';
import Header from '../components/Header';
import About from '../components/About';
import Experience from '../components/Experience';
import OpenSource from '../components/OpenSource';
import Projects from '../components/Projects';
import Writing from '../components/Writing';
import Research from '../components/Research';
import Connect from '../components/Connect';

// The site is a row of full-screen panels; the page itself never scrolls.
// Nav links, the arrow keys, the wheel and horizontal swipes slide between them.
const panels = [
    { id: 'about', label: 'Me', Component: About },
    { id: 'experience', label: 'Timeline', Component: Experience },
    { id: 'opensource', label: 'Open Source', Component: OpenSource },
    { id: 'projects', label: 'Projects', Component: Projects },
    { id: 'writing', label: 'Blog', Component: Writing },
    { id: 'research', label: 'Research', Component: Research },
    { id: 'connect', label: 'Connect', Component: Connect },
];

const indexOfHash = (hash) => {
    const el = hash.length > 1 ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
    const panel = el?.closest('[data-panel]');
    return panel ? Number(panel.dataset.panel) : -1;
};

const HomePage = () => {
    const [index, setIndex] = useState(0);
    const deckRef = useRef(null);
    const indexRef = useRef(index);
    indexRef.current = index;

    const go = useCallback((i) => setIndex(Math.max(0, Math.min(panels.length - 1, i))), []);

    // Open on the panel named in the URL, and keep the URL in step.
    useEffect(() => {
        const i = indexOfHash(window.location.hash);
        if (i >= 0) go(i);
        const onHash = () => {
            const j = indexOfHash(window.location.hash);
            if (j >= 0) go(j);
        };
        window.addEventListener('hashchange', onHash);
        return () => window.removeEventListener('hashchange', onHash);
    }, [go]);

    useEffect(() => {
        const { pathname, search } = window.location;
        window.history.replaceState(null, '', index ? `#${panels[index].id}` : pathname + search);
    }, [index]);

    // In-page links (nav, skip link) slide to their panel instead of jumping.
    useEffect(() => {
        const onClick = (e) => {
            const a = e.target.closest('a[href^="#"]');
            if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
            const i = indexOfHash(a.getAttribute('href'));
            if (i < 0) return;
            e.preventDefault();
            go(i);
        };
        document.addEventListener('click', onClick);
        return () => document.removeEventListener('click', onClick);
    }, [go]);

    useEffect(() => {
        const deck = deckRef.current;
        const step = (d) => go(indexRef.current + d);

        const onKey = (e) => {
            if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
            if (e.target.closest?.('input, textarea, select, [contenteditable="true"]')) return;
            if (e.key === 'ArrowRight') step(1);
            else if (e.key === 'ArrowLeft') step(-1);
            else return;
            e.preventDefault();
        };

        // One gesture, one panel: a trackpad keeps sending wheel events long after
        // the fingers lift, so after a slide the rest of that stream is ignored.
        // A vertical wheel scrolls the panel first while it still has room to.
        let lastWheel = 0;
        let lastSlide = 0;
        let consumed = false;
        const onWheel = (e) => {
            const now = performance.now();
            if (now - lastWheel > 220) consumed = false;
            lastWheel = now;
            if (consumed || now - lastSlide < 650) return;
            const horizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
            const delta = horizontal ? e.deltaX : e.deltaY;
            if (Math.abs(delta) < 12) return;
            if (!horizontal) {
                const scroller = deck.children[indexRef.current]?.querySelector('.panel-scroll');
                if (scroller) {
                    const room = delta > 0 ? scroller.scrollHeight - scroller.clientHeight - scroller.scrollTop : scroller.scrollTop;
                    if (room > 1) return;
                }
            }
            consumed = true;
            lastSlide = now;
            step(delta > 0 ? 1 : -1);
        };

        let touch = null;
        const onTouchStart = (e) => {
            const t = e.touches[0];
            touch = e.touches.length === 1 ? { x: t.clientX, y: t.clientY, at: performance.now() } : null;
        };
        const onTouchEnd = (e) => {
            if (!touch) return;
            const t = e.changedTouches[0];
            const dx = t.clientX - touch.x;
            const dy = t.clientY - touch.y;
            const fast = performance.now() - touch.at < 600;
            touch = null;
            if (Math.abs(dx) > (fast ? 40 : 90) && Math.abs(dx) > Math.abs(dy) * 1.4) step(dx < 0 ? 1 : -1);
        };

        window.addEventListener('keydown', onKey);
        deck.addEventListener('wheel', onWheel, { passive: true });
        deck.addEventListener('touchstart', onTouchStart, { passive: true });
        deck.addEventListener('touchend', onTouchEnd, { passive: true });
        return () => {
            window.removeEventListener('keydown', onKey);
            deck.removeEventListener('wheel', onWheel);
            deck.removeEventListener('touchstart', onTouchStart);
            deck.removeEventListener('touchend', onTouchEnd);
        };
    }, [go]);

    return (
        <div className="app">
            <a href="#experience" className="skip-link">Skip to content</a>
            <Header links={panels} active={index} />

            <main className="deck">
                <div ref={deckRef} className="deck-track" style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}>
                    {panels.map(({ id, Component }, i) => (
                        // Off-screen panels are inert, so focus and find-in-page stay on the visible one.
                        <div key={id} data-panel={i} data-active={i === index ? '' : undefined} inert={i === index ? undefined : ''} className="panel">
                            <Component />
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default HomePage;
