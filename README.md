# Fraction Simplifier

Create React App (react-scripts 5) + React 19: users enter a numerator/denominator; the app reduces the fraction via GCD and shows an equivalent simplified form. Main behavior is in `components/FractionSimplifier.jsx`.

**Live site:** [https://content-interactives.github.io/fraction_simplifier](https://content-interactives.github.io/fraction_simplifier)

Curriculum alignment and placement: [Standards.md](Standards.md).

> **Note:** `package.json` sets `homepage` for a user/org Pages URL; align `homepage` and hosting with the canonical deploy target before release.

---

## Stack

| Layer | Notes |
|--------|--------|
| Build | react-scripts 5 (`react-scripts build`) |
| UI | React 19 |
| Styling | Tailwind 3, PostCSS |
| Icons | lucide-react |
| Test | Testing Library (Jest via CRA) |
| Deploy | `gh-pages -d build`; `predeploy` runs `npm run build` |

---

## Layout

```
package.json            # homepage → GitHub Pages base path
public/index.html
src/
  index.js → App.js → components/FractionSimplifier.jsx
  index.css             # Tailwind entry
```

---

## Scripts

| Command | Purpose |
|---------|---------|
| `npm start` | Dev server (port 3000) |
| `npm run build` | Production build → `build/` |
| `npm test` | Jest / Testing Library |
| `npm run deploy` | Build and publish `build/` to `gh-pages` |

---

## Embedding

CRA emits static assets under the `homepage` path; use the built `index.html` load height from `FractionSimplifier.jsx` for iframe sizing.
