/* =========================================================
   resources + resume page behaviour
   ========================================================= */

const resChips = [...document.querySelectorAll(".res-chips .chip")];
const resBlocks = [...document.querySelectorAll("[data-block]")];

if (resChips.length && resBlocks.length) {
  resChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      resChips.forEach((c) => {
        c.classList.remove("is-active");
        c.setAttribute("aria-selected", "false");
      });
      chip.classList.add("is-active");
      chip.setAttribute("aria-selected", "true");

      const key = chip.dataset.res;
      resBlocks.forEach((block) => {
        block.hidden = !(key === "all" || block.dataset.block === key);
      });
    });
  });
}

/* ---------- resume download ---------- */
document.getElementById("resumeDownload")?.addEventListener("click", () => {
  const original = document.body.innerHTML;
  const note = document.createElement("p");
  note.textContent = "Print dialog coming up — save as PDF to keep a copy.";
  note.style.cssText = "font:14px sans-serif;padding:8px 12px;background:#0d0f17;color:#fff;border-radius:8px";
  document.body.prepend(note);
  setTimeout(() => {
    window.print();
    note.remove();
  }, 400);
  void original;
});
