// Koi pond simulation + cell renderer for the hero (Canvas 2D, no deps).
// Fish are chains of spine points; every frame each fish is rasterised onto
// a coarse square grid, so the whole pond reads as fine "pixel cells".

const TAU = Math.PI * 2;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const smoothstep = (a, b, v) => {
    const x = clamp((v - a) / (b - a), 0, 1);
    return x * x * (3 - 2 * x);
};
const wrapAngle = (a) => Math.atan2(Math.sin(a), Math.cos(a));

const hash2 = (a, b) => {
    let h = (Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263)) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};
const noise2 = (x, y) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const u = (x - xi) * (x - xi) * (3 - 2 * (x - xi));
    const v = (y - yi) * (y - yi) * (3 - 2 * (y - yi));
    const a = hash2(xi, yi);
    const b = hash2(xi + 1, yi);
    const c = hash2(xi, yi + 1);
    const d = hash2(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
};
const rng = (seed) => () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// main = pattern patches, alt = base scales, deep = scale texture / dorsal ridge,
// edge = outline speckle, fin/finDeep = translucent fins with darker rays.
// spot = a second pattern colour; scales = reticulated (asagi-style) body.
const KINDS = {
    orange: { main: '#E8641C', alt: '#FCF1E8', deep: '#C24E12', edge: '#F2B48C', fin: 'rgba(232,100,28,0.36)', finDeep: 'rgba(194,78,18,0.6)', thr: 0.42, spot: '#2A2E37', spotThr: 0.8 },
    coral: { main: '#F2735A', alt: '#FEE9E2', deep: '#D7553C', edge: '#F6B1A1', fin: 'rgba(242,115,90,0.36)', finDeep: 'rgba(215,85,60,0.6)', thr: 0.46 },
    cobalt: { main: '#2457E6', alt: '#DCE5FC', deep: '#173FB4', edge: '#8EA8F3', fin: 'rgba(36,87,230,0.3)', finDeep: 'rgba(23,63,180,0.55)', scales: true, belly: '#E8641C' },
    indigo: { main: '#5B5EF0', alt: '#E6E6FD', deep: '#3F42CF', edge: '#ABADF7', fin: 'rgba(91,94,240,0.32)', finDeep: 'rgba(63,66,207,0.55)', thr: 0.38 },
    sage: { main: '#7F9C84', alt: '#ECF1EA', deep: '#5F7D66', edge: '#B8CAB9', fin: 'rgba(127,156,132,0.36)', finDeep: 'rgba(95,125,102,0.6)', thr: 0.36, spot: '#E8641C', spotThr: 0.83 },
};
const LARGE = ['orange', 'cobalt', 'coral'];
const SMALL = ['indigo', 'sage', 'coral', 'cobalt', 'orange', 'indigo', 'sage'];
const EYE = '#1E2128';
const SHADOW = 'rgba(23,25,30,0.045)';
const PAD = 'rgba(122,143,128,0.5)';
const PAD_EDGE = 'rgba(96,117,102,0.66)';
const RIPPLE = '#A3A7B0';
const SPARK = '#BEC1C8';

// Half-width of the body (in units of W) along the spine, s = 0 at the nose.
const bodyWidth = (s) => {
    if (s < 0.12) return 0.5 + 0.5 * Math.sin((s / 0.12) * (Math.PI / 2));
    if (s < 0.32) return 1;
    if (s < 0.8) return 1 - 0.82 * smoothstep(0.32, 0.8, s);
    return 0.18 + (s - 0.8) * 5.4; // tail fin fans out
};

