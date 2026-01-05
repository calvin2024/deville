# Jon DeVille Campaign Website (Preview)

This is a **static** website (no build step) designed for **GitHub Pages** preview and feedback.

## What’s included
- Modern, responsive redesign
- Content pulled from the archived first-term site (biography, endorsements, testimonials, letter)
- A **First‑Term Focus** section with placeholders (swap in verified results/metrics)

## How to preview locally
Just open `index.html` in your browser, or run a simple web server:

```bash
python -m http.server 8000
```

Then browse to: http://localhost:8000

## Volunteer form
The volunteer form uses a **mailto:** placeholder for preview.

To make it real, replace the form handler in:
- `assets/js/main.js` (`const to = 'campaign@example.com';`)

Or wire it to a form backend (Formspree / Netlify Forms / your own server).

## Quick content edits
All content is in `index.html`. Search for:
- **First‑Term Focus** (placeholders)
- **campaign@example.com** (form placeholder)
- **Footer disclaimer** (update legal language)

## Notes
Before publishing a production campaign site, confirm:
- FPPC / committee disclaimer language
- Up-to-date endorsement approvals and photos
- Verified first-term accomplishments and statistics
