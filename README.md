# uNRealCoder.github.io

My personal website — [unrealcoder.github.io](https://unrealcoder.github.io/)

Static site. No framework, no dependencies to install. The only build step is
regenerating the résumé PDF (see below), and only when the résumé changes.

| Path                        | What it is                                                                              |
| --------------------------- | -------------------------------------------------------------------------------------- |
| `index.html`                | All site content — hero, about, experience, skills, education, certifications, writing, contact |
| `style.css`                 | Everything visual. Design tokens live in `:root` at the top; dark palette follows       |
| `main.js`                   | Theme toggle, nav, scroll reveal, ambient serving log, runtime email assembly           |
| `resume.html`               | Print-first résumé — the source the public PDF is generated from (`noindex`)            |
| `Nikhil-Ranjan-Resume.pdf`  | Public résumé, linked from the site. Sanitized: no phone number, no internal figures    |
| `profile-pic.jpg`           | Portrait                                                                                |
| `docs/`                     | Local only (git-ignored) — the full private résumé and anything else not for the site   |
| `.docs/`                    | Local only (git-ignored) — briefs, review notes, drafts                                 |

## Running it locally

```sh
python -m http.server 8000
```

Then open <http://localhost:8000>. Opening `index.html` directly via `file://` works too.

## Regenerating the résumé PDF

Edit `resume.html`, then render it with headless Edge (or Chrome):

```sh
msedge --headless=new --no-pdf-header-footer \
  --print-to-pdf="Nikhil-Ranjan-Resume.pdf" \
  http://localhost:8000/resume.html
```

Keep it to one page. The public PDF must not contain the phone number or the
"$100M" fraud figure — those stay in the private copy under `docs/` only.

## Editing

- **Content** is all in `index.html` and stated once — the experience timeline and
  cards reflow for mobile with CSS, so there is no second copy to keep in sync.
  The résumé (`resume.html`) is a separate document and does need a manual sync
  when experience changes.
- **Colours, spacing, fonts** are CSS custom properties at the top of `style.css`.
  The light palette is the bare `:root`; the dark palette is redefined under
  `:root[data-theme="dark"]` and under `@media (prefers-color-scheme: dark)`.
  Text tokens stay close to pure black / pure white — no washed-out greys.
- **Theme** follows the operating system by default. The button in the nav sets an
  explicit `data-theme` on `<html>` and remembers the choice in `localStorage`
  (key `theme`). A small inline script in `<head>` applies it before first paint.
- **The email address** is not in the HTML source. `index.html` holds
  `data-obf="user|domain"` and `main.js` joins the halves at runtime, so scrapers
  reading the raw HTML get the decoy in `.honeypot` instead.
- **Skill areas** are always listed in the order LLMs → RAG → graph ML → GNN.
