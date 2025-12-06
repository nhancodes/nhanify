async function getPartial(url: string): Promise<string> {
  const options = {
    headers: {
      "Content-Type": "text/html",
      "X-Partial": "Partial",
    },
  };
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(
      `Failed to load partial from ${url}: ${response.statusText}`,
    );
  }
  return await response.text();
}

window.addEventListener("click", async (event) => {
  const target = event.target as Element | null;
  if (!target) return;
  if (target.id == "signout-form") {
    event.preventDefault();
    try {
      await fetch("/signout", {
        method: "POST",
        headers: {
          "Content-Type": "text/html",
          "X-Partial": "Partial" /* add CSRF token header here */,
        },
        body: JSON.stringify({}),
      });
      window.location.href = "/signin"; // or handle UI update
    } catch (error) {
      console.error(error);
    }
    return;
  }
  const href = target.getAttribute("href") ?? "";
  if (event.target instanceof HTMLAnchorElement) {
    if (href !== "/twitchAuth") event.preventDefault();
    try {
      const partial = await getPartial(href);
      document.querySelector("main")!.innerHTML = partial;
    } catch (error) {
      console.error(error);
    }
  }
});
