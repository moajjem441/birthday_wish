export interface ConfettiOptions {
  particleCount?: number;
  spread?: number;
  origin?: { x?: number; y?: number };
  colors?: string[];
  disableForReducedMotion?: boolean;
}

/**
 * Lightweight, pure DOM/CSS confetti engine.
 * Completely immune to Android Force Dark Mode <canvas> inversion glitches
 * and GPU buffer allocation bugs.
 */
export default function confetti(options: ConfettiOptions = {}): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  // Respect user preference for reduced motion
  if (options.disableForReducedMotion) {
    try {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }
    } catch {
      // ignore
    }
  }

  const count = Math.min(options.particleCount ?? 50, 80);
  const spread = options.spread ?? 75;
  const colors = options.colors ?? [
    "#fbbf24",
    "#f59e0b",
    "#f43f5e",
    "#fb7185",
    "#38bdf8",
    "#34d399",
    "#a855f7",
  ];

  const originX = (options.origin?.x ?? 0.5) * window.innerWidth;
  const originY = (options.origin?.y ?? 0.6) * window.innerHeight;

  const container = document.createElement("div");
  container.setAttribute("aria-hidden", "true");
  container.style.position = "fixed";
  container.style.inset = "0";
  container.style.width = "100vw";
  container.style.height = "100vh";
  container.style.overflow = "hidden";
  container.style.pointerEvents = "none";
  container.style.zIndex = "9999";
  container.style.contain = "strict";

  document.body.appendChild(container);

  const duration = 2600; // ms

  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    const color = colors[i % colors.length];
    const size = Math.random() * 5 + 6; // 6px - 11px
    const isRound = Math.random() > 0.6;
    const isRibbon = !isRound && Math.random() > 0.5;

    el.style.position = "absolute";
    el.style.left = `${originX}px`;
    el.style.top = `${originY}px`;
    el.style.width = `${size}px`;
    el.style.height = `${isRound ? size : isRibbon ? size * 1.8 : size}px`;
    el.style.backgroundColor = color;
    el.style.borderRadius = isRound ? "50%" : "2px";
    el.style.pointerEvents = "none";
    el.style.willChange = "transform, opacity";

    // Particle physics trajectory
    const angleRad = ((-90 + (Math.random() - 0.5) * spread) * Math.PI) / 180;
    const velocity = Math.random() * 380 + 260; // px/sec
    const vx = Math.cos(angleRad) * velocity;
    const vy = Math.sin(angleRad) * velocity;
    const gravity = 680; // px/s^2

    const wobbleSpeed = Math.random() * 6 + 5;
    const wobbleAmp = Math.random() * 20 + 8;
    const rotSpeedZ = (Math.random() - 0.5) * 720;
    const rotSpeedX = (Math.random() - 0.5) * 1080;

    if (typeof el.animate === "function") {
      const keyframes: Keyframe[] = [];
      const steps = 12;

      for (let s = 0; s <= steps; s++) {
        const progress = s / steps;
        const t = progress * (duration / 1000); // in seconds

        const x = vx * t + Math.sin(t * wobbleSpeed) * wobbleAmp;
        const y = vy * t + 0.5 * gravity * t * t;

        const rotZ = rotSpeedZ * t;
        const rotX = rotSpeedX * t;

        const opacity = progress > 0.72 ? Math.max(0, 1 - (progress - 0.72) / 0.28) : 1;

        keyframes.push({
          transform: `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotateZ(${rotZ.toFixed(0)}deg) rotateX(${rotX.toFixed(0)}deg)`,
          opacity,
        });
      }

      el.animate(keyframes, {
        duration,
        easing: "cubic-bezier(0.22, 0.61, 0.36, 1)",
        fill: "forwards",
      });
    }

    container.appendChild(el);
  }

  // Self-cleaning teardown
  window.setTimeout(() => {
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }, duration + 150);
}
