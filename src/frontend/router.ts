async function getPartial(url: string): Promise<string> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to load partial from ${url}: ${response.statusText}`);
    }
    return await response.text();
}