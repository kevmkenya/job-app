# SmartCV Tailor Web App

A lightweight single-page web application to help job seekers tailor resume content to each job posting.

## Features

- ATS-style keyword match scoring between resume and job description
- Missing/matched keyword extraction
- Tailored resume bullet generation
- Cover letter draft generation
- Interview prep question generation
- Application tracker table (company, role, status, date)
- Session export to JSON
- Built-in sample data loader for demo

## Run locally

```bash
python3 -m http.server 4173
```

Then open: `http://localhost:4173`

## Files

- `index.html` - main UI layout
- `styles.css` - app styling
- `app.js` - front-end logic and generation helpers
