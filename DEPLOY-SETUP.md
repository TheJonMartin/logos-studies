# One-time setup: make studies go live on their own

Right now: deploys are a manual upload from this Mac.
After this: `git push` puts a study live in about a minute.

Do these three steps once. You never do them again.

---

## Step 1 — Create the repo (browser)

1. Go to **github.com/new**
2. **Repository name:** `logos-study-app`
3. Click **Private**
4. Leave every checkbox alone — do NOT add a README, .gitignore, or license
5. Click **Create repository**

You'll land on a page with setup commands. Ignore all of it except the
repo URL at the top. It looks like:

    https://github.com/YOURNAME/logos-study-app.git

---

## Step 2 — Send your work to it (Terminal)

Open Terminal and paste these two lines, one at a time.
Replace YOURNAME with your actual GitHub username.

    cd ~/Documents/Claude/Projects/Logos
    git remote add origin https://github.com/YOURNAME/logos-study-app.git
    git push -u origin main

**If it asks for a username and password:** GitHub stopped accepting
passwords. Easiest fix — install GitHub CLI and sign in once:

    brew install gh
    gh auth login

Then run the `git push -u origin main` line again.

**What you should see:** a few lines ending in something like
`* [new branch] main -> main`. That's it. All 229 studies are now
backed up off this machine.

---

## Step 3 — Point Netlify at the repo (browser)

1. Go to **app.netlify.com**
2. Open the **audhd-bible** site
3. Left sidebar: **Site configuration**
4. Click **Build & deploy**
5. Under "Continuous deployment", click **Link repository** (or
   "Manage repository")
6. Choose **GitHub**, authorize if asked, pick `logos-study-app`
7. Confirm these three settings, then save:

   | Field | Value |
   |---|---|
   | Branch to deploy | `main` |
   | Build command | `node scripts/build-seo.js` |
   | Publish directory | `dist` |

Netlify will start a build immediately. When it finishes, all 98
pending studies are live.

---

## Done. What changes for you

- **You no longer run `netlify deploy`.** Ignore that command from now on.
- Finishing a study ends with one line:

      git push

- Netlify sees the push, runs the build (~1 second), and the study is live.
- Every study is now version-controlled and backed up off this Mac.

## If a deploy ever looks wrong

Netlify's build log is at app.netlify.com -> audhd-bible -> Deploys.
Click the most recent one and read the log. The build prints a line like:

    build-seo: wrote dist/index.html, 229 study pages at /studies/<id>/, ...

If that number doesn't match the studies you expect, the push went up
with the wrong content — not a Netlify problem.
