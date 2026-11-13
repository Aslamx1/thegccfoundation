# Cloudflare Workers deployment

This Next.js app uses the OpenNext Cloudflare adapter. The Worker name matches the existing Cloudflare service: `thegccfoundation`.

## Workers Builds settings

In **Workers & Pages → thegccfoundation → Settings → Builds**, use:

- **Production branch:** `master`
- **Build command:** leave blank
- **Deploy command:** `npm run deploy:cloudflare`
- **Root directory:** `/` (or leave it blank)

The deploy script runs `opennextjs-cloudflare build` and `opennextjs-cloudflare deploy` in the same command. This ensures the generated OpenNext config is present when the Worker is deployed. Do not use `npx wrangler deploy` as the deploy command for this setup, because it can try to deploy OpenNext output without running the OpenNext build first.

## Runtime secrets

In **Settings → Variables & Secrets**, add `OPENAI_API_KEY` as a secret for the assistant API route. You can optionally set `OPENAI_MODEL` as a regular variable. Do not put secret values in this repository. If you add `NEXT_PUBLIC_` variables later, configure them as Workers Builds variables too when the build needs them.

## Local preview or manual deployment

```sh
npm run preview:cloudflare
npm run deploy:cloudflare
```

