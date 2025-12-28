# That1ai / Signal OG

That1ai is the front door for the Signal OG agent: a simple landing + flows, backed by a Cloudflare Pages Function that talks to OpenAI. It is built so a non-coder can change pricing, copy, and flows with a few predictable steps.

---

## 1. Files that matter

**Root**

- `index.html` – main landing page
- `report.html` – report screen
- `success.html` – confirmation / success page
- `styles.css` – all shared styling (colors, buttons, layout)
- `script.js` – front-end logic (talks to the Signal OG agent)
- `README.md` – this file

**Backend**

- `functions/reinn-agent.js` – Cloudflare Pages Function endpoint at `/reinn-agent` that calls OpenAI using `OPENAI_API_KEY`.

Cloudflare Pages watches this repo and auto-deploys on every push to `main`.

---

## 2. Operator UX loop (no coding required)

This is the only workflow you need to remember:

1. **Edit**
   - Change text, prices, plans: edit the `.html` file (for example `index.html`).
   - Change colors, button styles: edit `styles.css`.
   - Change agent behavior: edit the prompt inside `functions/reinn-agent.js`.

2. **Save + Commit (Git)**
   - On your laptop:
     - `git add .`
     - `git commit -m "plain English: what you changed"`
     - `git push`
   - Or use the GitHub web editor and click **Commit changes**.

3. **Deploy (Cloudflare Pages)**
   - Cloudflare auto-builds after each push.
   - Check **Workers & Pages → that1ai → Deployments** until the latest deploy is green.

4. **Verify**
   - Site: open the live URL and confirm your copy / layout / buttons changed.
   - Agent: open `/reinn-agent` and confirm it returns JSON.

If all four steps are green, the change is live and working.

---

## 3. Signal OG agent details

### Endpoint

- URL path: `/reinn-agent`
- File: `functions/reinn-agent.js`
- Platform: Cloudflare Pages Functions

### Environment variable

In Cloudflare dashboard for `that1ai`:

- Go to **Settings → Variables and Secrets**.
- There must be a **Secret** named exactly:

  - `OPENAI_API_KEY`

- Value: your real OpenAI API key.

The function reads it as `env.OPENAI_API_KEY` and never exposes it to the browser.

### Basic behavior

- `GET /reinn-agent` → returns a simple JSON “status” message.
- `POST /reinn-agent` with JSON body `{ "message": "..." }` → calls OpenAI and returns the reply in JSON:

