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

In **Settings → Variables & Secrets**, add `OPENAI_API_KEY` as a secret for the assistant API route and `JWT_SECRET` as a secret containing at least 32 random characters. You can optionally set `OPENAI_MODEL` as a regular variable. Do not put secret values in this repository. If you add `NEXT_PUBLIC_` variables later, configure them as Workers Builds variables too when the build needs them.

## PostgreSQL setup for accounts

The app uses PostgreSQL. Cloudflare Hyperdrive connects the Worker to an existing PostgreSQL database; it does not create one. Use any PostgreSQL provider supported by Hyperdrive and follow Cloudflare's [provider setup guides](https://developers.cloudflare.com/hyperdrive/examples/connect-to-postgres/postgres-database-providers/).

1. Create a PostgreSQL project with your database provider.
2. Add `DATABASE_URL` to your ignored `.env.local` file using the provider's direct (non-pooled) connection string. Do not commit or share this URL.
3. Run `npm run db:migrate` once to create the app's tables. The initial schema is in `drizzle/0000_init.sql`; future schema edits use `npm run db:generate` followed by `npm run db:migrate`.
4. Create a Hyperdrive config in Cloudflare using the provider connection string. Update the `HYPERDRIVE` ID in `wrangler.jsonc` with the ID Cloudflare returns. Keep the database URL private.
5. Deploy with `npm run deploy:cloudflare` after the Hyperdrive ID is valid.

## Website and email security

The app middleware adds a per-request nonce Content Security Policy, HSTS, and other browser security headers. Keep Cloudflare SSL/TLS set to **Full (strict)** and enable HTTPS redirects. Configure HSTS at the Cloudflare zone edge as well so static assets and edge-generated error responses receive it. The `preload` directive is present; submit the domain to the browser preload list only after confirming every subdomain supports HTTPS.

`public/.well-known/security.txt` publishes the GCC support phone as the vulnerability contact. Email protections (MX/SMTP TLS, SPF, DKIM, DMARC, MTA-STS, and TLS reporting) require an actual mail provider, its published sending records, and a monitored reporting mailbox. Configure these at the DNS provider after selecting that service; do not publish guessed MX, SPF, DKIM, or reporting values.

## Local preview or manual deployment

```sh
npm run preview:cloudflare
npm run deploy:cloudflare
```

