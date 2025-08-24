# Rishab Jain — Portfolio (Static Site)

A clean, responsive, *ready-to-host* portfolio website. No build tools required — just upload the folder to Netlify, Vercel (static), GitHub Pages, or any static host.

## Features
- Modern design, dark/light mode toggle
- Projects grid powered by `content/projects.json`
- About section loaded from `content/about.md` (paste your LinkedIn summary here)
- Contact form that sends email **without exposing your email** using EmailJS
- No framework build step — plain HTML/CSS/JS

## Quick Start
1. Edit your content:
   - `content/about.md` — paste your LinkedIn “About” summary
   - `content/projects.json` — update projects, links, images
2. Configure email sending (no email exposed to visitors):
   - Create an account at https://www.emailjs.com/
   - Add an Email Service connected to your inbox
   - Create a Template with variables: `from_name`, `reply_to`, `message`
   - Get your **Public Key**, **Service ID**, **Template ID**
   - Open `script.js` and replace placeholders:
     ```js
     const EMAILJS_PUBLIC_KEY = "pk_xxxxx";
     const EMAILJS_SERVICE_ID = "service_xxx";
     const EMAILJS_TEMPLATE_ID = "template_xxx";
     ```
   - That’s it. Your destination email is configured inside EmailJS, so your address is not visible on the site.
3. Host it:
   - Upload the whole folder to Netlify / Vercel / GitHub Pages
   - Ensure all files keep the same paths

## Customize
- Replace `assets/cover-placeholder.jpg` with your own images (keep the filename or update `projects.json`).
- Update colors in `styles.css` CSS variables if you like.
- Swap the LinkedIn URL in `index.html` if needed.

## Privacy
- No analytics or tracking by default.
- EmailJS uses a public key to send messages; your private inbox address remains hidden from users.

## License
MIT — do anything, but please keep a credit link or star if you find it helpful.
