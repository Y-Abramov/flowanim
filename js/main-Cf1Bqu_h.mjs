var ht = /* @__PURE__ */ ((e) => (e[e.World = 0] = "World", e[e.View = 1] = "View", e[e.Projection = 2] = "Projection", e))(ht || {}), vt = /* @__PURE__ */ ((e) => (e.object = "object", e.drawing = "drawing", e.table = "table", e.record = "record", e.textStyle = "textstyle", e.textStyleTable = "textstyles", e.linetype = "linetype", e.linetypeTable = "linetypes", e.layer = "layer", e.layerTable = "layers", e.block = "block", e.blockTable = "blocks", e.layout = "layout", e.layoutTable = "layouts", e.type = "type", e.typeTable = "types", e.material = "material", e.materialTable = "materials", e.geometry = "geometry", e.geometryTable = "geometries", e.group = "group", e.groupTable = "groups", e.attachment = "attachment", e.attachmentTable = "attachments", e.entities = "entities", e.entity = "entity", e.line = "l", e.solid = "s", e.insert = "i", e.polyline = "p", e.circle = "c", e.arc = "a", e.polyline3d = "p3", e.proxy = "x", e.text = "t", e.mtext = "mt", e.wipeout = "w", e.model3d = "g", e.alignment = "al", e))(vt || {}), It = /* @__PURE__ */ ((e) => (e[e.Separator = 0] = "Separator", e[e.Default = 1] = "Default", e))(It || {}), C = /* @__PURE__ */ ((e) => (e[e.Error = 0] = "Error", e[e.Warning = 1] = "Warning", e[e.Information = 2] = "Information", e[e.Hint = 3] = "Hint", e[e.Success = 4] = "Success", e))(C || {});
const qt = Object.freeze({
  style: "water",
  showArrows: !1,
  drops: 300,
  speed: 1,
  opacity: 0.85,
  showRain: !0,
  tail: 14,
  arrowSize: 1
}), Ht = 1500, ft = 4500, Zt = 14e3;
function ot(e) {
  const t = e && typeof e == "object" && !Array.isArray(e) ? e : {};
  return { ...qt, style: t.style === "drops" ? "drops" : "water", showArrows: typeof t.showArrows == "boolean" ? t.showArrows : !1 };
}
function Gt(e) {
  const t = Math.min(e.drops, Math.floor(ft / 5)), i = Math.min(e.tail, Math.max(1, Math.floor(ft / t) - 4));
  return { drops: t, tail: i };
}
const wt = 3e6, Bt = "Слишком много граней поверхности. Выберите меньший объект или упростите сетку (лимит: {0}).";
class tt extends Error {
  constructor(t) {
    super(Bt), this.limit = t;
  }
  limit;
}
function xt(e, t = wt) {
  if (!Number.isSafeInteger(e) || e < 0 || e > t) throw new tt(t);
}
const rt = 2048;
function* Xt(e, t, i = {}) {
  xt(Math.ceil(t.length / 3), i.maxFaces);
  const n = {
    points: [],
    triangles: [],
    incident: [],
    upAxis: i.upAxis ?? "Z",
    flatSlope: i.flatSlope ?? 1e-5,
    bounds: { minU: 1 / 0, minV: 1 / 0, maxU: -1 / 0, maxV: -1 / 0 }
  };
  if (!Number.isFinite(n.flatSlope) || n.flatSlope < 0) throw new Error("Invalid flatSlope");
  const s = [], o = /* @__PURE__ */ new Map();
  for (let a = 0; a + 2 < e.length; a += 3) {
    const h = e[a], f = e[a + 1], u = e[a + 2], c = `${h},${f},${u}`;
    let d = o.get(c);
    d === void 0 && (d = n.points.length, o.set(c, d), n.points.push({ u: h, v: n.upAxis === "Z" ? f : u, h: n.upAxis === "Z" ? u : f }), n.incident.push([])), s.push(d), a % (rt * 3) === 0 && (yield);
  }
  const r = /* @__PURE__ */ new Set(), l = /* @__PURE__ */ new Map();
  for (let a = 0; a + 2 < t.length; a += 3) {
    const f = [t[a], t[a + 1], t[a + 2]].map((w) => Number.isInteger(w) && w >= 0 ? s[w] ?? -1 : -1), u = [...f].sort((w, x) => w - x), c = u.join(":");
    if (a % (rt * 3) === 0 && (yield), r.has(c)) continue;
    r.add(c);
    const d = {
      ids: f,
      neighbors: [-1, -1, -1],
      valid: !1,
      standing: !0,
      slope: 0,
      down: [0, 0],
      bary: [0, 0, 0, 0]
    }, p = n.triangles.length;
    n.triangles.push(d);
    const [m, g, v] = f.map((w) => n.points[w]);
    if (m && g && v && [m, g, v].every((w) => Number.isFinite(w.u) && Number.isFinite(w.v) && Number.isFinite(w.h))) {
      const w = g.u - m.u, x = g.v - m.v, b = v.u - m.u, y = v.v - m.v, M = w * y - x * b, S = Math.max(Math.abs(w), Math.abs(x), Math.abs(b), Math.abs(y));
      if (S > 0 && Math.abs(M) > S * S * 1e-12) {
        d.bary = [(x - y) / M, (b - w) / M, y / M, -b / M];
        const U = ((g.h - m.h) * y - (v.h - m.h) * x) / M, P = (w * (v.h - m.h) - b * (g.h - m.h)) / M, N = Math.hypot(U, P);
        if (Number.isFinite(N)) {
          d.valid = !0, d.slope = N, d.standing = N < n.flatSlope || N === 0, d.down = N === 0 ? [0, 0] : [-U / N, -P / N];
          for (const I of [m, g, v])
            n.bounds.minU = Math.min(n.bounds.minU, I.u), n.bounds.minV = Math.min(n.bounds.minV, I.v), n.bounds.maxU = Math.max(n.bounds.maxU, I.u), n.bounds.maxV = Math.max(n.bounds.maxV, I.v);
          for (const I of f) n.incident[I].push(p);
          for (let I = 0; I < 3; I++) {
            const E = f[(I + 1) % 3], V = f[(I + 2) % 3], W = E < V ? `${E}:${V}` : `${V}:${E}`, F = l.get(W);
            if (!F) l.set(W, { triangle: p, slot: I, count: 1 });
            else if (F.count++, F.count === 2)
              d.neighbors[I] = F.triangle, n.triangles[F.triangle].neighbors[F.slot] = p;
            else if (F.count === 3) {
              const k = n.triangles[F.triangle], A = n.triangles[k.neighbors[F.slot]];
              if (A) {
                const L = A.neighbors.indexOf(F.triangle);
                L >= 0 && (A.neighbors[L] = -1);
              }
              k.neighbors[F.slot] = -1;
            }
          }
        }
      }
    }
    p % rt === 0 && (yield);
  }
  return n;
}
function z(e, t, i, n) {
  const s = e.triangles[t], o = e.points[s.ids[2]], r = i - o.u, l = n - o.v, a = s.bary[0] * r + s.bary[1] * l, h = s.bary[2] * r + s.bary[3] * l;
  return [a, h, 1 - a - h];
}
function Yt(e, t, i) {
  const n = e.bary[0] * t + e.bary[1] * i, s = e.bary[2] * t + e.bary[3] * i;
  return [n, s, -n - s];
}
function Y(e, t, i, n) {
  const s = e.triangles[t];
  return z(e, t, i, n).reduce((r, l, a) => r + l * e.points[s.ids[a]].h, 0);
}
const _ = 1e-8;
function Kt(e, t = 1, i = 10) {
  return ![e, t, i].every(Number.isFinite) || e <= 0 || t <= 0 || i <= 0 ? 0 : Math.min(i, Math.sqrt(e) * t);
}
function yt(e, t, i, n) {
  const o = Number.isFinite(i) && Number.isFinite(n) && e.triangles[t]?.valid && z(e, t, i, n).every((r) => r >= -_);
  return {
    triangle: t,
    u: Number.isFinite(i) ? i : 0,
    v: Number.isFinite(n) ? n : 0,
    h: o ? Y(e, t, i, n) : 0,
    stopped: !o,
    reason: o ? void 0 : "invalid",
    steps: 0
  };
}
function ut(e, t) {
  return e.upAxis === "Z" ? [t.u, t.v, t.h] : [t.u, t.h, t.v];
}
function Jt(e, t) {
  const i = e.triangles[t.triangle], n = z(e, t.triangle, t.u, t.v), s = n.map((l, a) => l <= _ ? a : -1).filter((l) => l >= 0), o = /* @__PURE__ */ new Set([t.triangle]);
  if (s.length >= 2) {
    const l = i.ids[n.indexOf(Math.max(...n))];
    for (const a of e.incident[l]) o.add(a);
  } else for (const l of s) i.neighbors[l] >= 0 && o.add(i.neighbors[l]);
  let r;
  for (const l of o) {
    const a = e.triangles[l];
    if (!a.valid || a.standing || e.exposed?.(l) === !1) continue;
    const h = z(e, l, t.u, t.v), f = Yt(a, ...a.down);
    if (h.some((c, d) => c < -_ || c <= _ && f[d] < -1e-12)) continue;
    let u = 1 / 0;
    for (let c = 0; c < 3; c++) f[c] < -1e-12 && (u = Math.min(u, Math.max(0, -h[c] / f[c])));
    u > 0 && (!r || a.slope > r.slope) && (r = { triangle: l, du: a.down[0], dv: a.down[1], slope: a.slope, distance: u });
  }
  if (r) return r;
  for (const l of o) {
    const a = e.triangles[l];
    if (e.exposed?.(l) === !1) continue;
    const h = z(e, l, t.u, t.v);
    for (let f = 0; f < 3; f++)
      if (!(h[f] > _ || a.neighbors[f] < 0))
        for (const u of [(f + 1) % 3, (f + 2) % 3]) {
          const c = e.points[a.ids[u]], d = c.u - t.u, p = c.v - t.v, m = Math.hypot(d, p), g = (t.h - c.h) / m;
          m > 0 && g > e.flatSlope && (!r || g > r.slope) && (r = { triangle: l, du: d / m, dv: p / m, slope: g, distance: m });
        }
  }
  return r;
}
function Wt(e, t, i, n = {}) {
  if (t.stopped || !Number.isFinite(i) || i <= 0) return;
  const s = n.speedScale ?? 1, o = n.maxSpeed ?? 10;
  if (!Number.isFinite(s) || !Number.isFinite(o) || s <= 0 || o <= 0) return;
  const r = n.maxSteps ?? 4096, l = n.maxCrossings ?? 64;
  let a = i;
  for (let h = 0; a > 1e-12; h++) {
    if (t.steps >= r || h >= l) {
      t.stopped = !0, t.reason = "limit";
      return;
    }
    if (e.triangles[t.triangle].standing) {
      t.stopped = !0, t.reason = "flat";
      return;
    }
    const f = Jt(e, t);
    if (!f) {
      const d = e.triangles[t.triangle], p = z(e, t.triangle, t.u, t.v);
      t.stopped = !0, t.reason = p.some((m, g) => m <= _ && d.neighbors[g] < 0) ? "boundary" : "minimum";
      return;
    }
    const u = Kt(f.slope, s, o), c = Math.min(a, f.distance / u);
    t.u += f.du * u * c, t.v += f.dv * u * c, t.triangle = f.triangle, t.h = Y(e, t.triangle, t.u, t.v), n.onMove?.({ u: t.u, v: t.v, h: t.h }), a -= c, c >= f.distance / u && t.steps++;
  }
}
function* Qt(e, t = 600) {
  const { minU: i, minV: n, maxU: s, maxV: o } = e.bounds, r = s - i, l = o - n;
  if (!(r > 0 && l > 0) || !Number.isFinite(t) || t < 1) return [];
  t = Math.min(1e4, Math.floor(t));
  const a = Math.max(1, Math.min(t, Math.round(Math.sqrt(t * r / l)))), h = Math.max(1, Math.floor(t / a)), f = r / a, u = l / h, c = /* @__PURE__ */ new Map();
  let d = 0;
  for (let p = 0; p < e.triangles.length; p++) {
    const m = e.triangles[p];
    if (!m.valid) continue;
    const g = m.ids.map((y) => e.points[y]), v = Math.max(0, Math.ceil((Math.min(...g.map((y) => y.u)) - i) / f - 0.5)), w = Math.min(a - 1, Math.floor((Math.max(...g.map((y) => y.u)) - i) / f - 0.5)), x = Math.max(0, Math.ceil((Math.min(...g.map((y) => y.v)) - n) / u - 0.5)), b = Math.min(h - 1, Math.floor((Math.max(...g.map((y) => y.v)) - n) / u - 0.5));
    for (let y = x; y <= b; y++) for (let M = v; M <= w; M++) {
      const S = i + (M + 0.5) * f, U = n + (y + 0.5) * u;
      if (z(e, p, S, U).every((P) => P >= -_)) {
        const P = yt(e, p, S, U), N = y * a + M;
        (!c.has(N) || c.get(N).h < P.h) && c.set(N, P);
      }
      ++d % 2048 === 0 && (yield);
    }
    p % 2048 === 0 && (yield);
  }
  return [...c.entries()].sort(([p], [m]) => p - m).map(([, p]) => p);
}
const at = /* @__PURE__ */ new WeakMap(), X = 2048;
function* Dt(e, t = 240) {
  const i = at.get(e)?.get(t);
  if (i) return i;
  const n = /* @__PURE__ */ new Set();
  let s = [], o = 0, r = 0;
  for (const E of e.triangles) {
    if (E.valid) {
      const [V, W, F] = E.ids.map((k) => e.points[k]);
      r += Math.abs((W.u - V.u) * (F.v - V.v) - (W.v - V.v) * (F.u - V.u)) / 2;
      for (let k = 0; k < 3; k++) {
        n.add(E.ids[k]);
        const A = e.points[E.ids[k]], L = e.points[E.ids[(k + 1) % 3]];
        s.push(Math.hypot(A.u - L.u, A.v - L.v, A.h - L.h));
      }
    }
    ++o % X === 0 && (yield);
  }
  let l = 0, a = 0;
  for (const E of n) {
    const V = e.points[E];
    l += V.u, a += V.v, ++o % X === 0 && (yield);
  }
  l /= n.size || 1, a /= n.size || 1;
  let h = 0, f = 0, u = 0;
  for (const E of n) {
    const V = e.points[E];
    h += (V.u - l) ** 2, f += (V.u - l) * (V.v - a), u += (V.v - a) ** 2, ++o % X === 0 && (yield);
  }
  const c = 0.5 * Math.atan2(2 * f, h - u), d = Math.cos(c), p = Math.sin(c);
  let m = 1 / 0, g = -1 / 0, v = 1 / 0, w = -1 / 0;
  for (const E of n) {
    const V = e.points[E], W = (V.u - l) * d + (V.v - a) * p, F = -(V.u - l) * p + (V.v - a) * d;
    m = Math.min(m, W), g = Math.max(g, W), v = Math.min(v, F), w = Math.max(w, F), ++o % X === 0 && (yield);
  }
  let x = new Array(s.length);
  for (let E = 1; E < s.length; E *= 2) {
    for (let V = 0; V < s.length; V += E * 2) {
      const W = Math.min(V + E, s.length), F = Math.min(V + E * 2, s.length);
      let k = V, A = W;
      for (let L = V; L < F; L++)
        x[L] = k < W && (A >= F || s[k] <= s[A]) ? s[k++] : s[A++], ++o % X === 0 && (yield);
    }
    [s, x] = [x, s];
  }
  const b = n.size ? g - m : 0, y = n.size ? w - v : 0, M = s.length >> 1, S = s.length ? (s[M] + s[s.length - 1 >> 1]) / 2 : 0, U = Math.max(b, y), P = Math.min(b, y), N = { area: r, length: U, width: P, medianEdge: S, characteristic: Math.max(1e-6, Math.min(Math.sqrt(r / t), 4 * S, P * 0.25)) };
  let I = at.get(e);
  return I || at.set(e, I = /* @__PURE__ */ new Map()), I.set(t, N), N;
}
const te = 1e-3, ee = 8e6;
class G {
  constructor(t, i = [0, 0, 0], n = {}, s = !1) {
    if (this.mesh = t, this.origin = i, !s) {
      const o = this.initialize(n);
      for (; !o.next().done; )
        ;
    }
  }
  mesh;
  origin;
  static indexed = /* @__PURE__ */ new WeakMap();
  static forMesh(t) {
    return this.indexed.get(t) ?? new G(t);
  }
  exposure = /* @__PURE__ */ new Map();
  isExposed(t) {
    const i = this.exposure.get(t);
    if (i !== void 0) return i;
    const n = this.mesh.triangles[t];
    if (!n.valid) return !1;
    const s = n.ids.map((h) => this.mesh.points[h]), o = s.reduce((h, f) => h + f.u, 0) / 3, r = s.reduce((h, f) => h + f.v, 0) / 3, l = this.at(o, r), a = !!l && Math.abs(l.h - Y(this.mesh, t, o, r)) < 1e-8;
    return this.exposure.set(t, a), a;
  }
  extent = 1e-6;
  horizontal = !1;
  metrics;
  characteristicLength = 1e-6;
  indexEntries = 0;
  occupancy = new Float64Array(4225);
  bins = /* @__PURE__ */ new Map();
  flatTargets = /* @__PURE__ */ new Map();
  n = 1;
  dx = 1;
  dy = 1;
  static *createSteps(t, i = [0, 0, 0], n = {}) {
    const s = new G(t, i, n, !0);
    return yield* s.initialize(n), s;
  }
  *initialize(t) {
    const i = this.mesh, n = i.bounds, s = t.maxIndexEntries ?? ee;
    if (!Number.isSafeInteger(s) || s < 1) throw Error("Invalid index budget");
    this.metrics = yield* Dt(i), this.characteristicLength = this.metrics.characteristic, this.extent = Math.max(n.maxU - n.minU, n.maxV - n.minV, 1e-6), Number.isFinite(this.extent) || (this.extent = 1e-6), this.n = Math.max(1, Math.min(64, Math.ceil(Math.sqrt(i.triangles.length / 4))));
    let o = 0;
    for (; ; ) {
      this.dx = Math.max((n.maxU - n.minU) / this.n, 1e-12), this.dy = Math.max((n.maxV - n.minV) / this.n, 1e-12);
      let f = 0;
      for (const u of i.triangles) {
        if (u.valid) {
          const c = u.ids.map((v) => i.points[v]), d = this.x(Math.min(...c.map((v) => v.u))), p = this.x(Math.max(...c.map((v) => v.u))), m = this.y(Math.min(...c.map((v) => v.v))), g = this.y(Math.max(...c.map((v) => v.v)));
          f += (p - d + 1) * (g - m + 1);
        }
        if (++o % 2048 === 0 && (yield), f > s) break;
      }
      if (f <= s) break;
      if (this.n === 1) throw Error("Spatial index budget is smaller than the number of faces");
      this.n = Math.max(1, Math.floor(this.n / 2)), yield;
    }
    let r = 1 / 0, l = -1 / 0;
    for (let f = 0; f < i.triangles.length; f++) {
      const u = i.triangles[f];
      if (u.valid) {
        const c = u.ids.map((v) => i.points[v]);
        for (const v of c)
          r = Math.min(r, v.h), l = Math.max(l, v.h);
        const d = this.x(Math.min(...c.map((v) => v.u))), p = this.x(Math.max(...c.map((v) => v.u))), m = this.y(Math.min(...c.map((v) => v.v))), g = this.y(Math.max(...c.map((v) => v.v)));
        for (let v = m; v <= g; v++) for (let w = d; w <= p; w++) {
          const x = v * this.n + w, b = this.bins.get(x);
          b ? b.push(f) : this.bins.set(x, [f]), this.indexEntries++, ++o % 2048 === 0 && (yield);
        }
      }
      ++o % 2048 === 0 && (yield);
    }
    this.horizontal = l - r < te;
    const a = (n.maxU - n.minU) / 64, h = (n.maxV - n.minV) / 64;
    for (let f = 0; f < 64; f++) for (let u = 0; u < 64; u++) {
      const c = this.at(n.minU + (u + 0.5) * a, n.minV + (f + 0.5) * h) ? 1 : 0, d = (f + 1) * 65 + u + 1;
      this.occupancy[d] = c + this.occupancy[d - 1] + this.occupancy[d - 65] - this.occupancy[d - 66], ++o % 256 === 0 && (yield);
    }
    G.indexed.set(i, this), i.exposed = (f) => this.isExposed(f);
  }
  /** Approximate occupied plan area, integrating a fixed 64×64 mask. */
  visibleArea(t) {
    const i = this.mesh.bounds, n = i.maxU - i.minU, s = i.maxV - i.minV;
    if (!(n > 0 && s > 0)) return 0;
    const o = (r, l) => {
      const a = Math.max(0, Math.min(64, (r - i.minU) / n * 64)), h = Math.max(0, Math.min(64, (l - i.minV) / s * 64)), f = Math.min(63, Math.floor(a)), u = Math.min(63, Math.floor(h)), c = a - f, d = h - u, p = this.occupancy[u * 65 + f], m = this.occupancy[(u + 1) * 65 + f];
      return (p * (1 - c) + this.occupancy[u * 65 + f + 1] * c) * (1 - d) + (m * (1 - c) + this.occupancy[(u + 1) * 65 + f + 1] * c) * d;
    };
    return t.maxU <= t.minU || t.maxV <= t.minV ? 0 : Math.max(0, o(t.maxU, t.maxV) - o(t.minU, t.maxV) - o(t.maxU, t.minV) + o(t.minU, t.minV)) * n * s / 4096;
  }
  toWorld(t) {
    const i = ut(this.mesh, t);
    return [i[0] + this.origin[0], i[1] + this.origin[1], i[2] + this.origin[2]];
  }
  x(t) {
    return Math.max(0, Math.min(this.n - 1, Math.floor((t - this.mesh.bounds.minU) / this.dx)));
  }
  y(t) {
    return Math.max(0, Math.min(this.n - 1, Math.floor((t - this.mesh.bounds.minV) / this.dy)));
  }
  at(t, i) {
    if (!Number.isFinite(t) || !Number.isFinite(i)) return;
    let n;
    for (const s of this.bins.get(this.y(i) * this.n + this.x(t)) ?? []) {
      if (!z(this.mesh, s, t, i).every((r) => r >= -1e-9)) continue;
      const o = yt(this.mesh, s, t, i);
      (!n || o.h > n.h) && (n = o);
    }
    return n;
  }
  /** One marker per connected standing patch, located inside its first triangle. */
  standingTarget(t) {
    const i = this.flatTargets.get(t);
    if (i) return i;
    const n = this.mesh.triangles[t].ids.map((r) => this.mesh.points[r]), s = {
      u: n.reduce((r, l) => r + l.u, 0) / 3,
      v: n.reduce((r, l) => r + l.v, 0) / 3,
      h: n.reduce((r, l) => r + l.h, 0) / 3
    }, o = [t];
    this.flatTargets.set(t, s);
    for (let r = 0; r < o.length; r++)
      for (const l of this.mesh.triangles[o[r]].neighbors)
        l >= 0 && this.mesh.triangles[l].standing && !this.flatTargets.has(l) && (this.flatTargets.set(l, s), o.push(l));
    return s;
  }
  /** Clip against faces and split exactly at edges so chords never cut through a ridge. */
  lines(t, i, n = 0, s = n) {
    if (![t.u, t.v, i.u, i.v, n, s].every(Number.isFinite)) return [];
    const o = /* @__PURE__ */ new Set();
    for (let f = this.y(Math.min(t.v, i.v)); f <= this.y(Math.max(t.v, i.v)); f++)
      for (let u = this.x(Math.min(t.u, i.u)); u <= this.x(Math.max(t.u, i.u)); u++)
        for (const c of this.bins.get(f * this.n + u) ?? []) o.add(c);
    const r = [], l = [0, 1];
    for (const f of o) {
      const u = z(this.mesh, f, t.u, t.v), c = z(this.mesh, f, i.u, i.v);
      let d = 0, p = 1;
      for (let m = 0; m < 3; m++) {
        const g = c[m] - u[m];
        Math.abs(g) < 1e-14 ? u[m] < -1e-10 && (p = -1) : g > 0 ? d = Math.max(d, -u[m] / g) : p = Math.min(p, -u[m] / g);
      }
      p - d > 1e-10 && (r.push({ lo: d, hi: p, ti: f }), l.push(d, p));
    }
    l.sort((f, u) => f - u);
    const a = l.filter((f, u) => u === 0 || f - l[u - 1] > 1e-9), h = [];
    for (let f = 1; f < a.length; f++) {
      const u = a[f - 1], c = a[f], d = (u + c) / 2;
      let p, m = -1 / 0;
      for (const v of r) if (v.lo <= d && v.hi >= d) {
        const w = Y(this.mesh, v.ti, t.u + (i.u - t.u) * d, t.v + (i.v - t.v) * d);
        w > m && (p = v.ti, m = w);
      }
      if (p === void 0) continue;
      const g = (v) => {
        const w = t.u + (i.u - t.u) * v, x = t.v + (i.v - t.v) * v;
        return ut(this.mesh, { u: w, v: x, h: Y(this.mesh, p, w, x) + n + (s - n) * v });
      };
      h.push([g(u), g(c)]);
    }
    return h;
  }
}
const K = (e, t) => t.u >= e.minU - 1e-9 && t.u <= e.maxU + 1e-9 && t.v >= e.minV - 1e-9 && t.v <= e.maxV + 1e-9;
function ie(e, t) {
  const i = [];
  return e.triangles.forEach((n, s) => {
    if (!n.valid) return;
    let o = n.ids.map((r) => e.points[r]);
    if (t) for (const [r, l, a] of [
      ["u", t.minU, 1],
      ["u", t.maxU, -1],
      ["v", t.minV, 1],
      ["v", t.maxV, -1]
    ]) {
      const h = [];
      for (let f = 0; f < o.length; f++) {
        const u = o[f], c = o[(f + 1) % o.length], d = (u[r] - l) * a, p = (c[r] - l) * a;
        if (d >= 0 && h.push(u), d >= 0 != p >= 0) {
          const m = d / (d - p);
          h.push({ u: u.u + (c.u - u.u) * m, v: u.v + (c.v - u.v) * m, h: u.h + (c.h - u.h) * m });
        }
      }
      o = h;
    }
    for (let r = 1; r + 1 < o.length; r++) {
      const l = [o[0], o[r], o[r + 1]], [a, h, f] = l, u = Math.abs((h.u - a.u) * (f.v - a.v) - (h.v - a.v) * (f.u - a.u)) / 2;
      u > 1e-14 && i.push({ triangle: s, points: l, area: u });
    }
  }), i;
}
class Mt {
  constructor(t, i = Math.random, n) {
    this.random = i, this.surface = G.forMesh(t);
    let s = 0;
    for (const o of ie(t, n))
      this.surface.isExposed(o.triangle) && (s += o.area, this.faces.push({ ...o, cumulative: s }));
    this.total = s;
  }
  random;
  faces = [];
  total;
  surface;
  sample() {
    if (!this.faces.length || !(this.total > 0)) return;
    const t = this.random() * this.total;
    let i = 0, n = this.faces.length - 1;
    for (; i < n; ) {
      const h = i + n >>> 1;
      this.faces[h].cumulative > t ? n = h : i = h + 1;
    }
    const { points: [s, o, r] } = this.faces[i], l = Math.sqrt(this.random()), a = this.random();
    return this.surface.at(
      s.u * (1 - l) + o.u * l * (1 - a) + r.u * l * a,
      s.v * (1 - l) + o.v * l * (1 - a) + r.v * l * a
    );
  }
}
const ne = 240;
function* se(e, t) {
  const i = e.mesh, n = i.bounds, s = e.metrics.area, o = Math.min(1, s / ((n.maxU - n.minU) * (n.maxV - n.minV)));
  return o > 0 ? yield* Qt(i, Math.ceil(t / o)) : [];
}
function oe(e, t) {
  const i = se(e, t);
  let n = i.next();
  for (; !n.done; ) n = i.next();
  return n.value;
}
function St(e) {
  const t = Number.isFinite(e) ? Math.max(0, Math.min(1, e)) : 0, i = (n, s) => Math.round(n + (s - n) * t);
  return i(48, 16) << 16 | i(137, 100) << 8 | i(217, 175);
}
function re(e, t = ne, i = 1, n, s) {
  if (e.horizontal) return [];
  const o = e.mesh, r = o.bounds, l = r.maxU - r.minU, a = r.maxV - r.minV;
  let h;
  if (n) {
    let c = 17;
    const d = new Mt(o, () => (c = 1664525 * c + 1013904223 >>> 0) / 4294967296, s), p = Math.min(400, Math.ceil(d.total / (n * 3) ** 2));
    h = Array.from({ length: p }, () => d.sample()).filter((m) => !!m);
  } else h = oe(e, t);
  const f = Math.min(l, a, Math.sqrt(l * a / Math.max(t, h.length))), u = [];
  for (const c of h) {
    const d = o.triangles[c.triangle];
    if (d.standing) continue;
    const [p, m] = d.down, g = (n ?? Math.min(f * 0.65, e.characteristicLength)) * i, v = { u: c.u - p * g / 2, v: c.v - m * g / 2 }, w = { u: c.u + p * g / 2, v: c.v + m * g / 2 }, x = { u: w.u - p * g * 0.32 - m * g * 0.22, v: w.v - m * g * 0.32 + p * g * 0.22 }, b = { u: w.u - p * g * 0.32 + m * g * 0.22, v: w.v - m * g * 0.32 - p * g * 0.22 };
    if (s) {
      const y = (S) => S.u >= s.minU && S.u <= s.maxU && S.v >= s.minV && S.v <= s.maxV, M = (S, U) => ({ u: w.u - p * g * (1 - S) - m * g * U, v: w.v - m * g * (1 - S) + p * g * U });
      if (![M(0, 0.07), M(0, -0.07), M(0.62, 0.22), M(0.62, -0.22), w].every(y)) continue;
    }
    u.push({
      lines: [...e.lines(v, w), ...e.lines(w, x), ...e.lines(w, b)],
      slope: d.slope,
      alpha: 0.12 + 0.38 * Math.min(1, Math.sqrt(d.slope)),
      tail: v,
      tip: w,
      size: g
    });
  }
  return u;
}
function ae(e, t, i) {
  if (e.horizontal || !i.stopped || i.reason !== "minimum" && i.reason !== "flat") return;
  const n = t.find((s) => s.triangles.includes(i.triangle));
  n && n.arrivals++;
}
const ce = 40, le = 25, he = 1.5;
class jt {
  constructor(t, i, n = {}) {
    this.surface = t, this.sinks = i, this.random = n.random ?? Math.random, this.sampler = new Mt(t.mesh, this.random), this.historyLength = n.historyLength ?? ce;
    const s = n.count ?? 300;
    for (let o = 0; o < s; o++) {
      const r = this.sampler.sample();
      if (!r) break;
      this.tracks.push({
        particle: r,
        history: [],
        age: 0,
        delay: o / s * 2,
        fall: this.fallHeight(),
        stalled: 0,
        counted: !1,
        generation: 0
      });
    }
  }
  surface;
  sinks;
  tracks = [];
  sampler;
  bounds;
  metersPerPixel;
  falling = !0;
  get visibleArea() {
    if (!this.bounds) return this.sampler.total;
    const t = this.surface.visibleArea(this.surface.mesh.bounds);
    return t > 0 ? this.sampler.total * Math.min(1, this.surface.visibleArea(this.bounds) / t) : 0;
  }
  random;
  historyLength;
  setView(t, i, n, s = !0) {
    const o = !this.bounds;
    if (this.metersPerPixel = i, this.falling = n, this.bounds = { ...t }, !!s)
      for (const r of this.tracks)
        n || (r.fall = 0), (o || !K(t, r.particle)) && this.respawn(r);
  }
  fallHeight() {
    return this.falling ? this.metersPerPixel ? this.random() < 0.35 ? this.metersPerPixel * 28 : 0 : this.surface.characteristicLength * (0.2 + 0.12 * this.random()) : 0;
  }
  respawn(t) {
    let i;
    for (let n = 0; n < 24; n++) {
      const s = this.sampler.sample();
      if (s && (!this.bounds || K(this.bounds, s))) {
        i = s;
        break;
      }
    }
    i && (t.particle = i, t.history = [], t.age = 0, t.delay = 0, t.fall = this.fallHeight(), t.stalled = 0, t.counted = !1, t.generation++);
  }
  advance(t) {
    if (!Number.isFinite(t) || t <= 0) return;
    const i = this.surface.mesh, n = this.metersPerPixel ? this.metersPerPixel * 120 : this.surface.extent;
    for (const s of this.tracks) {
      if (this.bounds && !K(this.bounds, s.particle)) {
        this.respawn(s);
        continue;
      }
      let o = t;
      if (s.delay > 0) {
        const a = Math.min(s.delay, o);
        s.delay -= a, o -= a;
      }
      if (o <= 0) continue;
      if (s.age += o, s.age > le) {
        this.respawn(s);
        continue;
      }
      if (s.fall > 0) {
        const a = this.metersPerPixel ? this.metersPerPixel * 28 / 0.32 : this.surface.characteristicLength, h = Math.min(o, s.fall / a);
        if (s.fall = Math.max(0, s.fall - h * a), o -= h, s.fall > 1e-12) continue;
        s.fall = 0;
      }
      s.history.length || s.history.push({ ...s.particle }), this.surface.horizontal && (s.particle.stopped = !0, s.particle.reason = "flat");
      let r = Math.min(o, 0.25);
      for (; r > 1e-10 && !s.particle.stopped; ) {
        const a = Math.min(r, 0.016666666666666666), { u: h, v: f } = s.particle;
        Wt(i, s.particle, a, { speedScale: n * 0.34, maxSpeed: n / 6, maxSteps: 8192 }), (s.particle.u !== h || s.particle.v !== f) && (s.history.push({ u: s.particle.u, v: s.particle.v, h: s.particle.h }), s.history.length > this.historyLength && s.history.shift()), r -= a;
      }
      const l = s.particle;
      if (!l.stopped) {
        s.stalled = 0;
        continue;
      }
      s.counted || (ae(this.surface, this.sinks, l), s.counted = !0), s.stalled += o, (l.reason === "boundary" || l.reason === "invalid" || l.reason === "limit" || s.stalled > he) && this.respawn(s);
    }
  }
}
function et(e) {
  return e.layer?.name || e.$path;
}
function* zt(e, t) {
  const i = [1 / 0, 1 / 0, 1 / 0], n = [-1 / 0, -1 / 0, -1 / 0];
  for (let o = 0; o < e.length; o += 3) {
    if (Number.isFinite(e[o]) && Number.isFinite(e[o + 1]) && Number.isFinite(e[o + 2]))
      for (let r = 0; r < 3; r++)
        i[r] = Math.min(i[r], e[o + r]), n[r] = Math.max(n[r], e[o + r]);
    o % 6144 === 0 && (yield);
  }
  const s = i.map((o, r) => Number.isFinite(o) ? o + (n[r] - o) / 2 : 0);
  for (let o = 0; o < e.length; o++)
    e[o] -= s[o % 3], o % 6144 === 0 && (yield);
  return { vertices: e, indices: t, origin: s };
}
function it(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === vt.model3d && !!t.meshes && typeof t.meshes == "object" && !!t.matrix && t.matrix.length === 16 && Array.from(t.matrix).every(Number.isFinite);
}
function B(e) {
  return Object.values(e.meshes).flatMap((t) => {
    const i = t?.geometry;
    return i?.vertices instanceof Float32Array && (i.indices instanceof Uint8Array || i.indices instanceof Uint16Array || i.indices instanceof Uint32Array) && i.vertices.length >= 9 && i.indices.length >= 3 ? [i] : [];
  });
}
function Vt(e) {
  return B(e).length > 0;
}
function mt(e) {
  if (it(e)) return e;
  if (e && typeof e == "object" && "owner" in e) {
    const t = e.owner;
    if (it(t) && Object.values(t.meshes).some((i) => i === e)) return t;
  }
}
function Rt(e) {
  const t = [];
  return e.layouts.model?.walk((i) => (it(i) && B(i).length && t.push({ label: et(i), model: i }), !1)), t;
}
const fe = ["owner", "parent", "layer", "model", "entity", "object", "target", "value"];
function ue(e, t = 3) {
  const i = [], n = /* @__PURE__ */ new Set(), s = (o, r) => {
    if (!(!o || typeof o != "object" || n.has(o)) && (n.add(o), i.push(o), !(r <= 0)))
      for (const l of fe) {
        let a;
        try {
          a = o[l];
        } catch {
          continue;
        }
        s(a, r - 1);
      }
  };
  return s(e, t), i;
}
function me(e, t) {
  const i = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set(), s = (o) => {
    const r = mt(o);
    r && B(r).length && i.add(r), o && typeof o == "object" && "type" in o && o.type === vt.layer && n.add(o);
  };
  for (const o of e) s(o);
  if (!i.size && !n.size) for (const o of e) for (const r of ue(o).slice(1)) s(r);
  return n.size && t?.layouts.model?.walk((o) => {
    const r = /* @__PURE__ */ new Set();
    for (let l = o.layer; l && !r.has(l); l = l.layer) {
      if (n.has(l)) {
        it(o) && B(o).length && i.add(o);
        break;
      }
      r.add(l);
    }
    return !1;
  }), [...i];
}
function* de(e, t = {}) {
  let i = 0;
  for (const a of e) for (const h of B(a))
    i += Math.ceil(h.indices.length / 3), xt(i, t.maxFaces ?? wt);
  const n = [];
  for (const a of e) n.push(yield* pe(a, t));
  const s = new Float64Array(n.reduce((a, h) => a + h.vertices.length, 0)), o = new Uint32Array(n.reduce((a, h) => a + h.indices.length, 0));
  let r = 0, l = 0;
  for (const a of n) {
    for (let h = 0; h < a.vertices.length; h++)
      s[r + h] = a.vertices[h] + a.origin[h % 3], h % 6144 === 0 && (yield);
    for (let h = 0; h < a.indices.length; h++)
      o[l + h] = a.indices[h] < a.vertices.length / 3 ? a.indices[h] + r / 3 : 4294967295, h % 6144 === 0 && (yield);
    r += a.vertices.length, l += a.indices.length;
  }
  return yield* zt(s, o);
}
function* pe(e, t = {}) {
  const i = B(e);
  if (!i.length) throw new Error("У модели нет доступной треугольной геометрии");
  let n = 0, s = 0;
  for (const u of i) {
    if (u.vertices.length % 3 || u.indices.length % 3) throw new Error("Повреждена структура треугольной сетки");
    n += u.vertices.length, s += u.indices.length, xt(s / 3, t.maxFaces ?? wt);
  }
  const o = new Float64Array(n), r = new Uint32Array(s);
  let l = 0, a = 0;
  const h = [0, 0, 0], f = [0, 0, 0];
  for (const u of i) {
    for (let c = 0; c < u.vertices.length; c += 3)
      h[0] = u.vertices[c], h[1] = u.vertices[c + 1], h[2] = u.vertices[c + 2], Math3d.mat4.mulv3(f, e.matrix, h), o.set(f, l + c), c % 6144 === 0 && (yield);
    for (let c = 0; c < u.indices.length; c++)
      r[a + c] = u.indices[c] < u.vertices.length / 3 ? u.indices[c] + l / 3 : 4294967295, c % 6144 === 0 && (yield);
    l += u.vertices.length, a += u.indices.length;
  }
  return yield* zt(o, r);
}
async function D(e, t = () => !1) {
  for (; ; ) {
    if (t()) {
      e.return(void 0);
      return;
    }
    const i = e.next();
    if (i.done) return i.value;
    await new Promise((n) => setTimeout(n, 0));
  }
}
function* $t(e, t, i = {}) {
  t("Подготовка геометрии", 0);
  const n = yield* de(e, i);
  t("Построение сетки", 20);
  const s = yield* Xt(n.vertices, n.indices, { upAxis: "Z", ...i });
  return t("Подготовка поверхности", 40), yield* G.createSteps(s, n.origin);
}
function ge(e) {
  const t = [];
  for (const i of e) {
    for (; t.length > 1; ) {
      const n = t[t.length - 2], s = t[t.length - 1], o = Math.hypot(s.u - n.u, s.v - n.v), r = Math.hypot(i.u - s.u, i.v - s.v), l = (s.u - n.u) * (i.v - s.v) - (s.v - n.v) * (i.u - s.u);
      if (!(o > 0 && r > 0) || Math.abs(l) > 1e-9 * o * r || (s.u - n.u) * (i.u - s.u) + (s.v - n.v) * (i.v - s.v) <= 0 || Math.abs(s.h - (n.h + (i.h - n.h) * o / (o + r))) > 1e-8) break;
      t.pop();
    }
    t.push(i);
  }
  return t;
}
function J(e, t, i) {
  const n = i.u - t.u, s = i.v - t.v, o = n * n + s * s, r = o ? Math.max(0, Math.min(1, ((e.u - t.u) * n + (e.v - t.v) * s) / o)) : 0;
  return Math.hypot(e.u - t.u - n * r, e.v - t.v - s * r);
}
function ve(e, t, i, n) {
  const s = (o, r, l) => (r.u - o.u) * (l.v - o.v) - (r.v - o.v) * (l.u - o.u);
  return s(e, t, i) * s(e, t, n) < 0 && s(i, n, e) * s(i, n, t) < 0 ? 0 : Math.min(J(e, i, n), J(t, i, n), J(i, e, t), J(n, e, t));
}
class we {
  constructor(t) {
    this.cell = t;
  }
  cell;
  bins = /* @__PURE__ */ new Map();
  *keys(t, i, n = 0) {
    for (let s = Math.floor((Math.min(t.v, i.v) - n) / this.cell); s <= Math.floor((Math.max(t.v, i.v) + n) / this.cell); s++)
      for (let o = Math.floor((Math.min(t.u, i.u) - n) / this.cell); o <= Math.floor((Math.max(t.u, i.u) + n) / this.cell); o++) yield `${o}:${s}`;
  }
  add(t, i) {
    const n = [t, i];
    for (const s of this.keys(t, i)) {
      const o = this.bins.get(s);
      o ? o.push(n) : this.bins.set(s, [n]);
    }
  }
  near(t, i, n) {
    for (const s of this.keys(t, i, n)) for (const [o, r] of this.bins.get(s) ?? [])
      if (ve(t, i, o, r) < n - 1e-9) return !0;
    return !1;
  }
}
function xe(e, t, i = e.mesh.bounds, n = 400) {
  if (e.horizontal || !Number.isFinite(t) || t <= 0) return [];
  const s = e.mesh, o = {
    ...s,
    points: s.points.map((g) => ({ ...g, h: -g.h })),
    triangles: s.triangles.map((g) => ({ ...g, down: [-g.down[0], -g.down[1]] }))
  }, r = new we(t), l = [];
  let a = 1729;
  const h = () => (a = 1664525 * a + 1013904223 >>> 0) / 4294967296, f = new Mt(s, h, i), u = [], c = Math.min(6e3, Math.max(32, Math.ceil(f.total / (t * t) * 12)));
  for (let g = 0; g < c; g++) {
    const v = f.sample();
    v && u.push(v);
  }
  const d = t * 0.22;
  let p = 0;
  const m = (g, v) => {
    const w = e.at(g.u, g.v);
    if (!w) return [];
    const x = v ? o : s, b = yt(x, w.triangle, g.u, g.v), y = [w];
    for (let M = 0; M < 1024 && !b.stopped; M++) {
      const S = [];
      if (Wt(x, b, d / Math.max(Math.sqrt(x.triangles[b.triangle].slope), 1e-6), {
        maxSpeed: 1,
        maxSteps: 8192,
        onMove: (U) => S.push({ ...U, h: v ? -U.h : U.h })
      }), !S.length) break;
      for (const U of S) {
        const P = y[y.length - 1];
        if (!(Math.hypot(U.u - P.u, U.v - P.v) < 1e-9)) {
          if (!K(i, U) || r.near(P, U, t * 0.5) || (v ? P.h - U.h : U.h - P.h) > 1e-8) return y;
          y.push(U);
        }
      }
    }
    return y;
  };
  for (let g = 0; g < u.length && l.length < n && p < 18e3; g++) {
    const v = u[g], w = e.at(v.u, v.v);
    if (!w || s.triangles[w.triangle].standing || r.near(v, v, t)) continue;
    const x = m(v, !0), b = m(v, !1), y = [...x.slice(1).reverse(), ...b], M = ge(y);
    let S = 0;
    for (let U = 1; U < M.length; U++) S += Math.hypot(M[U].u - M[U - 1].u, M[U].v - M[U - 1].v);
    if (!(M.length < 2 || S < t * 0.1)) {
      l.push({ points: M }), p += y.length;
      for (let U = 1; U < M.length; U++) r.add(M[U - 1], M[U]);
      for (let U = 1; U < y.length && u.length < 1e4; U += 4) {
        const P = y[U - 1], N = y[U], I = Math.hypot(N.u - P.u, N.v - P.v);
        if (!(I < 1e-9))
          for (const E of [-1, 1]) {
            const V = { u: N.u - E * (N.v - P.v) / I * t, v: N.v + E * (N.u - P.u) / I * t };
            K(i, V) && u.push(V);
          }
      }
    }
  }
  return l;
}
function ye(e, t = 35, i = 150, n = 260) {
  const s = Number.isFinite(e) && e > 0 ? e : 0;
  return Math.max(t, Math.min(i, Math.sqrt(s) * n));
}
function Me(e) {
  const t = [];
  let i = 4242;
  const n = () => (i = 1664525 * i + 1013904223 >>> 0) / 4294967296;
  for (const { points: s } of e) {
    if (s.length < 2) continue;
    const o = s[0].h < s[s.length - 1].h ? [...s].reverse() : s, r = [0], l = { minU: 1 / 0, minV: 1 / 0, maxU: -1 / 0, maxV: -1 / 0 };
    for (let f = 0; f < o.length; f++) {
      const u = o[f];
      f > 0 && r.push(r[f - 1] + Math.hypot(u.u - o[f - 1].u, u.v - o[f - 1].v)), l.minU = Math.min(l.minU, u.u), l.maxU = Math.max(l.maxU, u.u), l.minV = Math.min(l.minV, u.v), l.maxV = Math.max(l.maxV, u.v);
    }
    const a = r[r.length - 1];
    if (!(a > 0)) continue;
    const h = (o[0].h - o[o.length - 1].h) / a;
    t.push({ points: o, cumulative: r, length: a, slope: Math.max(0, h), phase: n(), box: l });
  }
  return t;
}
function At(e, t) {
  const { points: i, cumulative: n } = e;
  if (t <= 0) return { ...i[0] };
  if (t >= e.length) return { ...i[i.length - 1] };
  let s = 0, o = n.length - 1;
  for (; o - s > 1; ) {
    const f = s + o >> 1;
    n[f] <= t ? s = f : o = f;
  }
  const r = n[o] - n[s], l = r > 0 ? (t - n[s]) / r : 0, a = i[s], h = i[o];
  return { ...a, u: a.u + (h.u - a.u) * l, v: a.v + (h.v - a.v) * l, h: a.h + (h.h - a.h) * l };
}
function be(e, t, i) {
  const n = Math.max(0, t), s = Math.min(e.length, i);
  if (!(s > n)) return [];
  const o = [At(e, n)];
  for (let r = 0; r < e.cumulative.length; r++)
    e.cumulative[r] > n && e.cumulative[r] < s && o.push({ ...e.points[r] });
  return o.push(At(e, s)), o;
}
function ke(e, t, i, n) {
  if (!(n > 0)) return [];
  const s = ((t * i + e.phase * n) % n + n) % n, o = [];
  for (let r = s; r - n < e.length; r += n) o.push(r);
  return o;
}
const j = {
  lift: 0.2,
  rainLength: 28,
  arrowLength: 28,
  headRadius: 3,
  halo: 0,
  flowSpacing: 15,
  dashLength: 42,
  dashPeriod: 130,
  dashWidth: 2.4
};
function O(e, t = 1) {
  return (Math.round(255 * Math.max(0, Math.min(1, t))) << 24 | (e & 255) << 16 | e & 65280 | e >>> 16) >>> 0;
}
class ct {
  constructor(t, i, n = 1 / 0, s = !1, o = i.characteristicLength / 32, r = [0, 0, 0]) {
    this.dc = t, this.surface = i, this.budget = n, this.thick = s, this.metersPerPixel = o, this.drawOrigin = r, this.lift = Math.max(1e-3, o * j.lift);
  }
  dc;
  surface;
  budget;
  thick;
  metersPerPixel;
  drawOrigin;
  lift;
  calls = 0;
  /** Perspective: size in pixels means a different world size at every depth. Set by the renderer (local point → factor). */
  scaleAt = () => 1;
  draw(t) {
    return t.map((i, n) => i + this.drawOrigin[n]);
  }
  line(t, i) {
    const n = this.draw(t), s = this.draw(i);
    this.dc.line3d(n, s), this.calls++;
  }
  point(t, i = 0) {
    return ut(this.surface.mesh, { ...t, h: t.h + this.lift + i });
  }
  plan(t) {
    return this.surface.mesh.upAxis === "Z" ? { u: t[0], v: t[1], h: t[2] } : { u: t[0], v: t[2], h: t[1] };
  }
  segment(t, i, n, s = 0) {
    if (this.calls >= this.budget || ![...t, ...i, n, s].every(Number.isFinite) || (this.dc.color = n, this.line(t, i), !this.thick || s <= 0)) return;
    const o = this.plan(t), r = this.plan(i), l = this.surface.at(o.u, o.v), a = this.surface.at(r.u, r.v);
    if (!l || !a) return;
    const h = r.u - o.u, f = r.v - o.v, u = Math.hypot(h, f), c = u > 0 ? -f / u : 1, d = u > 0 ? h / u : 0;
    for (const p of [-0.5, 0.5]) {
      const m = c * s * p, g = d * s * p;
      for (const [v, w] of this.surface.lines({ u: o.u + m, v: o.v + g }, { u: r.u + m, v: r.v + g }, o.h - l.h, r.h - a.h)) {
        if (this.calls >= this.budget) return;
        this.line(v, w);
      }
    }
  }
  onSurface(t, i, n, s = 0) {
    if (!(this.calls >= this.budget))
      for (const [o, r] of this.surface.lines(t, i, this.lift)) {
        if (this.calls >= this.budget) break;
        this.segment(o, r, n, s);
      }
  }
  /** Filled triangles draped on the surface. Vertices outside the mesh skip the whole glyph; winding faces up. */
  fill(t, i, n) {
    const s = [];
    for (const r of t) {
      const l = this.surface.at(r.u, r.v);
      if (!l) return;
      s.push(this.point(l));
    }
    const o = this.surface.mesh.upAxis === "Z" ? 2 : 1;
    this.dc.color = n;
    for (const [r, l, a] of i) {
      if (this.calls >= this.budget) return;
      const h = s[r], f = s[l], u = s[a], c = [f[0] - h[0], f[1] - h[1], f[2] - h[2]], d = [u[0] - h[0], u[1] - h[1], u[2] - h[2]], m = [c[1] * d[2] - c[2] * d[1], c[2] * d[0] - c[0] * d[2], c[0] * d[1] - c[1] * d[0]][o] >= 0;
      this.dc.triangle3d(this.draw(h), this.draw(m ? f : u), this.draw(m ? u : f)), this.calls++;
    }
  }
  /** Bold arrow glyph (shaft + head, three triangles) from tail to tip; size is the total length in drawing units. */
  arrow(t, i, n, s) {
    const o = i.u - t.u, r = i.v - t.v, l = Math.hypot(o, r);
    if (!(l > 0) || !(n > 0)) return;
    const a = o / l, h = r / l, f = -h, u = a, c = (p, m) => ({ u: i.u - a * n * (1 - p) + f * n * m, v: i.v - h * n * (1 - p) + u * n * m }), d = [c(0, 0.07), c(0, -0.07), c(0.62, -0.07), c(0.62, 0.07), c(0.62, 0.22), c(0.62, -0.22), c(1, 0)];
    this.fill(d, [[0, 1, 2], [0, 2, 3], [4, 5, 6]], s);
  }
  /** Diamond marker: two triangle calls (plus an outer ring only when PAINT.halo > 0). */
  head(t, i, n, s) {
    const o = this.point(t), r = this.surface.mesh.upAxis === "Z" ? 2 : 1, l = this.scaleAt(o), a = (j.headRadius + j.halo) * l, h = [];
    let f = 0;
    for (const [u, c] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
      const d = o.map((g, v) => g + (n[v] * u + s[v] * c) * a), p = this.plan(d), m = this.surface.at(p.u, p.v);
      m && (f = Math.max(f, m.h + this.lift - d[r]));
    }
    o[r] += f, h.push([j.headRadius * l, i, Math.max(1e-4, this.metersPerPixel * 0.05 * l)]);
    for (const [u, c, d] of h) {
      const p = (g, v) => o.map((w, x) => w + (n[x] * g + s[x] * v) * u + (x === r ? d : 0)), m = [p(0, -1), p(1, 0), p(0, 1), p(-1, 0)];
      this.dc.color = c;
      for (const g of [[0, 1, 2], [0, 2, 3]]) {
        if (this.calls >= this.budget) return;
        this.dc.triangle3d(this.draw(m[g[0]]), this.draw(m[g[1]]), this.draw(m[g[2]])), this.calls++;
      }
    }
  }
}
function Q(e) {
  const t = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  return Math3d.mat4.translate(t, e);
}
const Et = /* @__PURE__ */ new WeakMap(), Ft = /* @__PURE__ */ new WeakMap(), lt = (e) => !!e && e.length === 3 && Array.from(e).every(Number.isFinite), Pt = (e, t) => Math.hypot(e[0] - t[0], e[1] - t[1], e[2] - t[2]);
function Ue(e, t) {
  const i = [
    e.width,
    e.height,
    e.perspective,
    e.project,
    e.unproject,
    ...e.view ?? [],
    ...e.projection ?? []
  ];
  let n = Ft.get(e);
  n || Ft.set(e, n = /* @__PURE__ */ new WeakMap());
  const s = n.get(t);
  if (s && s.values.length === i.length && i.every((r, l) => Object.is(r, s.values[l]))) return s.frame;
  const o = Se(e, t);
  return n.set(t, { values: i, frame: o }), o;
}
function Se(e, t) {
  const i = t.mesh.bounds, n = t.origin, s = t.mesh.upAxis === "Z" ? 2 : 1, o = s === 2 ? 1 : 2, r = t.characteristicLength / 32;
  let l, a;
  const h = (p) => ({
    metersPerPixel: r,
    bounds: { ...i },
    fallback: !0,
    right: [r, 0, 0],
    up: s === 2 ? [0, r, 0] : [0, 0, r],
    convention: "не подтверждено",
    reason: p,
    roundTripError: l,
    pixelRoundTripError: a,
    screenToPixel: (m) => [m[0], m[1]]
  }), f = e.width, u = e.height;
  if (![f, u].every(Number.isFinite) || !(f > 0 && u > 0)) return h("Невалидный размер камеры");
  let c = Et.get(t);
  if (c === void 0) {
    let p = 0, m = 0;
    for (const g of t.mesh.points) Number.isFinite(g.h) && (p += g.h, m++);
    c = p / (m || 1), Et.set(t, c);
  }
  const d = Math.max(1e-4, t.characteristicLength * 1e-4, t.extent * 1e-7);
  try {
    const p = (k) => {
      const A = e.project([0, 0, 0], k);
      if (!lt(A)) throw Error("Нечисловая проекция камеры");
      return A;
    }, m = (k) => {
      const A = e.unproject([0, 0, 0], k);
      if (!lt(A)) throw Error("Нечисловой луч камеры");
      return A;
    };
    l = 0, a = 0;
    for (const [k, A] of [[0.21, 0.27], [0.73, 0.34], [0.39, 0.81]]) {
      const L = t.toWorld({ u: i.minU + (i.maxU - i.minU) * k, v: i.minV + (i.maxV - i.minV) * A, h: c });
      l = Math.max(l, Pt(L, m(p(L))));
      for (const R of [-1, 0, 1]) {
        const q = [k * f, A * u, R], H = p(m(q));
        if (a = Math.max(a, Math.hypot(H[0] - q[0], H[1] - q[1])), Math.abs(H[2] - R) > 1e-5) return h("Круговая проверка глубины не прошла");
      }
    }
    if (l > d) return h("Круговая проверка мир → экран → мир не прошла");
    if (a > 0.5) return h("Круговая проверка экран → мир → экран не прошла (0.5 px)");
    const g = (k, A) => {
      const L = m([k, A, -1]), R = m([k, A, 1]), q = R[s] - L[s];
      if (Math.abs(q) < 1e-12) throw Error("Экранный луч параллелен плоскости высоты");
      const H = (c + n[s] - L[s]) / q, kt = L.map((Ut, _t) => Ut + H * (R[_t] - Ut));
      if (!lt(kt) || e.perspective && H < 0) throw Error("Экранный луч не достигает плоскости высоты");
      return kt;
    }, v = [], w = Math.max(t.extent, 1) * 1e3;
    for (let k = 0; k <= 8; k++) for (let A = 0; A <= 8; A++)
      try {
        const L = g(f * k / 8, u * A / 8);
        Math.hypot(L[0] - n[0], L[o] - n[o]) <= w && v.push(L);
      } catch {
      }
    if (v.length < 3) throw Error("Экранный луч не достигает плоскости высоты");
    const x = {
      minU: Math.min(...v.map((k) => k[0] - n[0])),
      maxU: Math.max(...v.map((k) => k[0] - n[0])),
      minV: Math.min(...v.map((k) => k[o] - n[o])),
      maxV: Math.max(...v.map((k) => k[o] - n[o]))
    };
    if (!(x.maxU > x.minU && x.maxV > x.minV && x.maxU > i.minU && x.minU < i.maxU && x.maxV > i.minV && x.minV < i.maxV))
      return h("Видимая область не пересекает поверхность");
    const b = (Math.max(x.minU, i.minU) + Math.min(x.maxU, i.maxU)) / 2, y = (Math.max(x.minV, i.minV) + Math.min(x.maxV, i.maxV)) / 2, M = t.toWorld(t.at(b, y) ?? { u: b, v: y, h: c }), S = p(M), U = m(S), P = m([S[0] + 1, S[1], S[2]]), N = m([S[0], S[1] - 1, S[2]]), I = (k) => {
      const A = Pt(k, U);
      if (!(A > 1e-12)) throw Error("Вырожденные оси камеры");
      return k.map((L, R) => (L - U[R]) / A);
    }, E = I(P), V = I(N), W = (k) => {
      const A = p(M.map((L, R) => L + k[R]));
      return 1 / Math.hypot(A[0] - S[0], A[1] - S[1]);
    }, F = (W(E) + W(V)) / 2;
    return F >= t.characteristicLength / 4e3 && F <= t.characteristicLength * 4 ? {
      metersPerPixel: F,
      bounds: x,
      fallback: !1,
      centre: M,
      convention: "project → пиксели сверху-слева; unproject → мир (хост 1.4.0)",
      roundTripError: l,
      pixelRoundTripError: a,
      reason: "",
      right: E.map((k) => k * F),
      up: V.map((k) => k * F),
      screenToPixel: (k) => [k[0], k[1]]
    } : h("Метров/пиксель вне правдоподобного диапазона");
  } catch (p) {
    return h(p instanceof Error ? p.message : "Ошибка преобразования камеры");
  }
}
function Ve(e, t, i) {
  const n = Math.max(0, Math.min(1, i)), s = (o) => Math.round((e >> o & 255) + ((t >> o & 255) - (e >> o & 255)) * n);
  return s(16) << 16 | s(8) << 8 | s(0);
}
const Nt = /* @__PURE__ */ new WeakMap();
function Ae(e) {
  let t = Nt.get(e);
  if (!t) {
    const i = Math.max(e.characteristicLength * 0.45, e.extent / 512), n = xe(e, i, e.mesh.bounds, 900);
    t = { lines: n, water: Me(n), spacing: i }, Nt.set(e, t);
  }
  return t;
}
class Ee {
  constructor(t, i, n) {
    this.surface = t, this.sinks = i, this.focus = n, this.geometry = Ae(t);
  }
  surface;
  sinks;
  focus;
  cache;
  staticKey = "";
  coverage = 0;
  metersPerPixel = 0;
  fallback = !1;
  /** Seconds; injectable so tests can move time deterministically. */
  clock = () => performance.now() / 1e3;
  water = [];
  geometry;
  release() {
    const t = this.cache;
    this.cache = void 0, t?.release();
  }
  emptyRain;
  paint(t, i, n, s) {
    n ??= this.emptyRain ??= new jt(this.surface, this.sinks, { count: 0 });
    const o = t.color, r = t.linetype, l = Ue(i, this.surface), a = this.focus ? { ...l, bounds: this.focus } : l, h = a.metersPerPixel;
    this.metersPerPixel = h, this.fallback = a.fallback;
    const f = (a.bounds.maxU - a.bounds.minU) * (a.bounds.maxV - a.bounds.minV);
    this.coverage = a.fallback || !(f > 0) ? 0 : Math.min(1, this.surface.visibleArea(a.bounds) / f);
    const u = s.showRain && this.coverage >= 0.02 && !a.fallback;
    n.setView(a.bounds, h, u);
    const c = [0, 0, 0], d = Q(this.surface.origin), p = Q([0, 0, 0]);
    try {
      t.linetype = void 0;
      const m = 2 ** Math.round(Math.log2(h)), g = [m, s.opacity, s.style, s.showArrows, s.arrowSize].join(":");
      if (this.cache && (g !== this.staticKey || !i.compatible(this.cache)) && this.release(), this.water = this.geometry.water.filter((x) => this.intersects(x.box, a.bounds)).slice(0, this.lineCount(h, j.flowSpacing, 900)), !this.cache) {
        this.staticKey = g;
        const x = { ...a, metersPerPixel: m };
        this.cache = i.cache(p, (b) => this.paintStatic(b, s, x, c));
      }
      const v = Q([0, 0, 0]), w = Math3d.mat4.mul(Q([0, 0, 0]), t.world, d);
      t.rasterizer.matrix(v, ht.World);
      try {
        t.rasterizer.multMatrix(w), this.cache.paint(t, i.frustum);
      } finally {
        t.rasterizer.setMatrix(ht.World, v);
      }
      t.pushMatrix();
      try {
        t.multMatrix(d);
        const x = ft, b = this.depthScale(i, a), y = new ct(t, this.surface, x, !0, h, c);
        if (y.scaleAt = b, s.style === "water" ? this.paintWater(y, a, s, x) : this.paintDrops(y, a, n, s, x, u), u && s.style === "water") {
          y.thick = !1;
          for (const M of n.tracks) {
            if (y.calls >= x) break;
            if (M.delay > 0 || !(M.fall > 0) || M.particle.u < a.bounds.minU || M.particle.u > a.bounds.maxU || M.particle.v < a.bounds.minV || M.particle.v > a.bounds.maxV) continue;
            const S = b(y.point(M.particle));
            y.segment(y.point(M.particle, M.fall), y.point(M.particle, M.fall + h * j.rainLength * S), O(3112912, Math.max(0.45, s.opacity * 0.8)));
          }
        }
      } finally {
        t.popMatrix();
      }
    } finally {
      t.color = o, t.linetype = r;
    }
  }
  /** Perspective keeps pixel sizes constant by scaling world sizes with the view depth relative to the measured centre. */
  depthScale(t, i) {
    const n = i.centre;
    if (!t.perspective || !n || i.fallback) return () => 1;
    const s = this.surface.origin, o = [0, 0, 0], r = [0, 0, 0], l = (h) => (Math3d.mat4.mulv3(o, t.view, h), Math.abs(o[2])), a = l(n);
    return a > 1e-9 ? (h) => {
      r[0] = h[0] + s[0], r[1] = h[1] + s[1], r[2] = h[2] + s[2];
      const f = l(r) / a;
      return Number.isFinite(f) ? Math.max(0.02, Math.min(30, f)) : 1;
    } : () => 1;
  }
  lineCount(t, i, n) {
    return Math.max(1, Math.min(n, Math.ceil(this.geometry.lines.length * this.geometry.spacing / Math.max(this.geometry.spacing, t * i))));
  }
  intersects(t, i) {
    return t.maxU >= i.minU && t.minU <= i.maxU && t.maxV >= i.minV && t.minV <= i.maxV;
  }
  paintStatic(t, i, n, s) {
    const o = t.color, r = t.linetype, l = n.metersPerPixel, a = i.style === "water" ? Zt : Ht, h = n.bounds, f = (h.maxU - h.minU) * 0.2, u = (h.maxV - h.minV) * 0.2, c = this.focus ?? { minU: h.minU - f, maxU: h.maxU + f, minV: h.minV - u, maxV: h.maxV + u }, d = i.showArrows ? re(this.surface, void 0, i.arrowSize, l * j.arrowLength, c) : [], p = Math.max(0, a - d.length * 3), m = new ct(t, this.surface, p, !1, l, s);
    try {
      if (t.linetype = void 0, i.style === "water") for (const w of this.geometry.water.filter((x) => !this.focus || this.intersects(x.box, this.focus)).slice(0, this.lineCount(l, j.flowSpacing, 900))) {
        const x = w.points;
        for (let b = 1; b < x.length && (m.onSurface(x[b - 1], x[b], O(671098, i.opacity * 0.55)), !(m.calls >= p)); b++)
          ;
      }
      const g = [...s];
      g[this.surface.mesh.upAxis === "Z" ? 2 : 1] += Math.max(1e-3, l * 0.05);
      const v = new ct(t, this.surface, a - m.calls, !1, l, g);
      for (const w of d) {
        if (m.calls + v.calls >= a) break;
        v.arrow(w.tail, w.tip, w.size, O(St(Math.min(1, w.slope * 2)), Math.max(0.35, i.opacity)));
      }
    } finally {
      t.color = o, t.linetype = r;
    }
  }
  trails = /* @__PURE__ */ new WeakMap();
  paintDrops(t, i, n, s, o, r) {
    t.thick = !1;
    const { drops: l, tail: a } = Gt(s), h = n.tracks.slice(0, l), f = i.bounds, u = (c) => c.delay <= 0 && c.particle.u >= f.minU && c.particle.u <= f.maxU && c.particle.v >= f.minV && c.particle.v <= f.maxV;
    for (const c of h)
      if (!(!u(c) || t.calls >= o))
        if (c.fall > 0 && r) {
          const d = t.scaleAt(t.point(c.particle));
          t.segment(t.point(c.particle, c.fall), t.point(c.particle, c.fall + i.metersPerPixel * j.rainLength * d), O(10145269, s.opacity * 0.4));
        } else t.head(c.particle, O(10478847, s.opacity), i.right, i.up);
    for (const c of h) {
      if (!u(c) || c.fall > 0 || t.calls >= o) continue;
      const d = St(this.surface.mesh.triangles[c.particle.triangle].slope), p = Math.max(1, c.history.length - a);
      for (let m = p; m < c.history.length && t.calls < o; m++) {
        const g = c.history[m - 1], v = c.history[m];
        let w = this.trails.get(g);
        (!w || w.end !== v || w.lift !== t.lift) && (w = { end: v, lift: t.lift, lines: this.surface.lines(g, v, t.lift) }, this.trails.set(g, w));
        const x = s.opacity * (0.12 + 0.88 * (m - p + 1) / (c.history.length - p));
        for (const [b, y] of w.lines) t.segment(b, y, O(d, x));
      }
    }
  }
  /** Bright dashes slide downhill along every visible flow line: from a distance it reads as running water. */
  paintWater(t, i, n, s) {
    const o = this.clock(), r = i.bounds, l = i.metersPerPixel, a = Math.max(0.4, n.opacity);
    let h = 0, f = 0;
    const u = [];
    for (const c of this.water) {
      if (c.box.maxU < r.minU || c.box.minU > r.maxU || c.box.maxV < r.minV || c.box.minV > r.maxV) continue;
      const d = c.points[c.points.length >> 1], p = l * t.scaleAt(t.point(d)), m = ye(c.slope) * p * n.speed, g = j.dashPeriod * p, v = ke(c, o, m, g);
      f += v.length, u.push({ line: c, heads: v, px: p });
    }
    t.thick = f * 2.2 * 3 <= s * 0.9;
    for (const { line: c, heads: d, px: p } of u) {
      if (t.calls >= s) break;
      const m = j.dashLength * p;
      for (const g of d) {
        const v = be(c, g - m, g);
        if (!(v.length < 2)) {
          h++;
          for (let w = 1; w < v.length; w++) {
            if (t.calls >= s) return h;
            const x = w / (v.length - 1), b = p * j.dashWidth * (0.55 + 0.9 * x);
            t.onSurface(v[w - 1], v[w], O(Ve(741276, 5222655, x), a * (0.25 + 0.75 * x)), b);
          }
        }
      }
    }
    return h;
  }
}
function dt(e) {
  const t = e.tr("Анимация стока");
  return e.manager.outputChannels.channels.find((i) => i.name === t) ?? e.createOutputChannel(t);
}
const Fe = 3600, Lt = 1e3 / 30;
function Ct(e) {
  return e instanceof Error && e.message === "canceled";
}
function nt(e) {
  const t = e.manager.activeWindow ?? e.window, i = e.manager.activeWindow, n = i ? "context" in i ? i.context : void 0 : e.cadview, s = e.manager.activeApp ?? e.app;
  return n && s?.model ? { view: n, app: s, drawing: s.model, window: t } : void 0;
}
function Z(e, t) {
  const i = nt(e);
  if (!i || i.view !== t.view || i.app !== t.app || i.drawing !== t.drawing) return !1;
  const n = (s) => s.some((o) => o.uid === t.window?.uid || n(o.windows));
  return !t.window || n(e.manager.windows);
}
class Pe {
  constructor(t) {
    this.ctx = t;
  }
  ctx;
  target;
  renderer;
  rain;
  timer;
  sinkLayer;
  status;
  generation = 0;
  running = !1;
  previousTime = 0;
  painting = !1;
  settings = ot();
  settingsLoad;
  settingsWrite = Promise.resolve();
  async loadSettings() {
    this.settingsLoad ??= (async () => {
      try {
        this.settings = ot(await this.ctx.extension.settings("flowanim").get("controls"));
      } catch {
      }
    })(), await this.settingsLoad;
  }
  async setView(t) {
    await this.loadSettings(), this.settings = ot({ ...this.settings, ...t });
    const { style: i, showArrows: n } = this.settings, s = this.ctx;
    this.running && (this.renderer?.release(), this.target?.view.invalidate(!0)), this.settingsWrite = this.settingsWrite.then(async () => {
      try {
        await s.extension.settings("flowanim").set("controls", { style: i, showArrows: n });
      } catch {
      }
    }), await this.settingsWrite;
  }
  bind(t) {
    this.ctx = t;
  }
  contextChanged(t) {
    this.target && (t === this.target.app || !Z(this.ctx, this.target)) && this.stop();
  }
  async runSurface(t) {
    this.stop();
    const i = nt(this.ctx);
    if (!i) {
      await this.ctx.showMessage(this.ctx.tr("Откройте чертёж с трёхмерной поверхностью"), "warning");
      return;
    }
    this.target = i;
    const n = this.generation, s = performance.now(), o = () => n !== this.generation || !Z(this.ctx, i);
    window.addEventListener("keydown", this.keydown, !0), window.addEventListener("pagehide", this.pagehide);
    const r = this.ctx.beginProgress();
    r.indeterminate = !1;
    const l = (a, h) => {
      r.label = this.ctx.tr(a), r.percents = h;
    };
    try {
      const a = await D($t(t, l), o);
      if (!a || o()) return;
      const h = a.mesh.triangles.filter((f) => f.valid).length;
      if (!h) throw Error("На поверхности нет пригодных для стока треугольников или точек посева");
      dt(this.ctx).appendLine(this.ctx.tr(
        "Поверхность: {0}; расчёт: {1} мс; треугольников: {2}",
        t.map(et).join(", "),
        Math.round(performance.now() - s),
        h
      )), l("Расчёт завершён", 100), await this.launch(a, void 0, n);
    } catch (a) {
      n === this.generation && (this.stop(), Ct(a) || await this.reportError(a));
    } finally {
      this.ctx.endProgress(r), n === this.generation && !this.running && this.stop();
    }
  }
  async showProblem(t) {
    this.stop();
    const i = nt(this.ctx);
    if (!i || i.drawing !== (t.drawing ?? this.ctx.app?.model)) return;
    this.target = i;
    const n = this.generation;
    if (await this.loadSettings(), n !== this.generation || !Z(this.ctx, i)) return;
    const { surface: s, bbox: o } = t, r = s.mesh.bounds, l = Math.max(3 * Math.max(o.maxU - o.minU, o.maxV - o.minV), 25 * s.characteristicLength), a = {
      minU: Math.max(r.minU, o.minU - l),
      minV: Math.max(r.minV, o.minV - l),
      maxU: Math.min(r.maxU, o.maxU + l),
      maxV: Math.min(r.maxV, o.maxV + l)
    };
    try {
      if (t.kind === "sinks") {
        const h = this.sinkLayer = i.view.annotations.create("ru.abr.flowanim.sinks", 100);
        h.visible = !0;
        const f = s.toWorld(t.position);
        h.add({ type: "image", position: f, icon: "water_drop", size: 20 }), h.add({ type: "simple", position: f, attachment: "below", label: this.ctx.tr("Понижение, отметка {0}", f[s.mesh.upAxis === "Z" ? 2 : 1].toFixed(3)) });
      }
      dt(this.ctx).appendLine(this.ctx.tr("Анимация проблемы: {0}", et(t.model))), await this.launch(s, a, n);
    } catch (h) {
      this.stop(), console.error("flowanim", h);
    }
  }
  async launch(t, i, n) {
    await this.loadSettings(), !(n !== this.generation || !this.target || !Z(this.ctx, this.target)) && (this.renderer = new Ee(t, [], i), this.rain = new jt(t, [], { count: this.settings.drops }), this.previousTime = performance.now(), this.running = !0, this.status = this.ctx.setStatusBarMessage(this.ctx.tr("Esc — остановить анимацию")), window.addEventListener("keydown", this.keydown, !0), window.addEventListener("pagehide", this.pagehide), this.animate(this.generation));
  }
  active(t) {
    return t === this.generation && this.running;
  }
  async animate(t) {
    const i = this.target.view;
    try {
      for (; this.active(t); ) {
        const n = i.animate(Fe, () => this.frame(t), (o, r) => {
          if (!(!this.active(t) || this.painting || !this.renderer)) {
            this.painting = !0;
            try {
              this.renderer.paint(o, r, this.rain, this.settings);
            } catch (l) {
              this.stop(), console.error("flowanim", l);
            } finally {
              this.painting = !1;
            }
          }
        });
        i.invalidate(!0);
        const s = await n;
        if (!this.active(t)) return;
        if (!s) {
          this.stop();
          return;
        }
        await new Promise((o) => setTimeout(o, 0));
      }
    } catch (n) {
      this.active(t) && (this.stop(), console.error("flowanim", n));
    }
  }
  frame(t) {
    if (!this.active(t)) return !0;
    if (!this.target || !Z(this.ctx, this.target))
      return this.stop(), !0;
    try {
      const i = performance.now(), n = i - this.previousTime;
      if (n >= Lt) {
        const s = Math.min(0.1, Math.max(0, n / 1e3));
        this.previousTime = i, this.rain?.advance(Math.min(0.25, s * this.settings.speed));
      }
      return this.timer !== void 0 && clearTimeout(this.timer), this.timer = setTimeout(
        () => {
          this.timer = void 0, this.active(t) && this.target?.view.invalidate(!0);
        },
        Math.max(1, Lt - (i - this.previousTime))
      ), !1;
    } catch (i) {
      return this.stop(), console.error("flowanim", i), !0;
    }
  }
  keydown = (t) => {
    t.key === "Escape" && this.stop();
  };
  pagehide = () => this.stop();
  stop() {
    ++this.generation;
    const t = this.target, i = this.running;
    this.running = !1, this.target = void 0, this.rain = void 0, this.timer !== void 0 && (clearTimeout(this.timer), this.timer = void 0), window.removeEventListener("keydown", this.keydown, !0), window.removeEventListener("pagehide", this.pagehide);
    const n = this.sinkLayer, s = this.renderer, o = this.status;
    this.sinkLayer = void 0, this.renderer = void 0, this.status = void 0;
    for (const r of [
      () => {
        i && t?.view.pauseAnimation();
      },
      () => {
        n && t?.view.annotations.release(n);
      },
      () => s?.release(),
      () => o?.dispose(),
      () => t?.view.invalidate()
    ])
      try {
        r();
      } catch (l) {
        console.error("flowanim cleanup", l);
      }
  }
  async reportError(t) {
    if (console.error("flowanim", t), t instanceof tt) {
      await this.ctx.showMessage(this.ctx.tr(t.message, t.limit), "warning");
      return;
    }
    await this.ctx.showMessage(this.ctx.tr("Ошибка стока: {0}", t instanceof Error ? this.ctx.tr(t.message) : String(t)), "error");
  }
}
const st = /* @__PURE__ */ new WeakMap();
function bt(e) {
  let t = st.get(e.manager);
  return t || (t = new Pe(e), st.set(e.manager, t)), t.bind(e), t;
}
function Ne(e) {
  st.get(e)?.stop();
}
const T = /* @__PURE__ */ new WeakMap();
async function Le(e) {
  T.get(e.manager)?.cancel();
  const t = bt(e);
  t.stop();
  const i = nt(e);
  if (!i) {
    await e.showMessage(e.tr("Откройте чертёж с трёхмерной поверхностью"), "warning");
    return;
  }
  let n = !1, s = !0;
  const o = { cancel: () => {
    n = !0, s && i.view.cancel();
  } }, r = (a) => {
    a.key === "Escape" && o.cancel();
  };
  T.set(e.manager, o), window.addEventListener("keydown", r, !0);
  const l = () => !n && T.get(e.manager) === o && Z(e, i);
  try {
    const a = await i.view.getobject(
      e.tr("Укажите поверхность"),
      { list: e.tr("Список") },
      (f) => {
        const u = mt(f);
        return !!u && Vt(u);
      }
    );
    if (s = !1, !l()) return;
    let h;
    if (a === "list") {
      if (await new Promise((c) => setTimeout(c, 0)), !l()) return;
      const f = Rt(i.drawing);
      if (!f.length) {
        await e.showMessage(e.tr("В чертеже нет доступных треугольных 3D-моделей"), "warning");
        return;
      }
      h = (await e.showQuickPick(f, { title: e.tr("Выберите поверхность для анимации стока") }))?.model, await new Promise((c) => setTimeout(c, 0));
    } else a && typeof a == "object" && (h = mt("value" in a ? a.value : a));
    l() && h && Vt(h) && (window.removeEventListener("keydown", r, !0), T.delete(e.manager), await t.runSurface([h]));
  } catch (a) {
    l() && !Ct(a) && console.error("flowanim pick", a);
  } finally {
    window.removeEventListener("keydown", r, !0), T.get(e.manager) === o && T.delete(e.manager);
  }
}
function Ie(e) {
  e.event !== "changeActiveWindow" && e.event !== "changeActiveApp" && e.event !== "closeApp" || (T.get(e.manager)?.cancel(), st.get(e.manager)?.contextChanged(e.event === "closeApp" ? e.app : void 0));
}
async function We(e) {
  const t = bt(e);
  await t.loadSettings();
  const { style: i, showArrows: n } = t.settings, s = [
    { label: (i === "water" ? "✓ " : "") + e.tr("Вода"), view: "water" },
    { label: (i === "drops" ? "✓ " : "") + e.tr("Капли"), view: "drops" },
    { label: "", kind: It.Separator, view: "separator" },
    { label: n ? e.tr("Стрелки: включены (переключить)") : e.tr("Стрелки: выключены (переключить)"), view: "arrows" }
  ];
  try {
    const o = await e.showQuickPick(s, { title: e.tr("Вид анимации") });
    await new Promise((r) => setTimeout(r, 0)), o?.view === "water" || o?.view === "drops" ? await t.setView({ style: o.view }) : o?.view === "arrows" && await t.setView({ showArrows: !t.settings.showArrows });
  } catch (o) {
    if (!(o instanceof Error && o.message === "canceled")) throw o;
  }
}
const $ = 2048, Ot = () => ({ minU: 1 / 0, minV: 1 / 0, maxU: -1 / 0, maxV: -1 / 0 });
function pt(e, t) {
  e.minU = Math.min(e.minU, t.u), e.minV = Math.min(e.minV, t.v), e.maxU = Math.max(e.maxU, t.u), e.maxV = Math.max(e.maxV, t.v);
}
function gt(e, t) {
  const [i, n, s] = e.triangles[t].ids.map((o) => e.points[o]);
  return {
    area: Math.abs((n.u - i.u) * (s.v - i.v) - (n.v - i.v) * (s.u - i.u)) / 2,
    position: { u: (i.u + n.u + s.u) / 3, v: (i.v + n.v + s.v) / 3, h: (i.h + n.h + s.h) / 3 }
  };
}
class je {
  items = [];
  less(t, i) {
    return t.level < i.level || t.level === i.level && t.id < i.id;
  }
  push(t, i) {
    const n = { id: t, level: i }, s = this.items;
    let o = s.length;
    for (s.push(n); o > 0; ) {
      const r = o - 1 >> 1;
      if (!this.less(n, s[r])) break;
      s[o] = s[r], o = r;
    }
    s[o] = n;
  }
  pop() {
    const t = this.items, i = t[0], n = t.pop();
    if (t.length && n) {
      let s = 0;
      for (; s * 2 + 1 < t.length; ) {
        let o = s * 2 + 1;
        if (o + 1 < t.length && this.less(t[o + 1], t[o]) && o++, !this.less(t[o], n)) break;
        t[s] = t[o], s = o;
      }
      t[s] = n;
    }
    return i;
  }
}
function* ze(e, t = 0.01) {
  const i = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map();
  let s = 0;
  for (const c of e.triangles)
    if (++s % $ === 0 && (yield), !!c.valid)
      for (let d = 0; d < 3; d++) {
        const p = c.ids[d], m = c.ids[(d + 1) % 3], g = p < m ? `${p}:${m}` : `${m}:${p}`, v = n.get(g);
        v ? v.count++ : n.set(g, { a: p, b: m, count: 1 }), i.has(p) || i.set(p, /* @__PURE__ */ new Set()), i.has(m) || i.set(m, /* @__PURE__ */ new Set()), i.get(p).add(m), i.get(m).add(p);
      }
  const o = new Float64Array(e.points.length);
  o.fill(1 / 0);
  const r = new Uint8Array(e.points.length), l = new je();
  for (const c of n.values()) {
    if (c.count === 1)
      for (const d of [c.a, c.b]) r[d] || (r[d] = 1, o[d] = e.points[d].h, l.push(d, o[d]));
    ++s % $ === 0 && (yield);
  }
  for (let c = l.pop(); c; c = l.pop())
    for (const d of i.get(c.id) ?? [])
      r[d] || (r[d] = 1, o[d] = Math.max(e.points[d].h, c.level), l.push(d, o[d])), ++s % $ === 0 && (yield);
  const a = new Int32Array(e.points.length);
  a.fill(-1);
  const h = [], f = [], u = (c) => Number.isFinite(o[c]) && o[c] > e.points[c].h;
  for (let c = 0; c < e.points.length; c++) {
    if (++s % $ === 0 && (yield), a[c] !== -1 || !u(c)) continue;
    const d = h.length, p = [c], m = Ot();
    a[c] = d;
    let g = c;
    for (let w = 0; w < p.length; w++) {
      const x = p[w], b = e.points[x], y = e.points[g];
      pt(m, b), (b.h < y.h || b.h === y.h && x < g) && (g = x);
      for (const M of i.get(x) ?? [])
        a[M] === -1 && u(M) && (a[M] = d, p.push(M)), ++s % $ === 0 && (yield);
    }
    const v = e.points[g];
    f.push(o[g]), h.push({ ...v, depth: o[g] - v.h, area: 0, triangles: [], arrivals: 0, bbox: m });
  }
  for (let c = 0; c < e.triangles.length; c++) {
    const d = e.triangles[c];
    if (d.valid) {
      const p = d.ids.map((m) => a[m]).find((m) => m >= 0);
      if (p !== void 0) {
        const m = gt(e, c), g = h[p];
        if (m.position.h < f[p]) {
          g.area += m.area, g.triangles.push(c);
          for (const v of d.ids) pt(g.bbox, e.points[v]);
        }
      }
    }
    ++s % $ === 0 && (yield);
  }
  return h.filter((c) => c.depth >= t);
}
function* Re(e, t, i = 0) {
  const n = new Int32Array(e.triangles.length);
  n.fill(-1);
  const s = /* @__PURE__ */ new Map();
  let o = 0;
  const r = (h) => {
    for (; n[h] !== h; )
      n[h] = n[n[h]], h = n[h];
    return h;
  };
  for (let h = 0; h < e.triangles.length; h++) {
    const f = e.triangles[h];
    if (f.valid && Number.isFinite(f.slope) && f.slope * 100 < t) {
      n[h] = h;
      for (let u = 0; u < 3; u++) {
        const c = f.ids[u], d = f.ids[(u + 1) % 3], p = c < d ? `${c}:${d}` : `${d}:${c}`, m = s.get(p);
        if (m === void 0) s.set(p, h);
        else {
          const g = r(h), v = r(m);
          n[Math.max(g, v)] = Math.min(g, v);
        }
      }
    }
    ++o % $ === 0 && (yield);
  }
  const l = /* @__PURE__ */ new Map();
  for (let h = 0; h < n.length; h++) {
    if (n[h] >= 0) {
      const f = r(h), u = gt(e, h);
      let c = l.get(f);
      c || (c = { triangles: [], area: 0, meanSlope: 0, position: { u: 0, v: 0, h: 0 }, bbox: Ot() }, l.set(f, c)), c.triangles.push(h), c.area += u.area, c.meanSlope += u.area * e.triangles[h].slope * 100, c.position.u += u.area * u.position.u, c.position.v += u.area * u.position.v;
      for (const d of e.triangles[h].ids) pt(c.bbox, e.points[d]);
    }
    ++o % $ === 0 && (yield);
  }
  const a = [];
  for (const h of l.values()) {
    if (h.area < i || h.area === 0) continue;
    h.meanSlope /= h.area;
    const f = h.position.u / h.area, u = h.position.v / h.area;
    let c = 1 / 0;
    for (const d of h.triangles) {
      const p = gt(e, d).position, m = (p.u - f) ** 2 + (p.v - u) ** 2;
      m < c && (c = m, h.position = p), ++o % $ === 0 && (yield);
    }
    a.push(h);
  }
  return a;
}
function $e(e, t) {
  const { ctx: i, problem: n } = e, s = i.cadview;
  if (!s) return;
  const o = n.position, r = n.surface.origin, l = [o.u + r[0], o.v + r[1], o.h + r[2]], a = Math.max(20, 15 * n.surface.characteristicLength), h = n.bbox, f = a + Math.max(o.u - h.minU, h.maxU - o.u, o.v - h.minV, h.maxV - o.v), u = [l[0] - f, l[1] - f, l[2] - f, l[0] + f, l[1] + f, l[2] + f];
  try {
    s.camera.zoom(u, s), bt(i).showProblem(n);
  } catch (c) {
    console.error("flowanim activation", c);
  }
}
async function Tt(e, t, i, n, s, o) {
  Ne(e.manager), s.clear(), o.indeterminate = !1, o.percents = 0;
  const r = performance.now(), l = i.model, a = n.surfaceFilter.trim() ? me([...l.filterLayers(n.surfaceFilter, !0)], l) : Rt(l).map((d) => d.model), h = /* @__PURE__ */ new Map();
  let f = 0;
  const u = (d, p) => {
    let m = h.get(d);
    m || (m = [], h.set(d, m)), m.push(p);
  }, c = a[0]?.layer?.modelName ?? "";
  n.surfaceFilter.trim() || u(c, {
    severity: C.Information,
    message: e.tr("Фильтр поверхности пуст: проверяются все треугольные 3D-поверхности чертежа")
  }), a.length || u(c, { severity: C.Warning, message: e.tr("Поверхности по фильтру не найдены") });
  for (let d = 0; d < a.length; d++) {
    const p = a[d], m = p.layer?.modelName ?? "", g = `${p.layer?.layer?.name ?? ""}/${et(p)}`, v = (w, x) => {
      o.label = e.tr(w), o.percents = (d + x / 100) / a.length * 100;
    };
    try {
      const w = await D($t([p], v));
      v(t === "sinks" ? "Поиск понижений" : "Поиск участков недостаточного уклона", 60);
      const x = t === "sinks" ? await D(ze(w.mesh, n.minDepth)) : await D(Re(w.mesh, n.minSlope, n.minArea));
      if (v("Формирование диагностики", 90), !w.mesh.triangles.some((b) => b.valid)) throw Error("На поверхности нет пригодных для стока треугольников или точек посева");
      for (let b = 0; b < x.length; b++) {
        const y = x[b], M = "position" in y ? y.position : y, S = { kind: t, model: p, surface: w, triangles: y.triangles, position: M, bbox: y.bbox, drawing: l }, U = "depth" in y, P = {
          ctx: e,
          problem: S,
          source: g,
          activation: $e,
          severity: U && y.depth >= 0.5 ? C.Error : C.Warning,
          message: U ? e.tr(
            "Бессточное понижение: отметка дна {0} м, глубина {1} м, площадь {2} м²",
            (y.h + w.origin[2]).toFixed(3),
            y.depth.toFixed(3),
            y.area.toFixed(2)
          ) : e.tr(
            "Недостаточный уклон: {0}% (< {1}%), участок {2} м²",
            y.meanSlope.toFixed(2),
            n.minSlope.toFixed(2),
            y.area.toFixed(2)
          ),
          tooltip: e.tr("X={0}; Y={1}", (M.u + w.origin[0]).toFixed(3), (M.v + w.origin[1]).toFixed(3))
        };
        u(m, P), f++, b % 2048 === 2047 && await new Promise((N) => setTimeout(N, 0));
      }
      x.length || u(m, {
        source: g,
        severity: C.Success,
        message: t === "sinks" ? e.tr("Проверка пройдена: бессточных понижений нет") : e.tr("Проверка пройдена: участков с недостаточным уклоном нет")
      });
    } catch (w) {
      console.error(w), u(m, {
        source: g,
        severity: w instanceof tt ? C.Warning : C.Error,
        message: w instanceof tt ? e.tr("Поверхность слишком большая: лимит {0} граней", w.limit) : e.tr("Ошибка проверки поверхности: {0}", w instanceof Error ? e.tr(w.message) : String(w))
      });
    }
    v("Расчёт завершён", 100);
  }
  for (const [d, p] of h) s.set(d, p);
  o.percents = 100, o.label = e.tr("Расчёт завершён"), dt(e).appendLine(e.tr(
    "Проверка «{0}»: поверхностей {1}; проблем {2}; расчёт {3} мс",
    t === "sinks" ? e.tr("Бессточные понижения") : e.tr("Недостаточный уклон"),
    a.length,
    f,
    Math.round(performance.now() - r)
  ));
}
function Ce(e) {
  return {
    async createRule() {
      return { surfaceFilter: "", minDepth: 0.05 };
    },
    execute: (t, i, n, s) => Tt(e, "sinks", t, i, n, s)
  };
}
function Oe(e) {
  return {
    async createRule() {
      return { surfaceFilter: "", minSlope: 0.5, minArea: 10 };
    },
    execute: (t, i, n, s) => Tt(e, "slope", t, i, n, s)
  };
}
function Te(e) {
  return { getProperties(t) {
    const i = e.field;
    if (!i || !t.length) return [];
    const n = t, s = (r) => r.trim() === "" ? NaN : Number(r), o = (r) => {
      const l = s(r);
      if (!Number.isFinite(l)) return e.tr("Значение должно быть числом");
      if (l < 0) return e.tr("Значение должно быть не меньше нуля");
    };
    return [{
      id: `float-${i}`,
      label: e.label ? e.tr(e.label) : i,
      description: e.description ? e.tr(e.description) : void 0,
      group: e.group,
      value() {
        const r = n[0][i];
        return n.some((l) => l[i] !== r) ? { label: e.tr("**Различные**") } : { label: String(r), suffix: typeof e.units == "string" ? e.tr(e.units) : void 0 };
      },
      editor() {
        return {
          type: "editbox",
          validate: o,
          commit(r) {
            if (!(r === void 0 || o(r)))
              for (const l of n) l[i] = s(r);
          }
        };
      }
    }];
  } };
}
const _e = {
  "rule:flow:sinks": Ce,
  "rule:flow:slope": Oe,
  "property:float": Te,
  "flow:pick": Le,
  "flow:view": We,
  "flow:broadcast": Ie
};
export {
  _e as default
};
