# cult.fit Gym Website

A responsive gym website customized for Kozhikode City (Calicut), Kerala, with a Node.js/Express enquiry backend, WhatsApp handoff, scroll animations, and a password-protected admin dashboard. The page is written for men and women.

## Run in VS Code

1. Install **Node.js LTS** on your computer.
2. Open this project folder in VS Code.
3. Open Terminal -> New Terminal.
4. Run:

   ```bash
   npm install
   ```

5. Copy `.env.example` to a new file named `.env`.
6. Edit `.env`:
   - `WHATSAPP_NUMBER`: your WhatsApp number with country code, digits only. Demo placeholder: `911234567890` (not a verified WhatsApp account). Replace it with your real WhatsApp number before using the enquiry feature.
   - `ADMIN_PASSWORD`: choose your own strong admin password.
   - `SESSION_SECRET`: replace with a long random secret.
7. Start the website:

   ```bash
   npm start
   ```

8. Open `http://localhost:3000`.
9. Admin dashboard: `http://localhost:3000/admin`.

## How enquiries work

- The contact form saves each enquiry in `data/enquiries.json`.
- After a successful save, the visitor is offered a WhatsApp chat to the number in `.env`.
- Admin login lets you view, refresh, and delete enquiries.

## Important before publishing online

This starter uses a local JSON file and Express's in-memory session store, suitable for learning and local development. For a public production deployment, use a hosted database (such as PostgreSQL), a persistent session store, HTTPS, backups, and a deployment platform with persistent storage. Do not use the sample admin password on a public website.

## Location and demo details

The site currently displays Kozhikode City, Calicut, Kerala. A street address, actual opening hours, class timings, and membership fees were not supplied, so the page avoids inventing them. The timetable is labelled as a sample.

The WhatsApp number is set to the demo placeholder `+91 1234567890`. It is not verified and may not open a real WhatsApp chat. Replace it in `.env` with a real number before accepting enquiries.

## Brand note

The visible brand is set to `cult.fit` as requested. Use that name/logo only if you are authorized to represent that brand; otherwise replace it with your own gym brand.
