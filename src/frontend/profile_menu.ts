document.addEventListener("DOMContentLoaded", () => {
  const profileMenu = document.querySelector(
    ".profileMenu",
  ) as HTMLDetailsElement;
  const profileSummary = profileMenu?.querySelector("summary") as HTMLElement;

  if (profileMenu && profileSummary) {
    // Prevent default toggle to control it manually
    profileSummary.addEventListener("click", (e) => {
      e.preventDefault();
      profileMenu.open = !profileMenu.open;
    });

    // Close on outside click
    document.addEventListener("mousedown", (e) => {
      if (profileMenu.open && !profileMenu.contains(e.target as Node)) {
        profileMenu.open = false;
      }
    });
  }
});
