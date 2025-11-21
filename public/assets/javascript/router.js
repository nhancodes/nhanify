async function getPartial(url) {
  const options = {
    headers: {
      "Content-Type": "text/html",
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
document
  .getElementById("nhanify-route")
  ?.addEventListener("click", async () => {
    console.log("NHANIFY ROUTE CLICKED");
    try {
      const partial = await getPartial("/home");
      document.querySelector("main").innerHTML = partial;
    } catch (error) {
      console.error(error);
    }
  });
//# sourceMappingURL=router.js.map
