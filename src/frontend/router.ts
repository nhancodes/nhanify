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
  console.log("NHANIFY ROUTE CLICKED");
  if (event.target instanceof HTMLAnchorElement) {
    console.log(event.target.getAttribute("href"));
    const href = event.target.getAttribute("href") ?? "";
    if (href !== "/twitchAuth") event.preventDefault();
    try {
      const href = event.target.getAttribute("href") ?? "";
      const partial = await getPartial(href);
      console.log(document.querySelector("main"));
      document.querySelector("main")!.innerHTML = partial;
    } catch (error) {
      console.error(error);
    }
  }
});
