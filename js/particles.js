/* =========================================================
   interactive particles — hero field
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

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = rect.width;
    h = rect.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
  }

  function build() {
    const density = w < 520 ? 15000 : 12000;
    const count = Math.max(18, Math.min(90, Math.round((w * h) / density)));
    parts = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      r: Math.random() * 1.9 + 0.9,
    }));
  }

  function step() {
    ctx.clearRect(0, 0, w, h);

    const dark = isDark();
    const dot = dark ? "255,255,255" : "13,15,23";
    const line = dark ? "255,255,255" : "13,15,23";
    const linkDist = w < 520 ? 92 : 122;

    for (const p of parts) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -20) p.x = w + 20;
      if (p.x > w + 20) p.x = -20;
      if (p.y < -20) p.y = h + 20;
      if (p.y > h + 20) p.y = -20;

      if (pointer.active) {
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const d2 = dx * dx + dy * dy;
        const R = 120;
        if (d2 < R * R && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const force = (1 - d / R) * 0.55;
          p.x += (dx / d) * force * 2.4;
          p.y += (dy / d) * force * 2.4;
        }
      }
    }

    /* links */
    for (let i = 0; i < parts.length; i++) {
      for (let j = i + 1; j < parts.length; j++) {
        const a = parts[i], b = parts[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist > linkDist) continue;
        const alpha = (1 - dist / linkDist) * (dark ? 0.3 : 0.14);
        ctx.strokeStyle = `rgba(${line},${alpha})`;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    /* dots */
    for (const p of parts) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${dot},${dark ? 0.55 : 0.32})`;
      ctx.fill();
    }

    requestAnimationFrame(step);
  }

  function onPointer(e) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;
    pointer.active = true;
  }

  window.addEventListener("pointermove", onPointer, { passive: true });
  window.addEventListener("pointerleave", () => { pointer.active = false; });
  window.addEventListener("touchmove", (e) => {
    if (e.touches[0]) onPointer(e.touches[0]);
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
