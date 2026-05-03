# Minorities in STEM Website Handoff TODO

This file is for the next person continuing the site work.

## Current Status

- The local preview command is `npm start`.
- The local site normally runs at `http://127.0.0.1:4173`.
- `server.mjs` is only for local preview. GitHub Pages will not run it.
- This is a static HTML/CSS/JS site, so GitHub Pages can host it.
- The forms currently do not send email. They only show fake success messages.

## Recent Changes Already Made

- Homepage momentum stats were updated:
  - `index.html`: `20+` chapters and `300+` volunteers.
  - `minorities-in-stem.html`: animated hero counters now count to `20+` and `300+`.
- Podcasts page was updated:
  - `resources/podcasts/index.html` now includes the Spotify show embed.
  - It also includes four Spotify episode embeds and direct episode links.
  - `assets/styles.css` includes responsive Spotify and episode card styling.
- Community Inclusivity page was updated:
  - `initiatives/community-inclusivity/index.html` now says `AI x STEM Impact Fest Hackathon - Coming soon`.
  - The three old program cards were removed.
  - A poster-style hackathon graphic was added.
  - `assets/styles.css` includes `.hackathon-graphic` styling.
- There was already an untracked `todo.md`; this file replaces it as the handoff document.

## Priority 1: Make Email/Form Sending Real

Right now, all forms with `data-enhanced-form` are intercepted in `assets/site.js`:

```js
event.preventDefault();
form.reset();
note.textContent = form.dataset.success || "Thank you. Your submission has been received.";
```

That means no email is sent, no data is saved, and there is no backend request.

Recommended simple option: Formspree.

1. Create a Formspree account.
2. Create separate forms for:
   - Contact page
   - Start chapter page
   - Donate interest page
   - Newsletter signup
3. Copy each Formspree endpoint.
4. Update these files:
   - `contact/index.html`
   - `get-involved/start-chapter/index.html`
   - `donate/index.html`
   - Newsletter form rendered inside `assets/site.js`
5. Change forms from this pattern:

```html
<form class="contact-card form-grid" data-enhanced-form data-success="...">
```

to this pattern:

```html
<form class="contact-card form-grid" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

6. Keep all `name` attributes on inputs and textareas. Formspree uses those field names in the email.
7. Decide what to do with `assets/site.js` form enhancement:
   - Easiest: remove `data-enhanced-form` from real email forms so browser POST works normally.
   - Better UX: rewrite `setupForms()` to submit with `fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })`, then show the success/failure note.
8. Do not put SMTP passwords, private keys, or email account passwords in frontend code.

Alternative option: EmailJS.

- Use EmailJS only if the site owner wants emails sent from frontend JS.
- It requires a public key, service ID, and template ID.
- It still should not expose real SMTP passwords.

Manual email links that already exist:

- `minorities-in-stem.html` has `mailto:hello@minoritiesinstem.org` links.
- These open the visitor's email app, but they are not the same as form sending.

## Priority 2: Set Up the Email Inbox

If using `hello@minoritiesinstem.org`, set up mailbox hosting separately from the website.

Options:

- Google Workspace
- Zoho Mail
- Wix Business Email
- Another email provider

In Wix DNS, keep or add the email provider's required records:

- MX records for receiving mail
- SPF TXT record
- DKIM TXT/CNAME records
- DMARC TXT record if provided

Do not delete email DNS records when pointing the website to GitHub Pages.

## Priority 3: Deploy on GitHub Pages

1. Push the project to a GitHub repo.
2. In GitHub, go to repo Settings -> Pages.
3. Source: `Deploy from a branch`.
4. Branch: `main`.
5. Folder: `/root`.
6. Save.
7. Confirm the generated GitHub Pages URL works.

Important:

- Because this site uses root-relative paths like `/assets/styles.css`, it is best deployed with a custom domain.
- If deploying only at `https://username.github.io/repo-name/`, root-relative paths may break unless the site is adjusted.

## Priority 4: Connect the Wix Domain to GitHub Pages

Assuming the domain is `minoritiesinstem.org`. If the actual domain is different, replace it below.

Add a root-level file named `CNAME` with exactly:

```text
minoritiesinstem.org
```

In GitHub Pages settings, add the custom domain:

```text
minoritiesinstem.org
```

In Wix DNS, set these website records.

For the apex/root domain:

```text
A    @    185.199.108.153
A    @    185.199.109.153
A    @    185.199.110.153
A    @    185.199.111.153
```

For `www`:

```text
CNAME    www    YOUR_GITHUB_USERNAME.github.io
```

After DNS verifies in GitHub Pages:

- Enable `Enforce HTTPS`.
- Test both:
  - `https://minoritiesinstem.org`
  - `https://www.minoritiesinstem.org`

Optional but recommended:

- In GitHub Pages custom domain settings, choose whether the canonical domain should be root or `www`.
- If Wix has forwarding rules, avoid duplicate/conflicting redirects.

## Priority 5: Verify Before Handing Back

Run locally:

```bash
npm start
```

Open:

```text
http://127.0.0.1:4173
```

Check these pages:

- `/`
- `/resources/podcasts`
- `/initiatives/community-inclusivity`
- `/contact`
- `/get-involved/start-chapter`
- `/donate`

Verify:

- Homepage shows `20+` chapters and `300+` volunteers.
- Podcast page shows the Spotify show embed plus four episode embeds.
- Hackathon section has one graphic and no old three cards.
- Contact/start chapter/donate/newsletter forms send real emails after Formspree or EmailJS is connected.
- Forms show a useful success and failure message.
- The custom domain loads over HTTPS after GitHub Pages DNS verification.

## Files Most Likely to Edit Next

- `assets/site.js`: form submission behavior and newsletter form markup.
- `contact/index.html`: contact form endpoint.
- `get-involved/start-chapter/index.html`: chapter interest form endpoint.
- `donate/index.html`: donation interest form endpoint.
- `CNAME`: custom domain for GitHub Pages.
- `README.md`: add final deployment and form setup notes after implementation.

## Useful References

- GitHub Pages custom domains: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
- Wix DNS records: https://support.wix.com/en/article/managing-dns-records-in-your-wix-account
- Formspree HTML forms: https://formspree.io/html/
