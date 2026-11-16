/* =========================================================
   article page — TOC, progress, active heading
   ========================================================= */

/* ---------- progress bar ---------- */
const bar = document.createElement("div");
bar.className = "progress";
document.body.appendChild(bar);

const updateProgress = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
  bar.style.width = Math.min(100, Math.max(0, pct)) + "%";
};
updateProgress();
window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);

/* ---------- TOC collapse ---------- */
const tocBtn = document.getElementById("tocBtn");
const tocBody = document.getElementById("tocBody");

tocBtn?.addEventListener("click", () => {
  const open = tocBtn.getAttribute("aria-expanded") === "true";
  tocBtn.setAttribute("aria-expanded", String(!open));
  tocBody.hidden = open;
});

/* ---------- active TOC link while scrolling ---------- */
const headings = [...document.querySelectorAll(".prose h2[id]")];
const tocLinks = [...document.querySelectorAll(".toc-body a")];

if (headings.length && "IntersectionObserver" in window) {
  const map = new Map();
  tocLinks.forEach((a) => map.set(a.getAttribute("href").slice(1), a));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        tocLinks.forEach((a) => a.classList.remove("is-current"));
        map.get(entry.target.id)?.classList.add("is-current");
      });
    },
    { rootMargin: "-25% 0px -65% 0px", threshold: 0 }
  );

  headings.forEach((h) => io.observe(h));
}

/* ---------- smooth TOC scroll offset ---------- */
tocLinks.forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href").slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const y = target.getBoundingClientRect().top + window.scrollY - 84;
    window.scrollTo({ top: y, behavior: "smooth" });
    history.replaceState(null, "", "#" + id);
  });
});
