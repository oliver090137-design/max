<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 貓掌櫃 APP

This project has been set up with React, Vite, Tailwind CSS, and Firebase.

## Setup & Running Locally

**Prerequisites:** Node.js v20+

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key (you can copy from `.env.example` if available).
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Access the app at `http://localhost:3000`.

## Deployment

The project is configured for direct deployment via **GitHub Actions**.

- **Workflow File:** `.github/workflows/deploy.yml`
- **Trigger:** Merging or pushing to the `main` branch automatically triggers the deployment to GitHub Pages.
- **Note:** Make sure you have "GitHub Pages" enabled in your repository settings and set it to deploy from GitHub Actions.

## Version Control

An optimal `.gitignore` has been provided which restricts the checking-in of:
- `node_modules/` and `.npm` cache
- Build folders (`dist/`, `build/`)
- Local `.env.*` files (which saves your API keys from leaking)
- Various logs and IDE files (like `.vscode/`)
