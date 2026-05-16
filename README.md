# Minorities in STEM Website

Static public website for Minorities in STEM, a student-founded nonprofit founded in 2024 at Woodward Academy.

## Project Structure

```text
.
├── index.html
├── about/
├── contact/
├── donate/
├── get-involved/
├── impact/
├── initiatives/
├── login/
├── resources/
├── assets/
│   ├── images/
│   ├── site.js
│   └── styles.css
├── minorities-in-stem.html
├── package.json
└── server.mjs
```

## Run Locally

Install dependencies if needed:

```bash
npm install
```

Start the local preview server:

```bash
npm start
```

Open:

```text
http://127.0.0.1:4173
```

If port `4173` is already in use, run the server on another port:

```bash
PORT=4174 npm start
```

Then open:

```text
http://127.0.0.1:4174
```

## AI x STEM Hackathon Subdomain

The MISHacks Episode 1 page is available at `/hackathon/`, with `/ai-x-stem-hackathon/` redirecting there.

For a production subdomain such as `hackathon.minoritiesinstem.org`, point the subdomain at the same static host and configure the host to serve `/hackathon/index.html` for that subdomain root. The local preview server also maps hostnames beginning with `hackathon.` or `ai-x-stem-hackathon.` to the hackathon page when the request path is `/`.

## GitHub Pages

This site can be hosted on GitHub Pages because it is static HTML, CSS, JavaScript, and image assets. GitHub Pages will not run `server.mjs`; that file is only for local preview.

For a custom domain like `https://minoritiesinstem.org`, the current root-relative paths such as `/assets/styles.css` and `/about/team` are the right shape.

For a project URL like `https://username.github.io/MIS_website/`, root-relative paths may need to be changed to include the repository base path, or the site should be deployed from a custom domain.

## Main Files

- `index.html`: Homepage.
- `assets/styles.css`: Global styles, responsive layout, dark mode colors, cards, hero image positioning, and page sections.
- `assets/site.js`: Shared navigation, footer, mobile menu, dark mode persistence, dropdown behavior, scroll effects, and counters.
- `assets/images/`: Common image folder for the logo, favicon, hero image, team photos, and chapter photos.
- `server.mjs`: Local static server with clean route support.

## Notes

- Dark mode is saved in `localStorage`, so the selected theme stays active while navigating between pages.
- The homepage hero image is `assets/images/heroimage.avif`.
- The favicon uses `assets/images/favicon.png`.
- Team member photos and linked profiles are configured in the HTML pages.
