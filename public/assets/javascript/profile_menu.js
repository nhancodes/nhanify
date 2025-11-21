document.addEventListener("DOMContentLoaded", () => {
  const profileMenu = document.querySelector(".profileMenu");
  const profileSummary = profileMenu?.querySelector("summary");
  if (profileMenu && profileSummary) {
    // Prevent default toggle to control it manually
    profileSummary.addEventListener("click", (e) => {
      e.preventDefault();
      profileMenu.open = !profileMenu.open;
    });
    // Close on outside click
    document.addEventListener("mousedown", (e) => {
      if (profileMenu.open && !profileMenu.contains(e.target)) {
        profileMenu.open = false;
      }
    });
  }
});
//# sourceMappingURL=profile_menu.js.map
