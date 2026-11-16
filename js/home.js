/* =========================================================
   home page interactions
   ========================================================= */

const q = (s, r = document) => r.querySelector(s);
const qa = (s, r = document) => [...r.querySelectorAll(s)];

/* ---------- big eyes follow the pointer ---------- */
const eyesWrap = q("#eyesWrap");
const pupils = qa(".pupil");

if (eyesWrap && pupils.length) {
  const move = (clientX, clientY) => {
    const rect = eyesWrap.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const dx = clientX - cx;
    const dy = clientY - cy;
    const dist = Math.hypot(dx, dy) || 1;
    const max = 16;
    const scale = Math.min(max, dist / 6) / dist;

    pupils.forEach((p) => {
      p.style.transform = `translate(${dx * scale}px, ${dy * scale}px)`;
    });
  };

  window.addEventListener(
    "pointermove",
    (e) => move(e.clientX, e.clientY),
    { passive: true }
  );

  window.addEventListener(
    "touchmove",
    (e) => {
      const t = e.touches[0];
      if (t) move(t.clientX, t.clientY);
    },
    { passive: true }
  );

  /* random blink */
  const blink = () => {
    eyesWrap.classList.add("blink");
    setTimeout(() => eyesWrap.classList.remove("blink"), 130);
    setTimeout(blink, 2600 + Math.random() * 3200);
  };
  setTimeout(blink, 2200);
}

/* ---------- role tabs ---------- */
const roleTabs = qa(".role-tabs [data-role]");

roleTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    if (tab.classList.contains("is-active")) return;
    roleTabs.forEach((t) => {
      t.classList.remove("is-active");
      t.setAttribute("aria-selected", "false");
    });
    tab.classList.add("is-active");
    tab.setAttribute("aria-selected", "true");
  });
});

/* ---------- experience filter ---------- */
const expList = q("#expList");
const expCards = expList ? qa(".exp", expList) : [];
const allExpBtn = q("#allExpBtn");

let expExpanded = false;
let expFilter = "all";

function renderExp() {
  const visible = expCards.filter((c) =>
    expFilter === "all" ? true : (c.dataset.tags || "").split(" ").includes(expFilter)
  );

  expCards.forEach((card) => {
    const i = visible.indexOf(card);
    const limit = expExpanded || expFilter !== "all" ? visible.length : 4;
    card.hidden = !(i > -1 && i < limit);
  });

  if (allExpBtn) {
    allExpBtn.hidden = visible.length <= 4;
    allExpBtn.textContent = expExpanded ? "Show Less" : "View All Experience";
  }
}

qa(".filter-chips .chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    qa(".filter-chips .chip").forEach((c) => {
      c.classList.remove("is-active");
      c.setAttribute("aria-selected", "false");
    });
    chip.classList.add("is-active");
    chip.setAttribute("aria-selected", "true");
    expFilter = chip.dataset.filter;
    expExpanded = false;
    renderExp();
  });
});

allExpBtn?.addEventListener("click", () => {
  expExpanded = !expExpanded;
  renderExp();
});

renderExp();

/* ---------- hero entrance ---------- */
const heroBits = [q(".greeting"), q(".display"), q(".role-tabs"), q(".tagline"), q(".btn-meet")];
heroBits.forEach((el, i) => {
  if (!el) return;
  el.style.opacity = "0";
  el.style.transform = "translateY(16px)";
  el.style.transition = `opacity .7s var(--ease) ${i * 80}ms, transform .7s var(--ease) ${i * 80}ms`;
  requestAnimationFrame(() => {
    el.style.opacity = "1";
    el.style.transform = "none";
  });
});

/* ---------- pause marquees when tab hidden ---------- */
const marquees = [q(".bts-track"), q(".ticker-track")].filter(Boolean);
document.addEventListener("visibilitychange", () => {
  marquees.forEach((t) => {
    t.style.animationPlayState = document.hidden ? "paused" : "running";
  });
});

/* ---------- reveal on scroll ---------- */
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      });
    },
    /* threshold 0 so elements taller than the viewport can still trigger */
    { rootMargin: "0px 0px -6% 0px", threshold: 0 }
  );

  qa(".exp, .edu, .cap, .proj, .step, .price, .beyond, .post-card").forEach((el) => {
    el.classList.add("reveal");
    io.observe(el);
  });

  /* fail-safe: anything already on screen after load becomes visible */
  const forceVisible = () => {
    qa(".reveal:not(.in)").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight) el.classList.add("in");
    });
  };
  window.addEventListener("load", () => setTimeout(forceVisible, 400));
} else {
  qa(".reveal").forEach((el) => el.classList.add("in"));
}

/* ---------- in-page anchors ---------- */
qa('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const href = a.getAttribute("href");
    if (!href || href === "#" || href === "#search") return;
    const target = q(href);
    if (!target) return;
    e.preventDefault();
    const y = target.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top: y, behavior: "smooth" });
  });
});
