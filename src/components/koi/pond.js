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
// spot = a second pattern colour; scales = reticulated (asagi-style) body;
// tancho = white with one red crown; ogon = solid metallic with a moving sheen.
const KINDS = {
    orange: { main: '#E8641C', alt: '#FCF1E8', deep: '#C24E12', edge: '#F2B48C', fin: 'rgba(232,100,28,0.36)', finDeep: 'rgba(194,78,18,0.6)', thr: 0.42, spot: '#2A2E37', spotThr: 0.8 },
    coral: { main: '#F2735A', alt: '#FEE9E2', deep: '#D7553C', edge: '#F6B1A1', fin: 'rgba(242,115,90,0.36)', finDeep: 'rgba(215,85,60,0.6)', thr: 0.46 },
    cobalt: { main: '#2457E6', alt: '#DCE5FC', deep: '#173FB4', edge: '#8EA8F3', fin: 'rgba(36,87,230,0.3)', finDeep: 'rgba(23,63,180,0.55)', scales: true, belly: '#E8641C' },
    indigo: { main: '#5B5EF0', alt: '#E6E6FD', deep: '#3F42CF', edge: '#ABADF7', fin: 'rgba(91,94,240,0.32)', finDeep: 'rgba(63,66,207,0.55)', thr: 0.38 },
    sage: { main: '#7F9C84', alt: '#ECF1EA', deep: '#5F7D66', edge: '#B8CAB9', fin: 'rgba(127,156,132,0.36)', finDeep: 'rgba(95,125,102,0.6)', thr: 0.36, spot: '#E8641C', spotThr: 0.83 },
    tancho: { main: '#E2402F', alt: '#F6F1EA', deep: '#C7321F', edge: '#CFC7BC', fin: 'rgba(214,206,196,0.42)', finDeep: 'rgba(180,170,158,0.6)', tancho: true },
    gold: { main: '#E5A92E', alt: '#F9E19A', deep: '#C28717', edge: '#F2CD72', fin: 'rgba(229,169,46,0.34)', finDeep: 'rgba(194,135,23,0.58)', ogon: true },
    teal: { main: '#1F9E99', alt: '#DDF3F1', deep: '#167A76', edge: '#86CFCB', fin: 'rgba(31,158,153,0.32)', finDeep: 'rgba(22,122,118,0.55)', thr: 0.4 },
};
// The big fish are the showiest varieties; everyone else draws from the full set.
const SHOWY = ['orange', 'tancho', 'cobalt', 'gold', 'coral'];
const ALL = Object.keys(KINDS);
const EYE = '#1E2128';
// The water's own colors, per site theme (the fish keep theirs).
const WATER = {
    light: { shadow: 'rgba(23,25,30,0.045)', pad: 'rgba(122,143,128,0.5)', padEdge: 'rgba(96,117,102,0.66)', ripple: '#A3A7B0', spark: '#BEC1C8' },
    dark: { shadow: 'rgba(0,0,0,0.32)', pad: 'rgba(127,156,132,0.36)', padEdge: 'rgba(150,178,155,0.5)', ripple: '#5C616C', spark: '#4A4F59' },
};

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
    let fish = [];
    let pads = [];
    let padObs = []; // lily pads as circles the fish swim around
    let water = WATER.light;
    let occ = new Uint8Array(0); // per-frame owner of each grid cell, so nothing ever draws over anything else
    let cols = 0;
    let sparks = [];
    const ripples = [];
    let foods = []; // pellets dropped by clicks
    let t = 0;
    let nextAmbient = 3;
    const pointer = { x: 0, y: 0, on: false, speed: 0, movedAt: -9, lastRipple: { x: -999, y: -999, t: -9 } };
    // Text laid over the pond: fish swimming under it fade back (see draw).
    let focus = null;
    let layer = null; // fish are drawn here first, then faded under the text
    let mask = null; // soft-edged zone around the text; alpha = how much to fade
    let maskKey = '';

    const freeSpot = (margin) => {
        for (let k = 0; k < 60; k++) {
            const x = margin + rand() * (W - margin * 2);
            const y = margin + rand() * (H - margin * 2);
            if (padObs.some((o) => Math.hypot(x - o.x, y - o.y) < o.r + margin * 0.8)) continue;
            return { x, y };
        }
        return { x: W - margin, y: H / 2 };
    };

    const openWater = () => ({ x: 20 + rand() * (W - 40), y: 20 + rand() * (H - 40) });

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

    // k is the fish's size: ~1 for the big ones down to ~0.35 for fry.
    const makeFish = (kind, i, k, scale) => {
        const big = k >= 0.85;
        const L = (235 + rand() * 40) * k * scale;
        const w = 28 * (0.9 + rand() * 0.2) * k * scale;
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
            base: 13 + (1 - k) * 26 + rand() * 7, // the smaller, the quicker
            v: 0,
            turn: 0,
            brake: 0,
            stuck: 0,
            escape: 0,
            since: { x: 0, y: 0 },
            boost: 0,
            phase: rand() * TAU,
            target: null,
            food: null,
            follow: false,
            wasLured: false,
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
            ? [[0.86, 0.1, 20], [0.12, 0.92, 16], [0.92, 0.62, 18]]
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
            // A pad either leaves room to swim past, or tucks under the edge:
            // a narrow gap would be a dead end a fish gets stuck in.
            const room = mobile ? 70 : 110;
            const tuck = R * 0.35;
            if (cx - R < room) cx = R - tuck;
            else if (W - (cx + R) < room) cx = W - R + tuck;
            if (cy - R < room) cy = R - tuck;
            else if (H - (cy + R) < room) cy = H - R + tuck;
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
            sparks.push({ x, y, plus: rand() < 0.45, warm: rand() < 0.18, ph: rand() * TAU });
        }
    };

    const ripple = (x, y, max, dur) => {
        ripples.push({ x, y, max, dur, t0: t });
        if (ripples.length > 48) ripples.shift();
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

        // Soft walls, scaled to body length so tails never clip the edges. Softer
        // while chasing food, so pellets near an edge can still be reached.
        const m = f.margin;
        const wk = f.food ? 0.35 : 1;
        for (const [px, py, k0] of [[lx, ly, 1], [head.x, head.y, 1.6]]) {
            const k = k0 * wk;
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
        // Pads are given a narrower berth while chasing food, so pellets beside one get eaten.
        for (const o of padObs) push(o.x, o.y, f.food ? o.r + f.w + 14 : o.r + f.w * 1.9 + 30, f.food ? 1.2 : 2.4);
        for (const o of fish) {
            if (o === f) continue;
            // Fish with nothing to chase keep their distance, so the pond stays spread out.
            const ex = head.x - o.pts[0].x;
            const ey = head.y - o.pts[0].y;
            const hd = Math.hypot(ex, ey) || 1;
            if (!f.food && !f.follow && hd < 180) {
                const k = 0.22 * (1 - hd / 180) ** 2;
                fx += (ex / hd) * k;
                fy += (ey / hd) * k;
            }
            const mid = o.pts[o.N >> 1];
            if (Math.hypot(head.x - mid.x, head.y - mid.y) > o.L * 0.6 + look + 120) continue;
            // On the final approach to a pellet, neighbours get a narrower berth (contact is still prevented).
            const near = f.food && f.foodD < 140;
            for (let j = 0; j < o.N; j += 2) push(o.pts[j].x, o.pts[j].y, (bodyWidth(j / (o.N - 1)) + 0.6) * o.w + f.w * (near ? 1 : 1.7) + (near ? 10 : 30), near ? 0.6 : 1.8);
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
        // A fish backing out of a jam ignores the cursor and food for a moment.
        const lured = f.escape <= 0 && (f.follow || f.food);
        // Done chasing: pick a fresh spot away from the others, so the group spreads out again.
        if (f.wasLured && !lured) pickTarget(f);
        f.wasLured = lured;
        const pull = (lured ? (f.food ? 0 : 0.15) : 0.5) * Math.min(1, gd / 120);
        fx += (gx / gd) * pull;
        fy += (gy / gd) * pull;

        // Cursor: the few fish it draws (see assignLures) swim over, then circle
        // around it rather than piling onto it (each keeps its own orbit).
        if (lured && f.follow) {
            const px = pointer.x - head.x;
            const py = pointer.y - head.y;
            const d = Math.hypot(px, py) || 1;
            const orbit = 50 + f.L * 0.25 + (f.id % 3) * 22;
            if (d > orbit) {
                const k = 0.7 + 0.6 * Math.min(1, (d - orbit) / 200);
                fx += (px / d) * k;
                fy += (py / d) * k;
                if (d > orbit + 60) f.boost = Math.max(f.boost, (f.big ? 1 : 1.6) * Math.min(1, (d - orbit) / 200));
            } else {
                const k = 0.9 * (1 - d / orbit);
                fx += ((-py * shy) / d) * 0.8 - (px / d) * k;
                fy += ((px * shy) / d) * 0.8 - (py / d) * k;
            }
        }

        // Food: race to the pellet this fish was given (see assignLures).
        if (lured && f.food) {
            const px = f.food.x - head.x;
            const py = f.food.y - head.y;
            const d = Math.hypot(px, py) || 1;
            // The pull firms up on the final approach so jostling neighbours can't deflect it.
            const k = d < 140 ? 2.6 : 1.3;
            fx += (px / d) * k;
            fy += (py / d) * k;
            f.boost = Math.max(f.boost, d > 160 ? (f.big ? 0.6 : 0.9) : 0.35);
            // Close by but off to the side: slow right down to turn in, rather than circling it.
            const off = Math.abs(wrapAngle(Math.atan2(py, px) - f.a));
            if (d < 160 && off > 0.5) f.brake = Math.max(f.brake, 0.75 * Math.min(1, off / 1.4));
            f.foodD = d;
        }
        // Any pellet a fish swims over gets eaten, whoever it was meant for.
        for (let i = foods.length - 1; i >= 0; i--) {
            const p = foods[i];
            const mouth = 20 + f.w * 1.1;
            if (Math.hypot(p.x - head.x, p.y - head.y) >= mouth && Math.hypot(p.x - f.pts[1].x, p.y - f.pts[1].y) >= mouth) continue;
            ripple(p.x, p.y, 26, 1.2);
            ripple(p.x, p.y, 12, 0.9);
            foods.splice(i, 1);
            if (f.food === p) f.food = null;
        }

        let turn = (noise2(t * 0.1 + f.seed, f.seed * 3.1) - 0.5) * (f.big ? 0.7 : 1.1);
        const mag = Math.hypot(fx, fy);
        if (mag > 0.001) {
            const want = Math.atan2(dy + fy * 1.6, dx + fx * 1.6);
            let diff = wrapAngle(want - f.a);
            // Pushed from straight ahead (e.g. two fish nose to nose): commit to
            // one side for the U-turn instead of flipping sides every frame.
            if (Math.abs(diff) > 2.6) diff = Math.abs(diff) * (Math.abs(f.turn) > 0.2 ? Math.sign(f.turn) : shy);
            turn += diff * 2.2 * Math.min(1.5, mag);
        }
        // The turning radius never drops below a share of the body length, so a
        // body traces a gentle arc and can't curl up on itself (the spine just
        // follows the head's path). Closing in on a pellet, they slow and pivot
        // towards it, the way feeding koi do, instead of looping wide around it.
        const feeding = lured && f.food && f.foodD < 200;
        const max = clamp(f.v / (f.L * (feeding ? 0.3 : 0.42)), feeding ? 1 : 0.2, 2.4);
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
        // Walls, then lily pads (pads win in a squeeze); twice to settle.
        for (let pass = 0; pass < 2; pass++) {
            for (const f of fish) {
                for (let i = 0; i < f.N; i++) {
                    const q = f.pts[i];
                    const e = envelope(i / (f.N - 1)) * f.w + cell;
                    q.x = clamp(q.x, e, W - e);
                    q.y = clamp(q.y, e, H - e);
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

    // Each pellet draws the fish nearest to it (three for one or two pellets,
    // two each beyond that). Closest pairs are matched first and each fish chases
    // one pellet, so several pellets split the school. A fish sticks with its
    // pellet unless another is clearly closer, so nobody dithers between two.
    // Then the cursor draws up to three of the remaining fish near it, while it moves.
    const assignLures = () => {
        for (const f of fish) {
            f.prev = f.food;
            f.food = null;
            f.follow = false;
        }
        if (foods.length) {
            const cap = foods.length <= 2 ? 3 : 2;
            const pairs = [];
            for (const p of foods) {
                p.n = 0;
                for (const f of fish) pairs.push([Math.hypot(p.x - f.pts[0].x, p.y - f.pts[0].y) * (f.prev === p ? 0.7 : 1), f, p]);
            }
            pairs.sort((a, b) => a[0] - b[0]);
            for (const [, f, p] of pairs) {
                if (f.food || p.n >= cap) continue;
                f.food = p;
                p.n++;
            }
        }
        // Fish already following get a head start, so the three don't keep swapping.
        if (pointer.on && t - pointer.movedAt < 4) {
            fish.filter((f) => !f.food)
                .map((f) => [Math.hypot(pointer.x - f.pts[0].x, pointer.y - f.pts[0].y) * (f.wasLured ? 0.6 : 1), f])
                .filter(([d]) => d < 450)
                .sort((a, b) => a[0] - b[0])
                .slice(0, 3)
                .forEach(([, f]) => (f.follow = true));
        }
    };

    // Pull each spine point to a fixed distance behind the one before it, so a
    // body keeps its length however it's nudged. Only a joint bent past ~30°
    // (which a fish never does on its own) is eased back, as a safety net.
    const follow = (f) => {
        let prev = f.a + Math.PI; // from the head back towards the tail
        for (let i = 1; i < f.N; i++) {
            const q = f.pts[i - 1];
            const p = f.pts[i];
            let ang = Math.atan2(p.y - q.y, p.x - q.x);
            const bend = wrapAngle(ang - prev);
            if (Math.abs(bend) > 0.5) ang = prev + Math.sign(bend) * (0.5 + (Math.abs(bend) - 0.5) * 0.5);
            p.x = q.x + Math.cos(ang) * f.seg;
            p.y = q.y + Math.sin(ang) * f.seg;
            prev = ang;
        }
    };

    const step = (dt) => {
        t += dt;
        foods = foods.filter((p) => t < p.until);
        assignLures();
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
            follow(f);
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
        // Separation nudges points independently; re-chain so bodies keep their shape.
        for (const f of fish) follow(f);
        while (ripples.length && t - ripples[0].t0 > ripples[0].dur) ripples.shift();
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
        if (pal.tancho) {
            // Tancho: a white body with one round red crown on the head.
            const along = (bs - 0.12) * f.L;
            return Math.hypot(along * 0.85, d) < w * 0.62 ? (h < 0.1 ? pal.deep : pal.main) : h < 0.07 ? pal.edge : pal.alt;
        }
        if (pal.ogon) {
            // Ogon: solid metallic, with a sheen that slides down the body.
            const sheen = noise2(bs * 6 - t * 0.45 + f.seed, lat * 1.4 + f.seed);
            c = sheen > 0.68 ? pal.alt : sheen < 0.2 ? pal.deep : pal.main;
        } else if (pal.scales) {
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
                if (cx > W || cy > H) continue;
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
                    put(water.shadow, cx + so, cy + so * 1.3, cell * 0.9);
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
                    if (x < 0 || y < 0 || x > W || y > H || (occ[idx] && occ[idx] !== f.id)) continue;
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
            ctx.fillStyle = s.warm ? '#E86B23' : water.spark;
            if (s.plus) {
                ctx.fillRect(s.x - 3, s.y - 0.5, 6, 1);
                ctx.fillRect(s.x - 0.5, s.y - 3, 1, 6);
            } else ctx.fillRect(s.x - 1, s.y - 1, 2, 2);
        }

        // Wakes: faint dots left behind the tail.
        for (const f of fish) {
            for (const p of f.trail) {
                const age = (t - p.t) / 1.8;
                ctx.globalAlpha = (1 - age) * 0.4;
                ctx.fillStyle = f.pal.edge;
                ctx.fillRect(Math.floor(p.x / cell) * cell + cell * 0.3, Math.floor(p.y / cell) * cell + cell * 0.3, cell * 0.4, cell * 0.4);
            }
        }

        // Ripples: dotted rings.
        ctx.fillStyle = water.ripple;
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
                    ctx.fillRect(x - 0.8, y - 0.8, 1.6, 1.6);
                }
            }
        }
        // Food pellets: orange dots that bob a little and fade before they sink.
        ctx.fillStyle = '#E86B23';
        for (const p of foods) {
            ctx.globalAlpha = 0.9 * Math.min(1, (p.until - t) / 2);
            const bob = reduced ? 0 : Math.sin(t * 2.2 + p.x * 0.05) * 0.8;
            ctx.fillRect(p.x - 2.5, p.y - 2.5 + bob, 5, 5);
        }
        ctx.globalAlpha = 1;

        // Lily pads claim their cells, then big fish, then small ones; a claimed
        // cell is never drawn again. Shadows sit underneath everything.
        occ.fill(0);
        batches.set(water.shadow, []);
        for (const cells of pads) {
            for (let i = 0; i < cells.length; i += 3) {
                occ[cells[i + 1] * cols + cells[i]] = 255;
                put(cells[i + 2] ? water.padEdge : water.pad, (cells[i] + 0.5) * cell, (cells[i + 1] + 0.5) * cell, cell * 0.62);
            }
        }
        flush(ctx);
        batches.clear();
        batches.set(water.shadow, []);
        for (let i = fish.length - 1; i >= 0; i--) rasterFish(fish[i]);
        if (!focus) {
            flush(ctx);
            return;
        }
        // Fish go on their own layer, which is faded through the text mask before
        // landing on the pond: wherever a fish passes under the text it dims, and
        // brightens again as it swims clear. Their motion is untouched.
        const { width, height } = ctx.canvas;
        if (!layer) {
            layer = ctx.canvas.ownerDocument.createElement('canvas');
            mask = ctx.canvas.ownerDocument.createElement('canvas');
        }
        if (layer.width !== width || layer.height !== height) {
            layer.width = width;
            layer.height = height;
        }
        buildMask(width, height, dpr);
        const l = layer.getContext('2d');
        l.setTransform(1, 0, 0, 1, 0, 0);
        l.clearRect(0, 0, width, height);
        l.setTransform(dpr, 0, 0, dpr, 0, 0);
        flush(l);
        l.setTransform(1, 0, 0, 1, 0, 0);
        l.globalCompositeOperation = 'destination-out';
        l.drawImage(mask, 0, 0);
        l.globalCompositeOperation = 'source-over';
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(layer, 0, 0);
    };

    const flush = (c) => {
        for (const [color, b] of batches) {
            c.fillStyle = color;
            for (let i = 0; i < b.length; i += 3) {
                const s = b[i + 2];
                c.fillRect(b[i] - s / 2, b[i + 1] - s / 2, s, s);
            }
        }
    };

    // The fade zone: the text's box plus some padding, feathered at the edges.
    // Drawn as the blurred shadow of an off-canvas rectangle, so the edge is a
    // smooth falloff rather than a visible box. Rebuilt only when it changes.
    const FADE = 0.78; // fish under the text keep ~22% of their opacity
    const PAD = 22;
    const FEATHER = 34;
    const buildMask = (width, height, dpr) => {
        const key = `${width}x${height}@${dpr}:${focus.x},${focus.y},${focus.w},${focus.h}`;
        if (key === maskKey) return;
        maskKey = key;
        mask.width = width;
        mask.height = height;
        const m = mask.getContext('2d');
        const x = (focus.x - PAD) * dpr;
        const y = (focus.y - PAD) * dpr;
        const off = width + 100; // the rectangle itself sits off-canvas; only its shadow lands
        m.shadowColor = `rgba(0,0,0,${FADE})`;
        m.shadowBlur = FEATHER * dpr;
        m.shadowOffsetX = off;
        m.fillStyle = '#000';
        m.fillRect(x - off, y, (focus.w + PAD * 2) * dpr, (focus.h + PAD * 2) * dpr);
    };

    return {
        setTheme(dark) {
            water = dark ? WATER.dark : WATER.light;
        },
        // The box of the text over the pond, in pond coordinates (or null).
        setFocus(rect) {
            focus = rect && rect.w > 0 && rect.h > 0 ? rect : null;
        },
        resize(w, h, mobile) {
            const fresh = !fish.length || Math.abs(w - W) > 80 || Math.abs(h - H) > 80;
            W = w;
            H = h;
            cell = mobile ? 4 : 5;
            cols = Math.ceil(W / cell) + 2;
            occ = new Uint8Array(cols * (Math.ceil(H / cell) + 2));
            layoutPads(mobile);
            layoutSparks();
            if (fresh) {
                const count = mobile ? 7 : clamp(Math.round((W * H) / 75000), 8, 15);
                const scale = mobile ? 0.6 : clamp(H / 700, 0.72, 1) * clamp(W / 700, 0.75, 1);
                // A mixed school: a few big fish, more medium and small ones, and some fry.
                const sizes = [];
                for (let i = 0; i < count; i++) {
                    const u = i / count;
                    sizes.push(u < 0.2 ? 0.95 + rand() * 0.15 : u < 0.45 ? 0.68 + rand() * 0.14 : u < 0.78 ? 0.48 + rand() * 0.12 : 0.34 + rand() * 0.09);
                }
                // Colours: every variety shows up before any repeats.
                const pool = ALL.slice().sort(() => rand() - 0.5);
                const showy = SHOWY.slice().sort(() => rand() - 0.5);
                fish = [];
                let b = 0;
                let s = 0;
                for (let i = 0; i < count; i++) {
                    const kind = sizes[i] >= 0.85 ? showy[b++ % showy.length] : pool[s++ % pool.length];
                    fish.push(makeFish(kind, i, sizes[i], scale));
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
            if (moved > 1) pointer.movedAt = t;
            const lr = pointer.lastRipple;
            // A trail of small puddles behind the cursor.
            if (Math.hypot(x - lr.x, y - lr.y) > 34 && t - lr.t > 0.08) {
                ripple(x, y, 16 + Math.min(14, pointer.speed / 60), 1.5);
                Object.assign(lr, { x, y, t });
            }
        },
        pointerLeave() {
            pointer.on = false;
        },
        tap(x, y) {
            ripple(x, y, 70, 2.6);
            ripple(x, y, 42, 2);
            ripple(x, y, 20, 1.4);
            // A pellet landing on a lily pad slides off to the water's edge.
            for (const o of padObs) {
                const d = Math.hypot(x - o.x, y - o.y) || 1;
                if (d < o.r + 10) {
                    x = o.x + ((x - o.x) / d) * (o.r + 10);
                    y = o.y + ((y - o.y) / d) * (o.r + 10);
                }
            }
            foods.push({ x, y, until: t + 30 });
            if (foods.length > 24) foods.shift();
        },
    };
}
