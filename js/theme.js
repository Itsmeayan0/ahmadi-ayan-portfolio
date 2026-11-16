/* =========================================================
   theme toggle (persisted)
   ========================================================= */

(function () {
  const KEY = "ayan-theme";
  const root = document.documentElement;

  const stored = localStorage.getItem(KEY);
  if (stored === "dark" || stored === "light") {
    root.dataset.theme = stored;
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    root.dataset.theme = "dark";
  } else {
    root.dataset.theme = "light";
  }

  const meta = document.querySelector('meta[name="theme-color"]');
  const sync = () => {
    if (meta) meta.setAttribute("content", root.dataset.theme === "dark" ? "#0d0f17" : "#ffffff");
  };
  sync();

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("#themeBtn");
    if (!btn) return;

    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    localStorage.setItem(KEY, next);
    sync();

    btn.setAttribute(
      "aria-label",
      next === "dark" ? "Switch to light theme" : "Switch to dark theme"
    );
  });
})();
