/* =========================================================
   Ahmadi Ayan clone — interactions
   ========================================================= */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* ---------- header shadow on scroll ---------- */
const hdr = $("#hdr");
const onScroll = () => hdr.classList.toggle("is-scrolled", window.scrollY > 6);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

/* ---------- toast ---------- */
let toastTimer;
function toast(msg) {
  const el = $("#toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 1800);
}

/* ---------- menu ---------- */
const menuBtn = $("#menuBtn");
const menuPanel = $("#menuPanel");
const scrim = $("#scrim");
const searchBtn = $("#searchBtn");
const searchSheet = $("#searchSheet");

function closeAll() {
  menuPanel?.classList.remove("is-open");
  searchSheet?.classList.remove("is-open");
  scrim?.classList.remove("is-open");
  menuBtn?.setAttribute("aria-expanded", "false");
  searchBtn?.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
  setTimeout(() => {
    if (!menuPanel?.classList.contains("is-open")) menuPanel.hidden = true;
    if (!searchSheet?.classList.contains("is-open")) searchSheet.hidden = true;
    if (!menuPanel?.classList.contains("is-open") && !searchSheet?.classList.contains("is-open")) scrim.hidden = true;
  }, 280);
}

function openPanel(panel, btn) {
  const alreadyOpen = panel.classList.contains("is-open");
  closeAll();
  if (alreadyOpen) return;

  panel.hidden = false;
  scrim.hidden = false;
  requestAnimationFrame(() => {
    panel.classList.add("is-open");
    scrim.classList.add("is-open");
  });
  btn?.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
}

menuBtn?.addEventListener("click", () => openPanel(menuPanel, menuBtn));
searchBtn?.addEventListener("click", () => {
  openPanel(searchSheet, searchBtn);
  setTimeout(() => $("#sheetInput")?.focus({ preventScroll: true }), 320);
});
scrim?.addEventListener("click", closeAll);
$("#sheetClose")?.addEventListener("click", closeAll);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeAll();
});

/* menu links close the panel */
$$(".menu-link").forEach((el) => {
  if (el.id === "accBtn") return;

  el.addEventListener("click", (e) => {
    const href = el.getAttribute("href") || "";

    if (href === "#search") {
      e.preventDefault();
      closeAll();
      setTimeout(() => {
        openPanel(searchSheet, searchBtn);
        setTimeout(() => $("#sheetInput")?.focus({ preventScroll: true }), 320);
      }, 200);
      return;
    }

    if (href.startsWith("#")) e.preventDefault();
    setTimeout(closeAll, 120);
  });
});

/* ---------- resources accordion ---------- */
const accBtn = $("#accBtn");
const accBody = $("#accBody");
accBtn?.addEventListener("click", () => {
  const open = accBtn.getAttribute("aria-expanded") === "true";
  accBtn.setAttribute("aria-expanded", String(!open));
  accBody.hidden = open;
});

/* ---------- category filter + search ---------- */
const cards = $$("#postList .post-card");
const empty = $("#empty");
let activeCat = "all";

function applyFilters() {
  const q = ($("#pageSearch")?.value || "").trim().toLowerCase();
  let shown = 0;

  cards.forEach((card) => {
    const cat = card.dataset.cat || "";
    const hay = `${card.dataset.title || ""} ${card.textContent}`.toLowerCase();
    const catOk = activeCat === "all" || cat.split(" ").includes(activeCat);
    const qOk = !q || hay.includes(q);
    const show = catOk && qOk;
    card.hidden = !show;
    if (show) shown++;
  });

  if (empty) empty.hidden = shown > 0;
}

$$(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    $$(".chip").forEach((c) => {
      c.classList.remove("is-active");
      c.setAttribute("aria-selected", "false");
    });
    chip.classList.add("is-active");
    chip.setAttribute("aria-selected", "true");
    activeCat = chip.dataset.cat;
    applyFilters();
  });
});

$("#pageSearch")?.addEventListener("input", applyFilters);

/* ---------- copy email ---------- */
const EMAIL = "hello@ahmadiayan.com";

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(EMAIL);
    toast("Email copied — " + EMAIL);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = EMAIL;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch {}
    ta.remove();
    toast("Email copied — " + EMAIL);
  }
}

$("#copyEmail")?.addEventListener("click", copyEmail);
$("#copyAction")?.addEventListener("click", (e) => {
  e.preventDefault();
  copyEmail();
  closeAll();
});

/* ---------- search sheet filtering ---------- */
$("#sheetInput")?.addEventListener("input", (e) => {
  const q = e.target.value.trim().toLowerCase();
  const list = $("#sheetResults");
  if (!list) return;
  const items = $$("li", list);
  items.forEach((li) => {
    li.hidden = q && !li.textContent.toLowerCase().includes(q);
  });
});

/* ---------- floating chat ---------- */
$("#fab")?.addEventListener("click", () => {
  toast("Hi! Say hello at " + EMAIL);
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

  $$(".post-card, .sec-title, .foot-card h2").forEach((el) => {
    el.classList.add("reveal");
    io.observe(el);
  });

  /* fail-safe: anything already on screen after load becomes visible */
  window.addEventListener("load", () => {
    setTimeout(() => {
      $$(".reveal:not(.in)").forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("in");
      });
    }, 400);
  });
} else {
  $$(".reveal").forEach((el) => el.classList.add("in"));
}

/* ---------- pause ticker when tab hidden ---------- */
const track = $(".ticker-track");
if (track) {
  document.addEventListener("visibilitychange", () => {
    track.style.animationPlayState = document.hidden ? "paused" : "running";
  });
}
