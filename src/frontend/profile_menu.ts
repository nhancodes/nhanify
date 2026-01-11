document.addEventListener("DOMContentLoaded", () => {
  // Toggle clicked profileMenu summary (delegated so it works for many or dynamic menus)
  document.addEventListener("click", (e) => {
    const summary = (e.target as HTMLElement).closest("summary");
    if (!summary) return;
    const details = summary.parentElement as HTMLDetailsElement | null;
    if (!details || !details.classList.contains("profileMenu")) return;

    // prevent native toggle so we can control open/close and close others
    e.preventDefault();
    details.open = !details.open;
  });

  // When any profileMenu is opened, close the others
  document.addEventListener("toggle", (e) => {
    const changed = e.target;
    if (!(changed instanceof HTMLDetailsElement)) return;
    if (!changed.classList.contains("profileMenu")) return;

    if (changed.open) {
      document.querySelectorAll("details.profileMenu[open]").forEach((d) => {
        if (d !== changed) (d as HTMLDetailsElement).open = false;
      });
    }
  });

  // Close open profileMenus on outside mousedown (works well with click toggle)
  document.addEventListener("mousedown", (e) => {
    const target = e.target as Node | null;
    if (!target) return;
    document.querySelectorAll("details.profileMenu[open]").forEach((d) => {
      if (!d.contains(target)) (d as HTMLDetailsElement).open = false;
    });
  });
});
