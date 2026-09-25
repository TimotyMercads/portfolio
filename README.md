# Timoty Mercado — Portfolio (multi-file structure)

    index.html    → markup only
    style.css     → all styling
    script.js     → all interactivity (scroll reveals, ripple clicks, tilt effect, nav)
    assets/
      avatar.jpg  → profile photo

External dependency: Google Fonts (loaded via <link> tags in index.html's <head> — internet access needed for the fonts to load; everything else is local).

## Deploy to Vercel
1. Go to vercel.com → New Project.
2. Drag this whole folder in, or push it to a GitHub repo first and import that.
3. Framework preset: "Other" (static site, no build step).
4. Deploy — Vercel serves index.html and its relative-path assets automatically.

## Deploy to GitHub Pages (alternative)
1. Push this folder to a repo.
2. Settings → Pages → set source to the branch/root.
3. Live at https://<username>.github.io/<repo>/
