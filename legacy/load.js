// Loads the archived program on demand (index.html?legacy=1). Babel is only fetched in this case.
export async function loadLegacy() {
  await new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://unpkg.com/@babel/standalone@7/babel.min.js';
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
  const src = await (await fetch(new URL('./legacy-program.jsx', import.meta.url))).text();
  const code = /** @type {any} */ (window).Babel.transform(src, { presets: ['react'] }).code;
  const s = document.createElement('script');
  s.textContent = code;
  document.body.appendChild(s);
}
