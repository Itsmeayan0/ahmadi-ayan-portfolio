/* =========================================================
   green particle field — full page background
   ========================================================= */

(function () {
  const canvas = document.getElementById("particles");
  if (!canvas) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  let w = 0, h = 0, dpr = 1;
  let parts = [];
  const pointer = { x: -9999, y: -9999, active: false };

  const isDark = () => document.documentElement.dataset.theme === "dark";

  /* green palette */
  const GREEN = {
    light: { dot: "16,163,96", line: "16,163,96", dotA: 0.5, lineA: 0.2 },
    dark:  { dot: "52,211,153", line: "52,211,153", dotA: 0.75, lineA: 0.26 },
  };

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;

    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    build();
  }

  function build() {
    const area = w * h;
    const count = Math.max(26, Math.min(110, Math.round(area / 13000)));
    parts = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      r: Math.random() * 2.1 + 1,
      pulse: Math.random() * Math.PI * 2,
    }));
  }

  function step() {
    ctx.clearRect(0, 0, w, h);

    const pal = isDark() ? GREEN.dark : GREEN.light;
    const linkDist = w < 560 ? 104 : 138;

    for (const p of parts) {
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += 0.014;

      if (p.x < -30) p.x = w + 30;
      if (p.x > w + 30) p.x = -30;
      if (p.y < -30) p.y = h + 30;
      if (p.y > h + 30) p.y = -30;

      if (pointer.active) {
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const d2 = dx * dx + dy * dy;
        const R = 140;
        if (d2 < R * R && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const force = (1 - d / R) * 0.6;
          p.x += (dx / d) * force * 2.6;
          p.y += (dy / d) * force * 2.6;
        }
      }
    }

    /* connections */
    for (let i = 0; i < parts.length; i++) {
      const a = parts[i];
      for (let j = i + 1; j < parts.length; j++) {
        const b = parts[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist > linkDist) continue;

        const alpha = (1 - dist / linkDist) * pal.lineA;
        ctx.strokeStyle = `rgba(${pal.line},${alpha})`;
        ctx.lineWidth = 0.75;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    /* dots with gentle pulse */
    for (const p of parts) {
      const pulse = 0.78 + Math.sin(p.pulse) * 0.22;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * pulse, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${pal.dot},${pal.dotA * pulse})`;
      ctx.fill();
    }

    requestAnimationFrame(step);
  }

  function setPointer(clientX, clientY) {
    pointer.x = clientX;
    pointer.y = clientY;
    pointer.active = true;
  }

  window.addEventListener("pointermove", (e) => setPointer(e.clientX, e.clientY), { passive: true });
  window.addEventListener("pointerleave", () => { pointer.active = false; });
  window.addEventListener("touchmove", (e) => {
    if (e.touches[0]) setPointer(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
  window.addEventListener("touchend", () => { pointer.active = false; }, { passive: true });

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 180);
  });

  resize();
  requestAnimationFrame(step);
})();
