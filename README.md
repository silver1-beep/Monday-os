# Monday OS — Deploy in ~10 minutes

## What's here
- `index.html` — the whole frontend. Voice in/out, wake word ("Monday"), chat,
  persistent memory (localStorage), owner profile, and a Self-Update panel.
- `api/chat.js` — serverless function holding your Anthropic API key.
- `api/self-update.js` — lets Monday propose changes to her own `index.html`,
  which you approve before they're committed to GitHub (triggers auto-redeploy).

## Self-Update setup (extra env vars)
This feature needs Monday to be able to write to your GitHub repo, so it
needs one more credential beyond the Anthropic key:

1. On GitHub: Settings → Developer settings → Personal access tokens →
   Fine-grained tokens → Generate new token.
   - Repository access: only this repo.
   - Permissions: Contents → Read and write.
2. In Vercel, add two more Environment Variables:
   - `GITHUB_TOKEN` = the token you just made
   - `GITHUB_REPO` = `yourusername/your-repo-name`
   - (optional) `GITHUB_BRANCH` = `main` if your default branch is named differently
3. Redeploy.

How it works in the app: type an instruction in the Self-Update box (e.g.
"add a dark/light toggle"), tap Propose. Monday drafts the full updated file
and shows you a line-diff summary. Nothing changes until you tap Apply — that
commits to GitHub, which triggers Vercel to redeploy automatically. Reload the
page after ~30-60s to see it live.

Scope is intentionally locked to `index.html` only for now — `api/chat.js`
and `api/self-update.js` itself are not editable by Monday, so she can't
revoke her own safety rails or change how the approval flow works.


## Steps (from your phone or laptop)

1. Get an Anthropic API key from console.anthropic.com if you don't have one.

2. Push this folder to a new GitHub repo (or skip GitHub and use Vercel CLI
   directly — see option B below).

### Option A — GitHub + Vercel dashboard (easiest on mobile)
   - Create a new repo, upload these 3 files (`index.html`, `api/chat.js`,
     `package.json`) keeping the same folder structure.
   - Go to vercel.com → New Project → Import your repo.
   - Before deploying, add an Environment Variable:
       Key:   ANTHROPIC_API_KEY
       Value: your key
   - Click Deploy. You'll get a live URL like monday-os.vercel.app in ~60 seconds.

### Option B — Vercel CLI (if you have terminal access)
   ```
   npm i -g vercel
   cd monday-os
   vercel
   vercel env add ANTHROPIC_API_KEY
   vercel --prod
   ```

3. Open the URL on your phone. Tap "Add to Home Screen" for a quasi-app feel
   (manifest is already embedded in index.html).

4. Tap the orb (or say "Monday, …") and start talking.

## Notes for your setup
- Voice recognition uses the browser's Web Speech API — works in Chrome on
  Android, has gaps on iOS Safari. If voice input doesn't fire, the text box
  always works as a fallback.
- Memory is currently localStorage only (per-device, not synced). Firebase
  sync is a Sprint 2 upgrade per your project plan — don't add it tonight,
  it'll eat your two hours.
- If a request fails with "ANTHROPIC_API_KEY is not set," you deployed before
  adding the env var — add it in Vercel → Settings → Environment Variables
  and redeploy.
