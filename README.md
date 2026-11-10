# PSP Development website

A complete multi-page static website. No build step or server software is needed.

## Pages
- index.html (home), about.html, services.html, contact.html
- 7 service pages: software-development, ai-automation, security-access-control, it-infrastructure, iot-smart-technology, digital-transformation, innovation
- privacy.html, terms.html, 404.html, sitemap.xml, robots.txt

## Before you publish, replace these placeholders
1. Email, phone, address and opening hours: search all .html files for `info@example.com`, `+000 000 000`, `Your business address here`.
   Also update `data-email` on the <html> tag of each page (the contact form sends to this address).
2. Website address: replace `https://www.example.com` in sitemap.xml and robots.txt.
3. Photos: replace the placeholder pictures in assets/img/ (photo-1 to photo-6) with your own.
   If your photos are .jpg, change the file names in index.html (for example photo-1.svg to photo-1.jpg).
4. Logo: assets/logo.svg and assets/favicon.svg.
5. Privacy Policy and Terms of Service are short templates. Have them reviewed before launch.

## How to put it online
Upload the whole folder to any web host (for example cPanel, Netlify, GitHub Pages) so that index.html is in the root.
The contact form opens the visitor's email app. For a form that sends automatically, connect it to a form service.

## Folders
css/style.css (design), js/main.js (menu, 3D effects, page transitions), js/three.min.js (3D library), assets/ (video, logo, images)
