# Cloudflare Workers deployment

This Next.js app is configured for Cloudflare Workers with the OpenNext Cloudflare adapter. The Worker name matches the existing Cloudflare service: `thegccfoundation`.

## Workers Builds settings

In **Workers & Pages → thegccfoundation → Settings → Build**, use:

- **Production branch:** `master`
- **Build command:** `npm run build:cloudflare`
- **Deploy command:** `npx wrangler deploy`
- **Root directory:** `/` (or leave it blank)

Cloudflare will install dependencies from `package-lock.json`. A push to the production branch starts a production build/deployment when Git integration is enabled.

## Runtime secrets

In **Settings → Variables & Secrets**, add `OPENAI_API_KEY` as a secret for the assistant API route. You can optionally set `OPENAI_MODEL` as a regular variable. Do not put secret values in this repository. If you use any `NEXT_PUBLIC_` variables later, set them as **Workers Builds variables** too when the build needs them.

## Local preview or manual deployment

```sh
npm run preview:cloudflare
npm run deploy:cloudflare
```

`npm run deploy:cloudflare` builds the OpenNext worker and deploys it using Wrangler. Cloudflare’s Git-connected build should use the settings above instead.
