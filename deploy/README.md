# Deployment: GitHub Actions -> SSH -> PM2

The app builds on the GitHub runner and ships a self-contained
[standalone](https://nextjs.org/docs/pages/api-reference/next-config-js/output)
bundle to the server over SSH. PM2 runs it. All config lives in GitHub Actions
secrets - nothing sensitive is committed.

## Flow (`.github/workflows/deploy.yml`)

1. `npm ci` + `npm run build` on the runner, with app env injected from secrets
   (NEXT_PUBLIC_* get inlined here; Sentry source maps upload via `SENTRY_AUTH_TOKEN`).
2. Copy `.next/static` and `public` into `.next/standalone/` (standalone omits them).
3. `rsync --delete` the bundle to `$DEPLOY_PATH/current/`.
4. Write `$DEPLOY_PATH/.env` from secrets, then `pm2 startOrReload` (zero-downtime).

Triggers on push to `zf-ai-labs` and manual `workflow_dispatch`. Change the branch
in the workflow's `on.push.branches` if you deploy from a different branch.

## Required GitHub secrets

Set under **Settings -> Secrets and variables -> Actions**.

### SSH / target
| Secret | Example | Notes |
| --- | --- | --- |
| `SSH_HOST` | `203.0.113.10` | Server hostname or IP |
| `SSH_USER` | `deploy` | SSH user |
| `SSH_PORT` | `22` | Optional, defaults to 22 |
| `SSH_PRIVATE_KEY` | *(full private key)* | Deploy key, no passphrase. Public half in the server's `~/.ssh/authorized_keys` |
| `SSH_KNOWN_HOSTS` | *(output of `ssh-keyscan host`)* | Optional but recommended; pins the host key. If unset, the runner trusts on first connect |
| `DEPLOY_PATH` | `/var/www/k2space` | App root on the server |
| `PM2_APP_NAME` | `zfailabs` | Must match `name` in `ecosystem.config.js` |

### App env (build-time + runtime)
`WORDPRESS_API_URL`, `WORDPRESS_AUTH_REFRESH_TOKEN`, `WORDPRESS_PREVIEW_SECRET`,
`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, `NEXT_PUBLIC_MEDIA_URL`, `NEXT_PUBLIC_IMGIX_URL`,
`NEXT_PUBLIC_FRONTEND_URL`, `NEXT_PUBLIC_BACKEND_URL`, `NEXT_PUBLIC_GTM_ID`,
`NEXT_PUBLIC_SENTRY_DSN`, `NEXT_PUBLIC_ENV`, and `SENTRY_AUTH_TOKEN`
(for source-map upload; from Sentry -> Settings -> Auth Tokens).

## One-time server setup

The server already has Node 22 + PM2. Do this once to switch the app to the
standalone layout:

```bash
# 1. Create the app root and copy the PM2 config up (from your machine):
ssh deploy@SERVER "mkdir -p /var/www/k2space"
scp deploy/ecosystem.config.js deploy@SERVER:/var/www/k2space/

# 2. If an old PM2 app runs `next start`, remove it so the new one can take over.
#    Use whatever the OLD app is currently named (check with `pm2 list`):
ssh deploy@SERVER "pm2 delete OLD_APP_NAME || true"

# 3. Run the workflow once (push to main or "Run workflow" in the Actions tab).
#    It ships the bundle, writes .env, and starts the app.

# 4. Persist PM2 across reboots (once):
ssh deploy@SERVER "pm2 startup"   # run the command it prints, then:
ssh deploy@SERVER "pm2 save"
```

The app listens on `127.0.0.1:3000` - point your existing nginx/reverse proxy
at that. Change `PORT`/`HOSTNAME` in `ecosystem.config.js` if needed.

## Notes

- **Standalone requires the runtime `.env`** - Next's standalone server does not
  auto-load `.env`, so PM2 starts node with `--env-file=../.env` (Node 22 native).
- **`ioredis`** is a dependency but not referenced in source yet. If you add
  Redis, add `REDIS_URL` (or your chosen var) to the workflow's env block and the
  `runtime.env` heredoc.
