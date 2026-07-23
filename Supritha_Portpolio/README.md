# Supritha K A - Data Analyst Portfolio Website

A premium, highly animated, and interactive personal portfolio website custom-built for **Supritha K A**, Data Analyst. 

This website features custom physics-based cursor trails, dynamic data node particle backgrounds, a passcode-protected admin document portal, and a live visitor analytics engine that tracks recruiter engagement.

## 🚀 Technologies Used
* **HTML5**: Semantic structured layout.
* **Vanilla CSS**: Custom styling tokens, layout grids, and 3D butterfly wing-fluttering animations.
* **Vanilla JavaScript**: Animation physics, typewriter taglines, local metrics recording, and base64 file management.
* **Lucide Icons**: High-quality vector iconography loaded via CDN.
* **Google Fonts**: Modern typography (Outfit for headers, Inter for body).

---

## ✨ Key Features
1. **🦋 Animated Butterfly Cursor**: Follows mouse coordinates with easing (lerp), tilting dynamically in the direction of velocity. Renders a trailing system of glowing data spark points and speeds up fluttering on interactive hover states.
2. **📊 Recruiter Insights Dashboard**: Records visitor clicks (CTAs, project openings, certificates clicked, contact forms, theme toggling) in local storage. Displays interactive statistics, a scrollable event console, and a live SVG bar chart.
3. **🔐 Secure Admin Console**: Click the lock icon in the navbar or project footer and enter passcode `supritha485` to access. You can upload a PDF resume or a new profile image. Document assets are stored securely as base64 strings in local storage and instantly synchronize across the UI. You can also modify text fields like Name, Title, Email, and Location in-browser.
4. **🌓 Theme Switcher**: Toggle between slate-light and deep-charcoal dark modes instantly, saving preferences to local storage.

---

## 💻 Running Locally in VS Code
The website is completely serverless and lightweight. You can run it directly in any modern browser.

1. Open the project folder in **Visual Studio Code**.
2. If you don't have it installed, add the **Live Server** extension (by Ritwick Dey) from the extension store.
3. Open `index.html`, then click **Go Live** in the bottom-right corner of the VS Code window.
4. The page will load automatically at `http://127.0.0.1:5500/index.html` with hot-reloading active.

---

## ☁️ Deploying to Vercel

You can deploy this folder directly to Vercel for free hosting with global CDN.

### Option 1: Vercel CLI (Command Line)
1. Open terminal inside the project directory:
   ```bash
   npx vercel
   ```
2. Log in to your Vercel account when prompted (via Email, GitHub, or GitLab).
3. Follow the CLI configuration steps:
   - *Set up and deploy?* Yes (`y`)
   - *Which scope?* (Select your user profile)
   - *Link to existing project?* No (`n`)
   - *What name?* `supritha-portfolio`
   - *In which directory?* `./`
   - *Modify settings?* No (`n`)
4. Vercel will immediately deploy and output a live preview URL!

### Option 2: GitHub Integration (Recommended)
1. Push this folder to a new repository on your GitHub account (`https://github.com/Supritha485`).
2. Go to [vercel.com](https://vercel.com) and log in using your GitHub account.
3. Click **Add New** > **Project**.
4. Import your repository `Supritha_Portpolio`.
5. Keep default settings and click **Deploy**. Vercel will set up automatic deployments: every time you push code changes to GitHub, Vercel will rebuild and update your live site!
