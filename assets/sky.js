/* =====================================================================
 * sky.js · AURELIA 熔核恒星 · WebGL 渲染器 v2
 * ---------------------------------------------------------------------
 * 架构：两个 program + 一张预渲染背景纹理
 *
 *   ① bgProg  → 把「深空」一次性渲染进 FBO 纹理：
 *        5 层域扭曲星云 + 斜向银河带 + 星团 + 3 层不同旋转的星场 +
 *        暗尘带 + 细密星尘。静态内容，只在 resize 时重绘一次。
 *   ② mainProg → 每帧：采样背景（带视差）+ 实时闪烁亮星 + 巨大恒星
 *        （细胞状米粒组织 / 暗条 / 法线扰动 / 日冕 / 弧形日珥 /
 *         赤道等离子环）+ 镜头光晕 + 暗角颗粒 + ACES。
 *
 * 对外接口（window.Sky）：
 *   var sky = new Sky(canvas);
 *   sky.ok / sky.err / sky.resize(w,h,scale) / sky.render(state)
 * ===================================================================== */
(function (global) {
  'use strict';

  var VERT = [
    'attribute vec2 aPos;',
    'void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }'
  ].join('\n');

  /* ================================================================== */
  /* 背景：深空星云 · 银河 · 星团 · 星场                                   */
  /* ================================================================== */
  var BG_FRAG = `
precision highp float;
uniform vec2 uRes;
uniform vec2 uSeed;

/* ------------------------------------------------ hash & noise */
float h12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float h13(vec3 p3) {
  p3 = fract(p3 * 0.1031);
  p3 += dot(p3, p3.zyx + 31.32);
  return fract((p3.x + p3.y) * p3.z);
}
float vn(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  float n000 = h13(i);
  float n100 = h13(i + vec3(1.0, 0.0, 0.0));
  float n010 = h13(i + vec3(0.0, 1.0, 0.0));
  float n110 = h13(i + vec3(1.0, 1.0, 0.0));
  float n001 = h13(i + vec3(0.0, 0.0, 1.0));
  float n101 = h13(i + vec3(1.0, 0.0, 1.0));
  float n011 = h13(i + vec3(0.0, 1.0, 1.0));
  float n111 = h13(i + vec3(1.0, 1.0, 1.0));
  return mix(mix(mix(n000, n100, f.x), mix(n010, n110, f.x), f.y),
             mix(mix(n001, n101, f.x), mix(n011, n111, f.x), f.y), f.z);
}
float fbm2(vec3 p) {
  return (0.5 * vn(p) + 0.25 * vn(p * 2.03 + vec3(7.13, 1.71, 9.37))) / 0.75;
}
float fbm3(vec3 p) {
  return (0.5 * vn(p)
        + 0.25 * vn(p * 2.03 + vec3(7.13, 1.71, 9.37))
        + 0.125 * vn(p * 4.07 + vec3(3.31, 8.17, 2.59))) / 0.875;
}
float fbm4(vec3 p) {
  return (0.5 * vn(p)
        + 0.25 * vn(p * 2.03 + vec3(7.13, 1.71, 9.37))
        + 0.125 * vn(p * 4.07 + vec3(3.31, 8.17, 2.59))
        + 0.0625 * vn(p * 8.11 + vec3(5.77, 0.43, 6.11))) / 0.9375;
}
float fbm5(vec3 p) {
  return (0.5 * vn(p)
        + 0.25 * vn(p * 2.03 + vec3(7.13, 1.71, 9.37))
        + 0.125 * vn(p * 4.07 + vec3(3.31, 8.17, 2.59))
        + 0.0625 * vn(p * 8.11 + vec3(5.77, 0.43, 6.11))
        + 0.03125 * vn(p * 16.2 + vec3(1.91, 4.77, 9.31))) / 0.96875;
}

/* ------------------------------------------------ 星场（每层独立旋转） */
vec3 starLayer(vec2 uv, float dens, float bright, float seed, float rot) {
  float cs = cos(rot), sn = sin(rot);
  vec2 ru = vec2(uv.x * cs - uv.y * sn, uv.x * sn + uv.y * cs);
  vec2 cell = floor(ru * dens);
  vec2 f = fract(ru * dens);

  vec2 jit = vec2(h12(cell + seed), h12(cell + seed + 19.73));
  vec2 pos = 0.18 + 0.64 * jit;
  float d = length(f - pos);

  float mag = h12(cell + seed + 41.31);
  float rr = (0.008 + 0.030 * mag) * (1.0 + 0.8 * h12(cell + seed + 7.11));
  float core = 1.0 - smoothstep(rr * 0.10, rr, d);
  float halo = (1.0 - smoothstep(0.0, rr * 6.0, d)) * 0.075;

  vec3 tint = mix(vec3(0.62, 0.76, 1.0), vec3(1.0, 0.84, 0.62), h12(cell + seed + 3.77));

  vec3 col = tint * (core + halo) * bright;
  /* 亮星十字星芒 */
  float spike = step(0.972, mag);
  float sx = (1.0 - smoothstep(0.0, 0.0026, abs(f.x - pos.x))) *
             (1.0 - smoothstep(0.0, 0.075, abs(f.y - pos.y)));
  float sy = (1.0 - smoothstep(0.0, 0.0026, abs(f.y - pos.y))) *
             (1.0 - smoothstep(0.0, 0.075, abs(f.x - pos.x)));
  col += tint * (sx + sy) * spike * bright * 0.85;
  return col;
}

/* ------------------------------------------------ 带星团调制的星场 */
vec3 starField(vec2 uv, float dens, float bright, float seed, float rot,
               vec2 cA, vec2 cB, vec2 cC) {
  float gA = exp(-dot(uv - cA, uv - cA) * 5.5);
  float gB = exp(-dot(uv - cB, uv - cB) * 8.0);
  float gC = exp(-dot(uv - cC, uv - cC) * 11.0);
  float boost = 1.0 + 2.4 * gA + 1.8 * gB + 1.4 * gC;
  return starLayer(uv, dens, bright * boost, seed, rot);
}

/* ------------------------------------------------ 主函数 */
void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float asp = uRes.x / uRes.y;
  vec2 uv = p;
  vec2 sd = uSeed;

  vec3 col = vec3(0.0026, 0.0048, 0.0094);

  /* ==================== 1 · 银河坐标系 ==================== */
  float gAng = -0.42;
  vec2 gDir = vec2(cos(gAng), sin(gAng));
  vec2 gNrm = vec2(-gDir.y, gDir.x);
  float gs = dot(uv, gDir);      /* 沿银道方向 */
  float gdv = dot(uv, gNrm);     /* 垂直银道方向 */

  /* 银心隆起 */
  float bulge = exp(-pow((gs - 0.10) / 0.30, 2.0));

  /* 银道轻微弯曲 */
  float warp = (fbm3(vec3(gs * 2.3 + 3.1, sd.x * 2.0, 1.7)) - 0.5) * 0.085;
  float gd = gdv - warp;

  /* 银带宽度：越靠近银心越厚 */
  float width = 0.200 + 0.150 * bulge;
  float band = exp(-pow(gd / width, 2.0));
  float bandCore = exp(-pow(gd / (width * 0.42), 2.0));

  /* ==================== 2 · 银河星云（沿银道拉伸） ==================== */
  vec2 nq = vec2(gs * 1.45, gd * 3.6) + sd * 1.9;
  float n1 = fbm4(vec3(nq * 1.10, 0.7));
  float n2 = fbm4(vec3(nq * 2.30 + vec2(n1) * 1.45, 2.3));
  float n3 = fbm3(vec3(nq * 4.60 + vec2(n2) * 1.15, 4.1));

  vec3 cDeep  = vec3(0.014, 0.034, 0.086);
  vec3 cBlue  = vec3(0.038, 0.100, 0.240);
  vec3 cCyan  = vec3(0.012, 0.160, 0.210);
  vec3 cMag   = vec3(0.190, 0.045, 0.180);
  vec3 cAmber = vec3(0.230, 0.112, 0.026);

  vec3 nc = mix(cDeep, cBlue, smoothstep(0.22, 0.72, n1));
  nc = mix(nc, cMag, smoothstep(0.42, 0.90, n2) * 0.62);
  nc = mix(nc, cCyan, smoothstep(0.46, 0.94, n3) * 0.62);
  nc = mix(nc, cAmber, smoothstep(0.63, 0.97, n1 * n3 * 1.5) * 0.50);

  float nebMask = smoothstep(0.24, 0.84, n1 * 0.58 + n2 * 0.54);
  nebMask *= 0.22 + 0.92 * band;
  col += nc * nebMask * 0.92;

  /* ==================== 3 · 银河暗尘 ==================== */
  /* 银道中心暗裂：把银河切成两半 */
  float laneN = fbm4(vec3(vec2(gs * 2.6, gd * 10.0), 3.3 + sd.y));
  float lane = exp(-pow((gd - 0.018) / 0.055, 2.0)) * (0.32 + 0.85 * laneN);
  col *= 1.0 - lane * 0.85 * smoothstep(0.10, 0.60, band);

  /* 团块状暗尘云 */
  float dustCloud = smoothstep(0.50, 0.86, fbm4(vec3(vec2(gs * 3.6, gd * 7.5), 7.1)));
  col *= 1.0 - dustCloud * 0.40 * band;

  /* 丝状暗纹 */
  float fil = 1.0 - abs(fbm4(vec3(nq * 4.2 + 2.0, 9.7)) * 2.0 - 1.0);
  fil = pow(fil, 6.0);
  col *= 1.0 - fil * 0.34 * nebMask;

  /* ==================== 4 · 星场 ==================== */
  /* 大尺度密度调制：有的天区星多，有的星少，打破均匀感 */
  float densMod = 0.45 + 1.05 * fbm3(vec3(uv * 2.2, 0.9));

  col += starLayer(uv + vec2(0.31, 0.17), 92.0, 0.20 * densMod, 1.0, 0.15);
  col += starLayer(uv + vec2(0.72, 0.83), 46.0, 0.30 * densMod, 7.3, 0.62);
  col += starLayer(uv + vec2(0.19, 0.47), 24.0, 0.46 * densMod, 13.9, 1.18);

  /* 银河带内的密集星尘：五层叠加 → 真正的"星尘"质感 */
  col += starLayer(uv + vec2(0.37, 0.11), 300.0, 0.60 * band, 31.7, 0.83);
  col += starLayer(uv + vec2(0.90, 0.30), 520.0, 0.32 * band, 57.1, 1.70);
  col += starLayer(uv + vec2(0.20, 0.70), 760.0, 0.17 * band, 83.3, 0.41);
  col += starLayer(uv + vec2(0.55, 0.42), 1080.0, 0.090 * band, 97.7, 2.30);
  col += starLayer(uv + vec2(0.68, 0.18), 1500.0, 0.048 * band, 113.9, 1.15);

  /* 银心亮核 */
  col += vec3(0.28, 0.24, 0.28) * band * bulge * 0.140;
  col += vec3(0.38, 0.33, 0.36) * bandCore * bulge * 0.075;
  /* 整条银带的柔光 */
  col += vec3(0.050, 0.046, 0.068) * band * 0.85;

  /* ==================== 5 · 整体氛围 ==================== */
  col *= 1.0 + 0.20 * smoothstep(-0.6, 0.6, uv.x);
  col += vec3(0.007, 0.004, 0.011) * smoothstep(0.2, 1.1, length(uv * vec2(0.7, 1.0)));

  gl_FragColor = vec4(col, 1.0);
}
`;

  /* ================================================================== */
  /* 主场景：恒星 + 日冕 + 日珥 + 等离子环 + 光晕                           */
  /* ================================================================== */
  var MAIN_FRAG = `
precision highp float;

uniform vec2  uRes;
uniform float uTime;
uniform vec2  uPointer;
uniform float uReveal;
uniform vec2  uCore;
uniform float uRadius;
uniform float uFlare;
uniform sampler2D uBg;

/* ------------------------------------------------ hash & noise */
float h12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float h13(vec3 p3) {
  p3 = fract(p3 * 0.1031);
  p3 += dot(p3, p3.zyx + 31.32);
  return fract((p3.x + p3.y) * p3.z);
}
float vn(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  float n000 = h13(i);
  float n100 = h13(i + vec3(1.0, 0.0, 0.0));
  float n010 = h13(i + vec3(0.0, 1.0, 0.0));
  float n110 = h13(i + vec3(1.0, 1.0, 0.0));
  float n001 = h13(i + vec3(0.0, 0.0, 1.0));
  float n101 = h13(i + vec3(1.0, 0.0, 1.0));
  float n011 = h13(i + vec3(0.0, 1.0, 1.0));
  float n111 = h13(i + vec3(1.0, 1.0, 1.0));
  return mix(mix(mix(n000, n100, f.x), mix(n010, n110, f.x), f.y),
             mix(mix(n001, n101, f.x), mix(n011, n111, f.x), f.y), f.z);
}
float fbm2(vec3 p) {
  return (0.5 * vn(p) + 0.25 * vn(p * 2.03 + vec3(7.13, 1.71, 9.37))) / 0.75;
}
float fbm3(vec3 p) {
  return (0.5 * vn(p)
        + 0.25 * vn(p * 2.03 + vec3(7.13, 1.71, 9.37))
        + 0.125 * vn(p * 4.07 + vec3(3.31, 8.17, 2.59))) / 0.875;
}
float fbm4(vec3 p) {
  return (0.5 * vn(p)
        + 0.25 * vn(p * 2.03 + vec3(7.13, 1.71, 9.37))
        + 0.125 * vn(p * 4.07 + vec3(3.31, 8.17, 2.59))
        + 0.0625 * vn(p * 8.11 + vec3(5.77, 0.43, 6.11))) / 0.9375;
}
float fbm5(vec3 p) {
  return (0.5 * vn(p)
        + 0.25 * vn(p * 2.03 + vec3(7.13, 1.71, 9.37))
        + 0.125 * vn(p * 4.07 + vec3(3.31, 8.17, 2.59))
        + 0.0625 * vn(p * 8.11 + vec3(5.77, 0.43, 6.11))
        + 0.03125 * vn(p * 16.2 + vec3(1.91, 4.77, 9.31))) / 0.96875;
}

/* ================================================================ 恒星表面 */
vec3 starSurface(vec2 rel, float q, float R, float t, float flare) {
  float nz0 = sqrt(max(0.0, 1.0 - (q * q) / (R * R)));
  vec3 n = vec3(rel / R, nz0);

  /* 缓慢自转 */
  float spin = t * 0.050;
  float ca = cos(spin), sa = sin(spin);
  vec3 sp = vec3(ca * n.x - sa * n.z, n.y, sa * n.x + ca * n.z);

  vec3 P = sp * 2.15;
  float t1 = t * 0.045;

  /* 大尺度对流 */
  float conv  = fbm5(P + vec3(0.0, t1 * 0.5, t1));
  /* 中尺度湍流 */
  float turb  = fbm4(P * 3.1 + vec3(t1 * 1.8, 0.0, t1 * 1.2));
  /* 细胞状米粒组织：ridged 提取细胞壁 */
  float cellA = 1.0 - abs(fbm3(P * 7.5 + vec3(t * 0.30, 0.0, 0.0)) * 2.0 - 1.0);
  float cellB = 1.0 - abs(fbm3(P * 14.0 + vec3(0.0, t * 0.42, 0.0)) * 2.0 - 1.0);
  float cells = pow(cellA, 3.2) * 0.7 + pow(cellB, 4.0) * 0.3;
  /* 极高频细节 */
  float fine = vn(P * 34.0 + vec3(t * 0.55, 0.0, 0.0));

  /* 热度场：大尺度为主，细胞纹理为辅 */
  float heat = conv * 0.44 + turb * 0.28 + cells * 0.14 + fine * 0.14;
  heat = smoothstep(0.16, 0.92, heat);

  /* 五段色阶：暗褐 → 暗橙 → 亮橙 → 金 → 白热 */
  vec3 c0 = vec3(0.105, 0.008, 0.001);
  vec3 c1 = vec3(0.335, 0.040, 0.004);
  vec3 c2 = vec3(0.740, 0.155, 0.016);
  vec3 c3 = vec3(0.990, 0.430, 0.090);
  vec3 c4 = vec3(1.000, 0.800, 0.480);
  vec3 c5 = vec3(1.000, 0.960, 0.870);

  vec3 col = mix(c0, c1, smoothstep(0.00, 0.28, heat));
  col = mix(col, c2, smoothstep(0.24, 0.52, heat));
  col = mix(col, c3, smoothstep(0.48, 0.76, heat));
  col = mix(col, c4, smoothstep(0.74, 0.93, heat));
  col = mix(col, c5, smoothstep(0.91, 1.02, heat));

  /* 米粒细胞的亮边 */
  col += vec3(1.0, 0.60, 0.20) * cells * 0.17;

  /* 大尺度明暗斑块：让球面不是均匀噪点 */
  float patchy = fbm3(P * 0.85 + 4.0);
  col *= 0.80 + 0.40 * patchy;

  /* 能量脉络（超米粒网络） */
  float ridge = 1.0 - abs(conv * 2.0 - 1.0);
  ridge = pow(ridge, 7.0);
  col += vec3(1.0, 0.42, 0.08) * ridge * 0.55;

  /* 暗条（filament）：细长的暗纹 */
  float fil = fbm4(P * 5.2 + vec3(t1 * 2.4, 0.0, 0.0));
  fil = smoothstep(0.60, 0.86, fil);
  col *= 1.0 - fil * 0.28;

  /* 黑子：小、带半影 */
  float spot = smoothstep(0.260, 0.180, conv);
  float umbra = smoothstep(0.200, 0.140, conv);
  col *= 1.0 - spot * 0.22 - umbra * 0.26;

  /* ---- 球面法线扰动（制造凹凸） ---- */
  float bump = (fbm3(P * 5.5 + 11.0) - 0.5) * 0.55;
  float nz = clamp(nz0 + bump * 0.045, 0.03, 1.0);

  /* ---- 光照：中心白热 → 边缘暗红，带凹凸细节 ---- */
  float limb = pow(nz, 0.66);
  col *= mix(0.055, 1.0, limb);
  col *= 0.72 + 0.62 * pow(nz, 1.05);
  col = mix(col, vec3(0.62, 0.075, 0.008), pow(1.0 - nz, 2.6) * 0.72);

  /* 边缘的色球微光 */
  col += vec3(1.0, 0.42, 0.10) * pow(1.0 - nz, 8.0) * 0.55;

  /* 局部耀斑 */
  col += vec3(1.0, 0.78, 0.42) * flare * pow(heat, 2.4) * 0.9;

  return col;
}

/* ================================================================ 日冕 · 光芒 */
vec3 corona(vec2 rel, float q, float R, float t, float flare) {
  float k = (q - R) / max(R, 1e-5);
  if (k < 0.0) return vec3(0.0);

  /* 径向衰减：近表面最亮，向外渐隐 */
  float fall = exp(-k * 2.4) * (1.0 - smoothstep(0.35, 1.30, k));
  if (fall < 0.001) return vec3(0.0);

  float ang = atan(rel.y, rel.x);
  vec2 cs = vec2(cos(ang), sin(ang));

  /* ① 低频：3~5 道大光瓣，缓慢漂移 */
  float lobeN = fbm3(vec3(cs * 1.7, 0.5 + t * 0.012));
  float lobe = pow(smoothstep(0.30, 0.88, lobeN), 1.2);

  /* ② 中频：细射线 */
  float rayN = fbm3(vec3(cs * 6.5, 2.2 - t * 0.030));
  float ray = 0.30 + 1.00 * rayN;

  /* ③ 高频：发丝 */
  float wispN = fbm3(vec3(cs * 17.0, 4.8 - t * 0.050));
  float wisps = 0.62 + 0.55 * wispN;

  /* ④ 长光刺：少量延伸得很远的光芒 */
  float spikeN = fbm3(vec3(cs * 3.1, 7.7));
  float spike = smoothstep(0.55, 0.88, spikeN);
  float spikeFar = spike * 2.6 * exp(-k * 1.0);

  float intensity = (0.18 + 2.20 * lobe) * ray * wisps;
  intensity *= 0.45 + 0.90 * exp(-k * 4.0);
  intensity += spikeFar;

  /* 色温：近处金白，远处橙红 */
  float warm = exp(-k * 2.0);
  vec3 c = mix(vec3(1.00, 0.38, 0.07), vec3(1.00, 0.92, 0.72), warm);

  return c * fall * intensity * (0.78 + flare * 0.70);
}

/* ================================================================ 弧形日珥 */
float prominences(vec2 rel, float q, float R, float t) {
  float er = q / max(R, 1e-5);
  if (er < 1.0 || er > 1.60) return 0.0;

  float ang = atan(rel.y, rel.x);
  float total = 0.0;

  /* 五道等离子拱：脚落在色球上，拱顶升到 amp 高度，形成真正的"弧" */
  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    float cAng = -1.65 + fi * 0.76 + sin(t * 0.037 + fi * 2.1) * 0.16;
    float wAng = 0.085 + 0.032 * sin(t * 0.061 + fi * 1.7);

    float dAng = ang - cAng;
    dAng = mod(dAng + 3.14159265, 6.28318530) - 3.14159265;
    float an = dAng / wAng;
    if (abs(an) > 1.0) continue;

    float amp = 0.10 + 0.15 * (0.5 + 0.5 * sin(t * 0.105 + fi * 2.3));
    /* 三层同心拱 → 有厚度的等离子拱，而不是一根细线 */
    float band = 0.0;
    for (int j = 0; j < 3; j++) {
      float fj = float(j);
      float a2 = amp * (1.0 - fj * 0.16);
      float curve = 1.0 + a2 * (1.0 - an * an);
      float thick = 0.013 + 0.009 * a2;
      band += exp(-pow((er - curve) / thick, 2.0)) * (1.0 - fj * 0.22);
    }
    if (band < 0.004) continue;

    /* 脚部淡出，避免在拱脚处堆成"拉链" */
    float fade = 1.0 - smoothstep(0.45, 0.85, abs(an));
    float strands = 0.5 + 0.5 * sin(an * 14.0 + t * 1.15 + fi * 3.1);
    strands = pow(clamp(strands, 0.0, 1.0), 1.5);
    total += band * (0.32 + 0.92 * strands) * fade;
  }
  return total;
}

/* ================================================================ 赤道等离子环 */
vec4 disk(vec2 p, float t, float flare) {
  vec2 rel = p - uCore;
  float R = uRadius;
  float squash = 0.46;
  float tilt = -0.075;
  float ct = cos(tilt), st = sin(tilt);
  vec2 rr = vec2(rel.x * ct - rel.y * st, rel.x * st + rel.y * ct);

  float er = length(vec2(rr.x, rr.y / squash));
  float inner = R * 1.24;
  float outer = R * 1.58;
  float band = smoothstep(inner, inner * 1.05, er) * (1.0 - smoothstep(outer * 0.92, outer, er));
  if (band < 0.0018) return vec4(0.0);

  float ang = atan(rr.y / squash, rr.x);
  vec2 cs = vec2(cos(ang), sin(ang));

  float flow = fbm3(vec3(cs * 1.9, er / R * 1.5 + t * 0.050));
  float knots = fbm3(vec3(cs * 5.6, er / R * 4.0 + t * 0.120));
  knots = pow(clamp(knots * 1.5 - 0.28, 0.0, 1.0), 2.0);

  float dop = 0.32 + 0.68 * pow(0.5 + 0.5 * sin(ang), 2.2);

  vec3 c = mix(vec3(0.34, 0.56, 1.0), vec3(1.0, 0.56, 0.22), dop);
  c = mix(c, vec3(1.0, 0.90, 0.70), knots * 0.80);

  float a = band * (0.30 + 0.55 * flow) * (0.50 + 1.00 * knots) * dop;
  a *= 0.34 + flare * 0.38;
  return vec4(c * a, a);
}

/* ================================================================ 实时闪烁亮星 */
vec3 twinkle(vec2 p, float t) {
  vec3 col = vec3(0.0);
  for (int L = 0; L < 2; L++) {
    float fl = float(L);
    float dens = 18.0 + fl * 26.0;
    vec2 cell = floor(p * dens);
    vec2 f = fract(p * dens);
    vec2 jit = vec2(h12(cell + fl * 71.3), h12(cell + fl * 37.9));
    vec2 pos = 0.2 + 0.6 * jit;
    float d = length(f - pos);
    float mag = h12(cell + fl * 13.1 + 5.7);
    float rr = 0.012 + 0.020 * mag;
    float core = 1.0 - smoothstep(rr * 0.3, rr, d);
    /* 闪烁幅度收窄：0.35~1.0 → 0.62~1.0，只作细微呼吸，不再明显眨眼 */
    float tw = 0.62 + 0.38 * pow(0.5 + 0.5 * sin(t * (1.2 + mag * 2.8) + mag * 40.0), 2.0);
    vec3 tint = mix(vec3(0.68, 0.82, 1.0), vec3(1.0, 0.88, 0.70), h12(cell + fl * 5.1));
    col += tint * core * tw * (0.5 + 0.5 * fl) * step(0.55, mag);
  }
  return col;
}

/* ================================================================ 镜头光晕 */
vec3 lensFlare(vec2 p, float t, float flare) {
  vec2 c = uCore;
  vec3 col = vec3(0.0);
  float ax = abs(p.y - c.y);
  /* 极短竖直星芒 */
  float sy = exp(-abs(p.x - c.x) * 320.0) * exp(-ax * 9.0) * 0.14;
  col += vec3(1.0, 0.86, 0.64) * sy;
  /* 镜头反射 ghost */
  for (int i = 1; i < 4; i++) {
    float fi = float(i);
    vec2 gp = c * (1.0 + fi * 0.52);
    float gd = length(p - gp);
    float gr = 0.018 + fi * 0.012;
    col += vec3(0.30, 0.50, 0.86) * 0.045 * (1.0 - smoothstep(gr * 0.45, gr, gd));
  }
  return col * (0.65 + flare * 0.85);
}

/* ================================================================ ACES */
vec3 aces(vec3 x) {
  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}

/* ================================================================ 主函数 */
void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float asp = uRes.x / uRes.y;
  float t = uTime;
  float rev = uReveal;

  /* ---------- 背景采样（带视差） ---------- */
  vec2 bgUV = vec2(p.x / asp + 0.5, p.y + 0.5) + uPointer * 0.010;
  vec3 col = texture2D(uBg, clamp(bgUV, vec2(0.001), vec2(0.999))).rgb;

  /* 实时闪烁亮星 */
  col += twinkle(p + uPointer * 0.004, t) * smoothstep(0.0, 0.6, rev);

  vec2 rel = p - uCore;
  float q = length(rel);
  float R = max(uRadius, 1e-4);
  float kr = q / R;
  float px = 1.5 / uRes.y;

  /* ---------- 大范围外围光晕 ---------- */
  float halo = exp(-max(kr - 1.0, 0.0) * 4.2) * 0.52;
  halo *= smoothstep(0.965, 1.045, kr);
  col += vec3(1.0, 0.46, 0.15) * halo * rev;

  /* 超大范围环境光 */
  col += vec3(1.0, 0.42, 0.14) * exp(-kr * 0.58) * 0.048 * rev;

  /* ---------- 星体本体 ---------- */
  float edge = 1.0 - smoothstep(R - px * 1.6, R + px * 1.6, q);
  if (q < R + px * 2.0) {
    vec3 surf = starSurface(rel, min(q, R), R, t, uFlare);
    col = mix(col, surf, edge);
  }

  /* ---------- 日冕 + 弧形日珥 ---------- */
  col += corona(rel, q, R, t, uFlare) * rev;
  col += vec3(1.0, 0.34, 0.10) * prominences(rel, q, R, t) * rev * 1.55;

  /* 色球亮环 */
  float rim = exp(-pow((kr - 0.9910) / 0.0125, 2.0));
  col += vec3(1.0, 0.44, 0.13) * rim * rev * 0.95;

  /* ---------- 赤道环 ---------- */
  vec4 dk = disk(p, t, uFlare);
  float inStar = 1.0 - edge;
  float isBack = step(rel.y, 0.0);
  float isFront = 1.0 - isBack;
  float occ = clamp(dk.a * 1.15, 0.0, 0.70) * inStar * isFront;
  col = mix(col, col * 0.52 + dk.rgb * 0.85, occ);
  col += dk.rgb * (1.0 - inStar);

  /* ---------- 镜头光晕 ---------- */
  col += lensFlare(p, t, uFlare) * smoothstep(0.15, 0.85, rev);

  /* ---------- 暗角 + 颗粒 ---------- */
  float vig = smoothstep(1.62, 0.20, length(p * vec2(1.0, 1.12)));
  col *= mix(0.50, 1.0, vig);
  /* 静态胶片颗粒：锚定在屏幕像素上，不随时间重排。
     原为 floor(t*20) —— 每 50ms 整屏刷新一次，形成 20Hz 规律闪烁。 */
  col += (h12(gl_FragCoord.xy * 0.7071) - 0.5) * 0.008;

  col = aces(col * 1.12);
  col = pow(col, vec3(1.0 / 2.2));
  gl_FragColor = vec4(col, 1.0);
}
`;

  /* ------------------------------------------------------------ WebGL 工具 */
  function compile(gl, type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      var log = gl.getShaderInfoLog(s);
      gl.deleteShader(s);
      throw new Error('shader compile failed: ' + log);
    }
    return s;
  }

  function link(gl, vsSrc, fsSrc) {
    var vs = compile(gl, gl.VERTEX_SHADER, vsSrc);
    var fs = compile(gl, gl.FRAGMENT_SHADER, fsSrc);
    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      throw new Error('program link failed: ' + gl.getProgramInfoLog(prog));
    }
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    return prog;
  }

  function Sky(canvas) {
    this.canvas = canvas;
    this.ok = false;
    this.gl = null;
    this.err = null;
    this.bgProg = null;
    this.mainProg = null;
    this.bgTex = null;
    this.fbo = null;
    this.uni = {};
    this.bgUni = {};
    this.scale = 1;
    this.cssW = 1;
    this.cssH = 1;
    this.bgDirty = true;
    try {
      this._init();
      this.ok = true;
    } catch (e) {
      this.err = (e && e.message) || String(e);
      this.ok = false;
    }
  }

  Sky.prototype._init = function () {
    var opts = {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
      powerPreference: 'high-performance',
      failIfMajorPerformanceCaveat: false
    };
    var gl = this.canvas.getContext('webgl', opts) ||
             this.canvas.getContext('experimental-webgl', opts);
    if (!gl) throw new Error('WebGL unavailable');
    this.gl = gl;

    this.bgProg = link(gl, VERT, BG_FRAG);
    this.mainProg = link(gl, VERT, MAIN_FRAG);

    /* 全屏三角带 */
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    this._buf = buf;

    var names = ['uRes', 'uTime', 'uPointer', 'uReveal', 'uCore', 'uRadius', 'uFlare', 'uBg'];
    for (var i = 0; i < names.length; i++) {
      this.uni[names[i]] = gl.getUniformLocation(this.mainProg, names[i]);
    }
    this.bgUni.uRes = gl.getUniformLocation(this.bgProg, 'uRes');
    this.bgUni.uSeed = gl.getUniformLocation(this.bgProg, 'uSeed');

    /* 背景纹理 */
    this.bgTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.bgTex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    this.fbo = gl.createFramebuffer();

    gl.disable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  };

  Sky.prototype._bindQuad = function (prog) {
    var gl = this.gl;
    var loc = gl.getAttribLocation(prog, 'aPos');
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buf);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  };

  /* 把深空渲染进背景纹理（只在 resize / 首次时调用） */
  Sky.prototype._renderBG = function () {
    var gl = this.gl;
    /* 背景纹理限制在 2200px 宽以内（星云是低频的，星星略微柔化反而更好看） */
    var k = Math.min(1, 2200 / Math.max(1, this.cssW));
    var bw = Math.max(64, Math.round(this.cssW * k));
    var bh = Math.max(64, Math.round(this.cssH * k));

    gl.bindTexture(gl.TEXTURE_2D, this.bgTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, bw, bh, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.bgTex, 0);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      throw new Error('FBO incomplete');
    }

    gl.viewport(0, 0, bw, bh);
    gl.useProgram(this.bgProg);
    this._bindQuad(this.bgProg);
    gl.uniform2f(this.bgUni.uRes, bw, bh);
    /* 固定 seed：背景只在窗口尺寸真正变化时重绘，且重绘后星图完全一致。
       原为每次 Math.random() —— 自适应分辨率重建背景时画面会整片"换一张"。 */
    if (!this.bgSeed) this.bgSeed = [Math.random() * 100, Math.random() * 100];
    gl.uniform2f(this.bgUni.uSeed, this.bgSeed[0], this.bgSeed[1]);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    this.bgDirty = false;
  };

  Sky.prototype.resize = function (cssW, cssH, scale) {
    if (!this.ok) return;
    scale = scale || 1;
    /* 只有窗口 CSS 尺寸变化才需要重绘背景；
       分辨率自适应（scale 变化）只改主场景画布，背景保持不动。 */
    var sizeChanged = (this.cssW !== cssW || this.cssH !== cssH);
    this.cssW = cssW;
    this.cssH = cssH;
    this.scale = scale;

    var w = Math.max(2, Math.round(cssW * scale));
    var h = Math.max(2, Math.round(cssH * scale));
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
    if (sizeChanged || this.bgDirty) {
      this.bgDirty = true;
      this._renderBG();
    }
  };

  Sky.prototype.render = function (s) {
    if (!this.ok) return;
    var gl = this.gl;
    if (gl.isContextLost && gl.isContextLost()) return;
    if (this.bgDirty) this._renderBG();

    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.useProgram(this.mainProg);
    this._bindQuad(this.mainProg);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.bgTex);
    gl.uniform1i(this.uni.uBg, 0);

    gl.uniform2f(this.uni.uRes, this.canvas.width, this.canvas.height);
    gl.uniform1f(this.uni.uTime, s.time);
    gl.uniform2f(this.uni.uPointer, s.pointer.x, s.pointer.y);
    gl.uniform1f(this.uni.uReveal, s.reveal);
    gl.uniform2f(this.uni.uCore, s.core.x, s.core.y);
    gl.uniform1f(this.uni.uRadius, s.radius);
    gl.uniform1f(this.uni.uFlare, s.flare || 0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  global.Sky = Sky;
})(window);