export function createPond({ reduced = false, seed = 7 } = {}) {
    const rand = rng(seed);
    let W = 0;
    let H = 0;
    let cell = 5;
    let mask = null; // never draw inside (the intro text)
    let avoid = null; // fish steer around this larger rect
    let fish = [];
    let pads = [];
    let padObs = []; // lily pads as circles the fish swim around
    let occ = new Uint8Array(0); // per-frame owner of each grid cell, so nothing ever draws over anything else
    let cols = 0;
    let sparks = [];
    const ripples = [];
    let food = null;
    let t = 0;
    let nextAmbient = 3;
    const pointer = { x: 0, y: 0, on: false, speed: 0, still: 0, lastRipple: { x: -999, y: -999, t: -9 } };

    const inRect = (r, x, y, pad = 0) => r && x > r.x - pad && x < r.x + r.w + pad && y > r.y - pad && y < r.y + r.h + pad;
    const masked = (x, y) => inRect(mask, x, y);

    const freeSpot = (margin) => {
        for (let k = 0; k < 60; k++) {
            const x = margin + rand() * (W - margin * 2);
            const y = margin + rand() * (H - margin * 2);
            if (inRect(avoid, x, y, 30)) continue;
            if (padObs.some((o) => Math.hypot(x - o.x, y - o.y) < o.r + margin * 0.8)) continue;
            return { x, y };
        }
        return { x: W - margin, y: H / 2 };
    };

    const openWater = () => {
        for (let k = 0; k < 30; k++) {
            const x = 20 + rand() * (W - 40);
            const y = 20 + rand() * (H - 40);
            if (!inRect(mask, x, y, 30)) return { x, y };
        }
        return { x: W - 40, y: H - 40 };
    };

    // The free spot (of a few candidates) furthest from where other fish are or are heading.
    const spreadSpot = (f, margin) => {
        let best = null;
        let score = -1;
        for (let k = 0; k < 12; k++) {
            const s = freeSpot(margin);
            let min = Infinity;
            for (const o of fish) {
                if (o === f) continue;
                min = Math.min(min, Math.hypot(s.x - o.pts[0].x, s.y - o.pts[0].y));
                if (o.target) min = Math.min(min, Math.hypot(s.x - o.target.x, s.y - o.target.y));
            }
            const sc = min + (f ? Math.min(300, Math.hypot(s.x - f.pts[0].x, s.y - f.pts[0].y)) * 0.3 : 0);
            if (sc > score) {
                score = sc;
                best = s;
            }
        }
        return best;
    };

    const makeFish = (kind, i, big, scale) => {
        const k = big ? 1 : 0.46 + rand() * 0.2;
        const L = (big ? 245 + rand() * 35 : 230) * k * scale;
        const w = (big ? 28 + rand() * 4 : 27 * (0.92 + rand() * 0.16)) * k * scale;
        const N = 18;
        const margin = 30 + L * 0.34;
        const { x, y } = spreadSpot(null, margin);
        const a = rand() * TAU;
        const seg = L / (N - 1);
        const pts = Array.from({ length: N }, (_, j) => ({ x: x - Math.cos(a) * seg * j, y: y - Math.sin(a) * seg * j }));
        return {
            pal: KINDS[kind],
            id: i + 1,
            seed: rand() * 100,
            big,
            a,
            N,
            L,
            w,
            seg,
            pts,
            margin,
            base: big ? 15 + rand() * 6 : 22 + rand() * 12,
            v: 0,
            turn: 0,
            brake: 0,
            stuck: 0,
            escape: 0,
            since: { x: 0, y: 0 },
            boost: 0,
            phase: rand() * TAU,
            target: null,
            retarget: 0,
            trail: [],
            trailT: 0,
        };
    };

    // A new place to swim to, away from where the others are.
    const pickTarget = (f) => {
        f.retarget = t + 8 + rand() * 7;
        f.target = spreadSpot(f, f.margin);
    };

    const layoutPads = (mobile) => {
        const spots = mobile
            ? [[0.86, 0.12, 20], [0.12, 0.9, 16]]
            : [
                  [0.955, 0.11, 30], [0.62, 0.91, 22], [0.97, 0.87, 24], [0.76, 0.07, 14],
                  [0.05, 0.13, 24], [0.09, 0.86, 30], [0.3, 0.92, 17], [0.4, 0.08, 14],
              ];
        pads = [];
        padObs = [];
        spots.forEach(([fx, fy, r], i) => {
            const R = r * (mobile ? 1 : clamp(H / 640, 0.75, 1.1));
            let cx = fx * W;
            let cy = fy * H;
            // In the fish's water a pad either leaves room to swim past, or tucks
            // under the edge: a narrow gap would be a dead end a fish gets stuck in.
            const fishLeft = avoid && !mobile ? avoid.x + avoid.w : 0;
            if (cx > fishLeft) {
                const room = mobile ? 70 : 110;
                const tuck = R * 0.35;
                if (cx - R - fishLeft < room) cx = fishLeft + R + room;
                if (W - (cx + R) < room) cx = W - R + tuck;
                if (cy - R < room) cy = R - tuck;
                else if (H - (cy + R) < room) cy = H - R + tuck;
            } else if (cx - R < 6 || cx + R > W - 6 || cy - R < 6 || cy + R > H - 6) return;
            if (mask && cx + R > mask.x - 24 && cx - R < mask.x + mask.w + 24 && cy + R > mask.y - 24 && cy - R < mask.y + mask.h + 24) return;
            padObs.push({ x: cx, y: cy, r: R });
            const notch = hash2(i, 9) * TAU;
            const cells = [];
            for (let gy = Math.floor((cy - R) / cell); gy <= (cy + R) / cell; gy++) {
                for (let gx = Math.floor((cx - R) / cell); gx <= (cx + R) / cell; gx++) {
                    const px = (gx + 0.5) * cell;
                    const py = (gy + 0.5) * cell;
                    const d = Math.hypot(px - cx, py - cy);
                    if (d > R || px < 0 || py < 0 || px > W || py > H) continue;
                    if (d > R * 0.15 && Math.abs(wrapAngle(Math.atan2(py - cy, px - cx) - notch)) < 0.32) continue;
                    if (hash2(gx * 3 + i, gy) > 0.86) continue;
                    cells.push(gx, gy, d > R - cell * 1.2 ? 1 : 0);
                }
            }
            pads.push(cells);
        });
    };

    const layoutSparks = () => {
        const n = Math.round((W * H) / 26000);
        sparks = [];
        for (let k = 0; k < n; k++) {
            const x = 8 + rand() * (W - 16);
            const y = 8 + rand() * (H - 16);
            if (inRect(mask, x, y, 16)) continue;
            sparks.push({ x, y, plus: rand() < 0.45, warm: rand() < 0.18, ph: rand() * TAU });
        }
    };

    const ripple = (x, y, max, dur) => {
        if (inRect(mask, x, y)) return;
        ripples.push({ x, y, max, dur, t0: t });
        if (ripples.length > 16) ripples.shift();
    };

    // ---- simulation --------------------------------------------------------

    const steer = (f, dt) => {
        const head = f.pts[0];
        const dx = Math.cos(f.a);
        const dy = Math.sin(f.a);
        const look = 40 + f.L * 0.3;
        const lx = head.x + dx * look;
        const ly = head.y + dy * look;
        let fx = 0;
        let fy = 0;

        // Soft walls, scaled to body length so tails never clip the edges.
        const m = f.margin;
        for (const [px, py, k] of [[lx, ly, 1], [head.x, head.y, 1.6]]) {
            if (px < m) fx += (k * (m - px)) / m;
            if (px > W - m) fx -= (k * (px - (W - m))) / m;
            if (py < m) fy += (k * (m - py)) / m;
            if (py > H - m) fy -= (k * (py - (H - m))) / m;
        }
        // ...and keep the body and tail in the water while turning.
        const bm = f.w * 1.6 + 8;
        for (const i of [8, f.N - 1]) {
            const p = f.pts[i];
            if (p.x < bm) fx += 1.4;
            if (p.x > W - bm) fx -= 1.4;
            if (p.y < bm) fy += 1.4;
            if (p.y > H - bm) fy -= 1.4;
        }

        // Keep clear of the intro text (look-ahead and current head).
        if (avoid) {
            // A soft margin around it, like the walls, so fish turn away early.
            for (const [px, py, k0] of [[lx, ly, 1.8], [head.x, head.y, 3]]) {
                if (!inRect(avoid, px, py, m)) continue;
                const dl = px - (avoid.x - m);
                const dr = avoid.x + avoid.w + m - px;
                const dt2 = py - (avoid.y - m);
                const db = avoid.y + avoid.h + m - py;
                const min = Math.min(dl, dr, dt2, db);
                const k = k0 * Math.min(1.5, min / m);
                if (min === dl) fx -= k;
                else if (min === dr) fx += k;
                else if (min === dt2) fy -= k;
                else fy += k;
            }
        }

        // Obstacles (lily pads, other fish's bodies): probe the water ahead, veer
        // to the side they're not on, and ease off the speed while doing so.
        const probes = [[head.x, head.y, 1.4], [head.x + dx * look * 0.5, head.y + dy * look * 0.5, 1.1], [lx, ly, 0.8]];
        let brake = 0;
        const shy = f.id % 2 ? 1 : -1;
        const push = (ox, oy, R, k) => {
            for (const [px, py, pk] of probes) {
                const ex = px - ox;
                const ey = py - oy;
                const d = Math.hypot(ex, ey);
                if (d >= R || d === 0) continue;
                const s = (1 - d / R) * k * pk;
                const lat = ex * -dy + ey * dx;
                const side = Math.abs(lat) > 2 ? Math.sign(lat) : shy;
                fx += (ex / d) * s - dy * side * s * 0.8;
                fy += (ey / d) * s + dx * side * s * 0.8;
                brake = Math.max(brake, (1 - d / R) * pk * 0.45);
            }
        };
        for (const o of padObs) push(o.x, o.y, o.r + f.w * 1.9 + 30, 2.4);
        for (const o of fish) {
            if (o === f) continue;
            const mid = o.pts[o.N >> 1];
            if (Math.hypot(head.x - mid.x, head.y - mid.y) > o.L * 0.6 + look + 120) continue;
            for (let j = 0; j < o.N; j += 2) push(o.pts[j].x, o.pts[j].y, (bodyWidth(j / (o.N - 1)) + 0.6) * o.w + f.w * 1.7 + 30, 1.8);
            // Neighbours a little way off loosely match heading.
            const d = Math.hypot(o.pts[0].x - head.x, o.pts[0].y - head.y);
            if (d > 90 && d < 200) {
                const k = (o.big && !f.big ? 0.22 : 0.08) * (1 - d / 200);
                fx += Math.cos(o.a) * k;
                fy += Math.sin(o.a) * k;
            }
        }
        f.brake = Math.min(0.65, brake);
        // Boxed in (barely moved in the last second and a half)? Head somewhere
        // else, back the way it came.
        f.stuck += dt;
        if (f.stuck > 1.5) {
            if (Math.hypot(head.x - f.since.x, head.y - f.since.y) < f.base * 0.5) {
                pickTarget(f);
                f.escape = 2;
            }
            f.stuck = 0;
            f.since = { x: head.x, y: head.y };
        }
        if (f.escape > 0) {
            f.escape -= dt;
            fx -= dx * 1.2;
            fy -= dy * 1.2;
        }

        // Wander towards a destination, so the pond fills evenly.
        if (t > f.retarget || !f.target || Math.hypot(f.target.x - head.x, f.target.y - head.y) < 80) pickTarget(f);
        const gx = f.target.x - head.x;
        const gy = f.target.y - head.y;
        const gd = Math.hypot(gx, gy) || 1;
        const pull = 0.5 * Math.min(1, gd / 120);
        fx += (gx / gd) * pull;
        fy += (gy / gd) * pull;

        // Cursor: dart away from fast or close movement, drift over when it rests.
        if (pointer.on) {
            const px = head.x - pointer.x;
            const py = head.y - pointer.y;
            const d = Math.hypot(px, py) || 1;
            if ((d < 140 && pointer.speed > 220) || d < 70) {
                const k = 2.2 * (1 - d / 160);
                fx += (px / d) * k;
                fy += (py / d) * k;
                f.boost = Math.max(f.boost, f.big ? 0.9 : 1.4);
            } else if (pointer.still > 1.2 && d < 320 && d > 90) {
                fx -= (px / d) * 0.45;
                fy -= (py / d) * 0.45;
            }
        }

        // Food from a click.
        if (food) {
            const px = food.x - head.x;
            const py = food.y - head.y;
            const d = Math.hypot(px, py) || 1;
            if (d < 460) {
                fx += (px / d) * 0.9;
                fy += (py / d) * 0.9;
                f.boost = Math.max(f.boost, 0.45);
            }
            if (d < 18) {
                ripple(food.x, food.y, 18, 1.1);
                food = null;
            }
        }

        let turn = (noise2(t * 0.1 + f.seed, f.seed * 3.1) - 0.5) * (f.big ? 0.7 : 1.1);
        const mag = Math.hypot(fx, fy);
        if (mag > 0.001) {
            const want = Math.atan2(dy + fy * 1.6, dx + fx * 1.6);
            turn += wrapAngle(want - f.a) * 2.2 * Math.min(1.5, mag);
        }
        // Turning radius grows with body length: wide, unhurried arcs, no tight spins.
        const max = clamp(f.v / (f.L * 0.26), 0.5, 1.6) * (1 + f.boost * 0.6);
        f.turn += (clamp(turn, -max, max) - f.turn) * Math.min(1, dt * 4);
        f.a = wrapAngle(f.a + f.turn * dt);
    };

    // Last resort: nudge the head and mid-body out of lily pads and other fish
    // (fins included); the rest of the spine follows.
    const resolve = (f) => {
        for (const i of [0, 5, 9]) {
            const q = f.pts[i];
            const mine = (bodyWidth(i / (f.N - 1)) + 0.5) * f.w;
            for (const o of padObs) {
                const ex = q.x - o.x;
                const ey = q.y - o.y;
                const d = Math.hypot(ex, ey) || 1;
                const min = o.r + mine + cell;
                if (d < min) {
                    q.x += (ex / d) * (min - d);
                    q.y += (ey / d) * (min - d);
                }
            }
            for (const o of fish) {
                if (o === f) continue;
                for (let j = 0; j < o.N; j++) {
                    const p = o.pts[j];
                    const ex = q.x - p.x;
                    const ey = q.y - p.y;
                    const d = Math.hypot(ex, ey) || 1;
                    const min = (bodyWidth(j / (o.N - 1)) + 0.45) * o.w + mine;
                    if (d < min) {
                        q.x += (ex / d) * (min - d) * 0.5;
                        q.y += (ey / d) * (min - d) * 0.5;
                    }
                }
            }
        }
    };

    // How far a fish's drawn cells reach from its spine at s (fins and tail sway included), in body widths.
    const envelope = (s) => (s > 0.12 && s < 0.4 ? 2.3 : s > 0.5 && s < 0.65 ? 1.5 : bodyWidth(s)) + 0.75 * (0.06 + s * s);

    // Hard separation after everyone has moved: no body, fin or tail ever reaches
    // into a lily pad or another fish, with a cell of open water between them.
    const separate = () => {
        const gap = cell * 1.5;
        for (let a = 0; a < fish.length; a++) {
            const f = fish[a];
            for (let b = a + 1; b < fish.length; b++) {
                const o = fish[b];
                const fm = f.pts[f.N >> 1];
                const om = o.pts[o.N >> 1];
                if (Math.hypot(fm.x - om.x, fm.y - om.y) > (f.L + o.L) * 0.6 + (f.w + o.w) * 2.5) continue;
                for (let i = 0; i < f.N; i++) {
                    const p = f.pts[i];
                    const pr = envelope(i / (f.N - 1)) * f.w;
                    for (let j = 0; j < o.N; j++) {
                        const q = o.pts[j];
                        const ex = p.x - q.x;
                        const ey = p.y - q.y;
                        const d = Math.hypot(ex, ey) || 1;
                        const min = pr + envelope(j / (o.N - 1)) * o.w + gap;
                        if (d >= min) continue;
                        // The smaller fish gives way more.
                        const k = (min - d) / d;
                        const share = f.big === o.big ? 0.5 : f.big ? 0.25 : 0.75;
                        p.x += ex * k * share;
                        p.y += ey * k * share;
                        q.x -= ex * k * (1 - share);
                        q.y -= ey * k * (1 - share);
                    }
                }
            }
        }
        // Walls and the intro's column, then lily pads (pads win in a squeeze); twice to settle.
        for (let pass = 0; pass < 2; pass++) {
            for (const f of fish) {
                for (let i = 0; i < f.N; i++) {
                    const q = f.pts[i];
                    const e = envelope(i / (f.N - 1)) * f.w + cell;
                    q.x = clamp(q.x, e, W - e);
                    q.y = clamp(q.y, e, H - e);
                    if (!avoid) continue;
                    const l = avoid.x - e;
                    const r = avoid.x + avoid.w + e;
                    const tp = avoid.y - e;
                    const b = avoid.y + avoid.h + e;
                    if (q.x <= l || q.x >= r || q.y <= tp || q.y >= b) continue;
                    const m = Math.min(q.x - l, r - q.x, q.y - tp, b - q.y);
                    if (m === r - q.x) q.x = r;
                    else if (m === q.x - l) q.x = l;
                    else if (m === b - q.y) q.y = b;
                    else q.y = tp;
                }
            }
            for (const f of fish) {
                for (let i = 0; i < f.N; i++) {
                    const q = f.pts[i];
                    const mine = envelope(i / (f.N - 1)) * f.w;
                    for (const o of padObs) {
                        const ex = q.x - o.x;
                        const ey = q.y - o.y;
                        const d = Math.hypot(ex, ey) || 1;
                        const min = o.r + mine + gap;
                        if (d < min) {
                            q.x += (ex / d) * (min - d);
                            q.y += (ey / d) * (min - d);
                        }
                    }
                }
            }
        }
    };

    const step = (dt) => {
        t += dt;
        for (const f of fish) {
            steer(f, dt);
            f.boost *= Math.exp(-dt * 1.4);
            // Bursts and glides; slow down through tight turns.
            const glide = 0.65 + 0.7 * noise2(t * 0.22 + f.seed * 1.7, f.seed);
            f.v = f.base * glide * (1 + f.boost) * (1 - 0.3 * Math.min(1, Math.abs(f.turn) / 1.6)) * (1 - f.brake);
            const head = f.pts[0];
            head.x += Math.cos(f.a) * f.v * dt;
            head.y += Math.sin(f.a) * f.v * dt;
            resolve(f);
            for (let i = 1; i < f.N; i++) {
                const p = f.pts[i];
                const q = f.pts[i - 1];
                const ddx = p.x - q.x;
                const ddy = p.y - q.y;
                const d = Math.hypot(ddx, ddy) || 1;
                p.x = q.x + (ddx / d) * f.seg;
                p.y = q.y + (ddy / d) * f.seg;
            }
            f.phase += dt * (1.4 + (f.v / f.base) * 2.2 + (f.big ? 0 : 0.8));
            f.trailT += dt;
            if (f.trailT > 0.11) {
                f.trailT = 0;
                const tail = f.pts[f.N - 1];
                f.trail.push({ x: tail.x, y: tail.y, t });
            }
            while (f.trail.length && t - f.trail[0].t > 1.8) f.trail.shift();
        }
        separate();
        while (ripples.length && t - ripples[0].t0 > ripples[0].dur) ripples.shift();
        if (food && t > food.until) food = null;
        pointer.still += dt;
        pointer.speed *= Math.exp(-dt * 6);

        if (!reduced && t > nextAmbient) {
            nextAmbient = t + 3 + rand() * 4;
            const f = fish[Math.floor(rand() * fish.length)];
            if (f && rand() < 0.4) ripple(f.pts[0].x, f.pts[0].y, 30 + rand() * 20, 2.4);
            else {
                const s = openWater();
                ripple(s.x, s.y, 36 + rand() * 24, 2.8);
            }
        }
    };

    // ---- rendering ---------------------------------------------------------

    const batches = new Map();
    const put = (color, x, y, size) => {
        let b = batches.get(color);
        if (!b) batches.set(color, (b = []));
        b.push(x, y, size);
    };

    const bodyColor = (f, bs, d, side, fl, h) => {
        const { pal, w } = f;
        const lat = (d * side) / w;
        const e = d / (bodyWidth(bs) * w);
        let c;
        if (pal.scales) {
            // Asagi: a net of darker scale rims on the back, warm flanks.
            if (e > 0.56 && bs > 0.14 && bs < 0.72 && noise2(bs * 9 + f.seed, side * 3) > 0.35) c = h < 0.8 ? pal.belly : pal.alt;
            else if (bs < 0.1) c = h < 0.5 ? pal.alt : pal.edge;
            else {
                const u = Math.floor((bs * f.L) / (cell * 1.7) + (fl & 1) * 0.5);
                c = (u + fl) % 2 === 0 && h < 0.75 ? pal.deep : pal.main;
            }
        } else {
            const n = noise2(bs * 7.5 + f.seed, lat * 1.15 + f.seed * 3);
            c = n > pal.thr || bs < 0.045 ? pal.main : pal.alt;
            if (c === pal.main && h < 0.12) c = pal.deep;
            else if (c === pal.alt && h < 0.05) c = pal.edge;
            if (pal.spot && bs > 0.12 && noise2(bs * 14 + f.seed * 2, lat * 2.4 + f.seed) > pal.spotThr) c = pal.spot;
        }
        // Dorsal ridge down the back.
        if (Math.abs(lat) < 0.15 && bs > 0.2 && bs < 0.62 && h > 0.3) c = c === pal.main || c === pal.deep ? pal.deep : pal.edge;
        return c;
    };

    const rasterFish = (f) => {
        const { N, w, pal } = f;
        // Undulate the spine sideways: little at the head, most at the tail.
        const rp = new Array(N);
        const amp = w * 0.55 * (0.5 + 0.45 * Math.min(1.6, f.v / f.base)) * (1 + Math.min(0.5, f.boost * 0.3));
        let x0 = Infinity;
        let y0 = Infinity;
        let x1 = -Infinity;
        let y1 = -Infinity;
        for (let i = 0; i < N; i++) {
            const a = f.pts[Math.max(0, i - 1)];
            const b = f.pts[Math.min(N - 1, i + 1)];
            const tx = b.x - a.x;
            const ty = b.y - a.y;
            const tl = Math.hypot(tx, ty) || 1;
            const s = i / (N - 1);
            const off = Math.sin(f.phase - s * 6.2) * amp * (0.06 + s * s);
            const p = { x: f.pts[i].x - (ty / tl) * off, y: f.pts[i].y + (tx / tl) * off };
            rp[i] = p;
            if (p.x < x0) x0 = p.x;
            if (p.y < y0) y0 = p.y;
            if (p.x > x1) x1 = p.x;
            if (p.y > y1) y1 = p.y;
        }
        const reach = w * 2.2;
        const gx0 = Math.max(0, Math.floor((x0 - reach) / cell));
        const gx1 = Math.ceil((x1 + reach) / cell);
        const gy0 = Math.max(0, Math.floor((y0 - reach) / cell));
        const gy1 = Math.ceil((y1 + reach) / cell);
        const flap = 0.75 + 0.25 * Math.sin(f.phase * 0.55);
        const turnK = clamp(f.turn / 2, -1, 1);
        const so = Math.max(3, w * 0.35); // shadow offset

        for (let gy = gy0; gy <= gy1; gy++) {
            for (let gx = gx0; gx <= gx1; gx++) {
                const cx = (gx + 0.5) * cell;
                const cy = (gy + 0.5) * cell;
                if (cx > W || cy > H || masked(cx, cy)) continue;
                const idx = gy * cols + gx;
                if (occ[idx] && occ[idx] !== f.id) continue;

                // Nearest point on the spine.
                let best = Infinity;
                let bs = 0;
                let side = 1;
                for (let i = 0; i < N - 1; i++) {
                    const a = rp[i];
                    const b = rp[i + 1];
                    const sx = b.x - a.x;
                    const sy = b.y - a.y;
                    const l2 = sx * sx + sy * sy || 1;
                    const u = clamp(((cx - a.x) * sx + (cy - a.y) * sy) / l2, 0, 1);
                    const qx = cx - (a.x + sx * u);
                    const qy = cy - (a.y + sy * u);
                    const d2 = qx * qx + qy * qy;
                    if (d2 < best) {
                        best = d2;
                        bs = (i + u) / (N - 1);
                        side = sx * qy - sy * qx >= 0 ? 1 : -1;
                    }
                }
                if (best > reach * reach) continue;
                const d = Math.sqrt(best);
                const bw = bodyWidth(bs) * w;
                const fs = Math.round(bs * 48);
                const fl = Math.round((d / cell) * side);
                const h = hash2(fs * 7 + f.id, fl + f.id * 31);

                if (d <= bw) {
                    if (bs >= 0.8) {
                        // Forked tail fin with darker rays.
                        const k = (bs - 0.8) / 0.2;
                        if (k > 0.55 && d < bw * 0.5 * (k - 0.55) * 2.2) continue;
                        if (h < 0.3 + k * 0.3) continue;
                        (occ[idx] = f.id), put(fl % 3 === 0 ? pal.finDeep : pal.fin, cx, cy, cell * 0.55);
                        continue;
                    }
                    if (!masked(cx + so, cy + so * 1.3)) put(SHADOW, cx + so, cy + so * 1.3, cell * 0.9);
                    const e = d / bw;
                    if (bs > 0.06 && bs < 0.115 && e > 0.42 && e < 0.8) {
                        (occ[idx] = f.id), put(EYE, cx, cy, cell * 0.7);
                        continue;
                    }
                    if (e > 0.8) {
                        if (h < 0.15) continue;
                        (occ[idx] = f.id), put(h < 0.6 ? pal.edge : pal.alt, cx, cy, cell * 0.58);
                        continue;
                    }
                    (occ[idx] = f.id), put(bodyColor(f, bs, d, side, fl, h), cx, cy, cell * 0.82);
                    continue;
                }

                // Pectoral and pelvic fins; the fin on the inside of a turn spreads wider.
                const spread = flap * (1 + 0.35 * turnK * side);
                if (bs > 0.15 && bs < 0.36) {
                    const bump = Math.sin(((bs - 0.15) / 0.21) * Math.PI);
                    if (d < w * (1 + 1.05 * bump * spread) && h > 0.35) (occ[idx] = f.id), put((fs + fl) % 3 === 0 ? pal.finDeep : pal.fin, cx, cy, cell * 0.52);
                } else if (f.big && bs > 0.52 && bs < 0.62) {
                    const bump = Math.sin(((bs - 0.52) / 0.1) * Math.PI);
                    if (d < bw + w * 0.45 * bump * spread && h > 0.45) (occ[idx] = f.id), put(pal.fin, cx, cy, cell * 0.5);
                }
            }
        }

        // Barbels at the mouth of the big fish.
        if (f.big) {
            const hx = rp[0].x - rp[1].x;
            const hy = rp[0].y - rp[1].y;
            const hl = Math.hypot(hx, hy) || 1;
            const ux = hx / hl;
            const uy = hy / hl;
            for (const sgn of [-1, 1]) {
                for (let j = 1; j <= 2; j++) {
                    const x = rp[0].x + ux * cell * (0.6 + j * 0.5) - uy * sgn * w * (0.25 + j * 0.18);
                    const y = rp[0].y + uy * cell * (0.6 + j * 0.5) + ux * sgn * w * (0.25 + j * 0.18);
                    const gx = Math.floor(x / cell);
                    const gy = Math.floor(y / cell);
                    const idx = gy * cols + gx;
                    if (x < 0 || y < 0 || x > W || y > H || masked(x, y) || (occ[idx] && occ[idx] !== f.id)) continue;
                    occ[idx] = f.id;
                    put(pal.edge, (gx + 0.5) * cell, (gy + 0.5) * cell, cell * 0.45);
                }
            }
        }
    };

    const draw = (ctx, dpr) => {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, W, H);
        batches.clear();

        // Sparkles.
        for (const s of sparks) {
            const a = reduced ? 0.6 : 0.35 + 0.35 * Math.sin(t * 0.9 + s.ph);
            ctx.globalAlpha = a;
            ctx.fillStyle = s.warm ? '#E86B23' : SPARK;
            if (s.plus) {
                ctx.fillRect(s.x - 3, s.y - 0.5, 6, 1);
                ctx.fillRect(s.x - 0.5, s.y - 3, 1, 6);
            } else ctx.fillRect(s.x - 1, s.y - 1, 2, 2);
        }

        // Wakes: faint dots left behind the tail.
        for (const f of fish) {
            for (const p of f.trail) {
                const age = (t - p.t) / 1.8;
                if (masked(p.x, p.y)) continue;
                ctx.globalAlpha = (1 - age) * 0.4;
                ctx.fillStyle = f.pal.edge;
                ctx.fillRect(Math.floor(p.x / cell) * cell + cell * 0.3, Math.floor(p.y / cell) * cell + cell * 0.3, cell * 0.4, cell * 0.4);
            }
        }

        // Ripples: dotted rings.
        ctx.fillStyle = RIPPLE;
        for (const r of ripples) {
            const k = (t - r.t0) / r.dur;
            const rad = r.max * (1 - (1 - k) * (1 - k));
            for (const [rr, alpha] of [[rad, 0.55], [rad * 0.55, 0.35]]) {
                if (rr < 3) continue;
                const n = Math.max(8, Math.floor((TAU * rr) / 7));
                ctx.globalAlpha = (1 - k) * alpha;
                for (let i = 0; i < n; i++) {
                    const x = r.x + Math.cos((i / n) * TAU) * rr;
                    const y = r.y + Math.sin((i / n) * TAU) * rr;
                    if (!masked(x, y)) ctx.fillRect(x - 0.8, y - 0.8, 1.6, 1.6);
                }
            }
        }
        if (food) {
            ctx.globalAlpha = 0.8;
            ctx.fillStyle = '#E86B23';
            ctx.fillRect(food.x - 1.5, food.y - 1.5, 3, 3);
        }
        ctx.globalAlpha = 1;

        // Lily pads claim their cells, then big fish, then small ones; a claimed
        // cell is never drawn again. Shadows sit underneath everything.
        occ.fill(0);
        batches.set(SHADOW, []);
        for (const cells of pads) {
            for (let i = 0; i < cells.length; i += 3) {
                occ[cells[i + 1] * cols + cells[i]] = 255;
                put(cells[i + 2] ? PAD_EDGE : PAD, (cells[i] + 0.5) * cell, (cells[i + 1] + 0.5) * cell, cell * 0.62);
            }
        }
        for (let i = fish.length - 1; i >= 0; i--) rasterFish(fish[i]);
        for (const [color, b] of batches) {
            ctx.fillStyle = color;
            for (let i = 0; i < b.length; i += 3) {
                const s = b[i + 2];
                ctx.fillRect(b[i] - s / 2, b[i + 1] - s / 2, s, s);
            }
        }
    };

    return {
        resize(w, h, textRect, mobile) {
            const fresh = !fish.length || Math.abs(w - W) > 80 || Math.abs(h - H) > 80;
            W = w;
            H = h;
            cell = mobile ? 4 : 5;
            cols = Math.ceil(W / cell) + 2;
            occ = new Uint8Array(cols * (Math.ceil(H / cell) + 2));
            mask = textRect ? { x: textRect.x - 18, y: textRect.y - 14, w: textRect.w + 36, h: textRect.h + 28 } : null;
            // On wide layouts the whole intro column is off limits, so the fish own the right side.
            avoid = mask && !mobile ? { x: -1e4, y: -1e4, w: mask.x + mask.w + 50 + 1e4, h: 2e4 } : mask && { x: mask.x - 40, y: mask.y - 40, w: mask.w + 80, h: mask.h + 80 };
            layoutPads(mobile);
            layoutSparks();
            if (fresh) {
                const left = avoid && !mobile ? avoid.x + avoid.w : 0;
                const regionW = W - left;
                const count = mobile ? 4 : clamp(Math.round((regionW * H) / 80000), 6, 9);
                const big = mobile ? 1 : count >= 8 ? 3 : 2;
                const scale = mobile ? 0.6 : clamp(H / 700, 0.72, 1) * clamp(regionW / 700, 0.75, 1);
                fish = [];
                for (let i = 0; i < count; i++) {
                    const isBig = i < big;
                    fish.push(makeFish(isBig ? LARGE[i] : SMALL[i - big], i, isBig, scale));
                }
                // Let them settle into natural curves before the first frame.
                for (let i = 0; i < 150; i++) step(1 / 30);
            }
        },
        update(dt) {
            step(dt);
        },
        draw,
        pointerMove(x, y, now) {
            const moved = pointer.on ? Math.hypot(x - pointer.x, y - pointer.y) : 0;
            pointer.speed = Math.max(pointer.speed, moved / Math.max(0.016, now - (pointer.at || now)));
            pointer.at = now;
            pointer.x = x;
            pointer.y = y;
            pointer.on = true;
            if (moved > 1) pointer.still = 0;
            const lr = pointer.lastRipple;
            if (Math.hypot(x - lr.x, y - lr.y) > 90 && t - lr.t > 0.4) {
                ripple(x, y, 22, 1.4);
                Object.assign(lr, { x, y, t });
            }
        },
        pointerLeave() {
            pointer.on = false;
        },
        tap(x, y) {
            ripple(x, y, 56, 2.2);
            ripple(x, y, 28, 1.6);
            if (!masked(x, y)) food = { x, y, until: t + 6 };
        },
    };
}
