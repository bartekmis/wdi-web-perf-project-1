// PM2 config for the standalone Next.js build.
// Place this ONCE at your server's $DEPLOY_PATH (the dir the workflow rsyncs into),
// e.g. /var/www/k2space/ecosystem.config.js. The deploy workflow calls
// `pm2 startOrReload ecosystem.config.js` from that directory on every deploy.
//
// Layout the workflow produces:
//   $DEPLOY_PATH/
//     ecosystem.config.js   <- this file (committed here, copied up once)
//     .env                  <- runtime secrets (rewritten every deploy)
//     current/              <- the standalone bundle (server.js lives here)
//
// Node 22 loads .env natively via --env-file, so no dotenv dependency is needed.

module.exports = {
  apps: [
    {
      // Must match the PM2_APP_NAME GitHub secret.
      name: 'zfailabs',
      cwd: './current',
      script: 'server.js',
      // .env sits one level above the bundle; resolved relative to cwd.
      node_args: '--env-file=../.env',
      exec_mode: 'fork',
      instances: 1,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '127.0.0.1',
      },
    },
  ],
}
