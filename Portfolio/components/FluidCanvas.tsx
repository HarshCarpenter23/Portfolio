"use client";

import { useEffect, useRef } from "react";
import { reduced } from "./Providers";

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_vel;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;
  vec2 m = (u_mouse - 0.5 * u_res) / u_res.y;
  vec2 d = uv - m;
  float md = length(d);

  // smoke gets dragged toward the cursor, harder when it moves fast
  float pull = exp(-md * 3.0) * (0.35 + u_vel * 1.4);
  vec2 p = uv * 1.8 - d * pull;

  float t = u_time * 0.055;
  vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t * 0.7));
  vec2 r = vec2(
    fbm(p + 2.2 * q + vec2(1.7, 9.2) + t * 0.9),
    fbm(p + 2.6 * q + vec2(8.3, 2.8) - t * 0.6)
  );
  float f = fbm(p + 2.6 * r);

  vec3 c1 = vec3(0.030, 0.030, 0.035);
  vec3 c2 = vec3(0.075, 0.078, 0.088);
  vec3 c3 = vec3(0.135, 0.135, 0.155);
  vec3 col = mix(c1, c2, smoothstep(0.15, 0.75, f));
  col = mix(col, c3, smoothstep(0.60, 0.95, q.y) * 0.6);

  // signal-orange ember glow near the cursor, brighter in dense smoke
  vec3 orange = vec3(1.0, 0.30, 0.0);
  col += orange * exp(-md * 2.6) * (0.10 + u_vel * 0.6) * (0.25 + 0.75 * f);
  col += orange * smoothstep(0.72, 0.95, f) * exp(-md * 2.0) * 0.10;

  float vig = smoothstep(1.25, 0.35, length(uv));
  col *= mix(0.72, 1.0, vig);
  gl_FragColor = vec4(col, 1.0);
}
`;

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

export default function FluidCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || reduced()) return;
    const gl = canvas.getContext("webgl", {
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const uVel = gl.getUniformLocation(prog, "u_vel");

    // render at reduced resolution — the smoke doesn't need native pixels
    const scale = Math.min(window.devicePixelRatio, 1.5) * 0.5;
    const resize = () => {
      canvas.width = Math.max(1, canvas.clientWidth * scale);
      canvas.height = Math.max(1, canvas.clientHeight * scale);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();

    let mx = canvas.clientWidth * 0.5;
    let my = canvas.clientHeight * 0.35;
    let sx = mx;
    let sy = my;
    let vel = 0;
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", resize);

    let raf = 0;
    let running = true;
    const t0 = performance.now();
    const frame = (now: number) => {
      if (!running) return;
      const dx = mx - sx;
      const dy = my - sy;
      sx += dx * 0.06;
      sy += dy * 0.06;
      vel += (Math.min(Math.hypot(dx, dy) / 200, 1) - vel) * 0.08;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, (now - t0) / 1000);
      gl.uniform2f(uMouse, sx * scale, (canvas.clientHeight - sy) * scale);
      gl.uniform1f(uVel, vel);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    // stop burning GPU when the hero is off-screen or the tab is hidden
    const io = new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting && !document.hidden;
      if (running) raf = requestAnimationFrame(frame);
    });
    io.observe(canvas);
    const onVis = () => {
      running = !document.hidden;
      if (running) raf = requestAnimationFrame(frame);
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    />
  );
}
