# Mojohost Deployment Runbook

Production domain:

`https://app.cpcadvertising.com`

Deployment path:

`/home/dev_ssh/cpcadvertising`

PM2 process:

`cpcadvertising-app`

## Manual Deploy

```bash
cd /home/dev_ssh/cpcadvertising
git pull --ff-only origin main
npm install
npm run build
pm2 restart cpcadvertising-app --update-env || pm2 start npm --name cpcadvertising-app -- start
pm2 save
```

## Current Proxy Target

The app listens on port `3000`.

Preferred proxy target:

`http://127.0.0.1:3000`

If Mojohost's proxy cannot reach loopback from the Apache vhost, use:

`http://208.122.192.71:3000`

## Health Checks

```bash
curl -I http://127.0.0.1:3000/campaigns/new
curl -I http://208.122.192.71:3000/campaigns/new
pm2 status cpcadvertising-app
pm2 logs cpcadvertising-app --lines 50
```

Expected app response:

`HTTP/1.1 200 OK`

If `https://app.cpcadvertising.com/campaigns/new` returns Apache `502` while the health checks above return `200`, the issue is Mojohost proxy/vhost configuration, not the Next.js app.

## Reboot Persistence

The PM2 process list has been saved with `pm2 save`.

Mojohost/root should run the startup command printed by:

```bash
pm2 startup
```
