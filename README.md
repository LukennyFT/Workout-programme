# Weekly Training Programme (PWA)

A 5-day calisthenics + flexibility programme tracker. Toggle between a
**Standard** and a **Deload** week, track each set with tap targets, jot notes
per exercise, and watch session progress fill up. All progress is saved on your
device (via `localStorage`) and the app works offline once loaded.

Built as a **zero-build Progressive Web App** — just static files, no Node /
npm / build step. React is loaded from a CDN and JSX is compiled in the browser.

## Files

| File | Purpose |
|------|---------|
| `index.html` | App shell + iOS install meta tags |
| `app.jsx` | The whole React app |
| `manifest.webmanifest` | PWA manifest (name, icons, colours) |
| `sw.js` | Service worker for offline support |
| `icons/` | App icons (192, 512, apple-touch) |

## Run locally

Because the browser fetches `app.jsx`, you need a tiny local web server
(opening the file directly with `file://` won't work). With Python:

```bash
cd "Workout programme app"
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Add to your iPhone home screen

1. Open the live URL (see below) in **Safari** on your iPhone.
2. Tap the **Share** button (the square with an up-arrow).
3. Scroll down and tap **Add to Home Screen**.
4. Tap **Add**. The app icon now sits on your home screen and opens
   full-screen, like a native app.

> Tip: it must be opened in Safari (not Chrome) for "Add to Home Screen" to
> create a proper standalone app on iOS.
