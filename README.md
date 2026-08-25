# Local Study Tracker

Offline study tracker for one learner and one admin. The app runs on one machine, stores all live data in `data/state.json`, and never needs a build step.

## Run

```bash
npm install
npm start
```

Open `http://127.0.0.1:3000`.

Default accounts are defined at the top of `server.js`:

```js
admin / admin123
learner / learner123
```

The login screen also has one-click demo buttons for both accounts.

You can override the demo credentials with environment variables:

```bash
STUDY_TRACKER_ADMIN_PASSWORD=...
STUDY_TRACKER_LEARNER_PASSWORD=...
STUDY_TRACKER_AUTH_SECRET=...
STUDY_TRACKER_DATA_DIR=/var/data
```

For cloud Node hosts, set `HOST=0.0.0.0` and `PORT` to the value required by the platform. Mount a persistent disk at the same path as `STUDY_TRACKER_DATA_DIR` so `state.json`, backups, and the auth secret survive restarts. The bundled seed remains in the app code, so the persistent disk does not need a copy of `seed-schedule.json`. The included `Procfile` and `Dockerfile` use `npm start`.

## Data

Live data is stored in:

```text
data/state.json
```

The file is pretty-printed JSON so it can be inspected in a text editor. Every learner tick and admin edit writes immediately.

Before each overwrite, the app copies the previous file to:

```text
data/backups/
```

The newest 30 backups are kept. If `state.json` is corrupt, the app renames it with a `.corrupt-<timestamp>` suffix and restores the newest backup. If no backup exists, it re-seeds from `data/seed-schedule.json`.

## Reset

To reset the live state from the seed schedule:

```bash
npm run reset
```

The command prompts for `RESET` before deleting `data/state.json`.

The admin Data screen also supports downloading `state.json`, listing/restoring backups, undoing admin edits, resetting progress, and resetting everything.

## Schedule Notes

Static GK is integrated into the daily schedule rather than treated as a separate learner area. The 24 new Static GK items are scheduled across November 2-28, 2026, one new item per non-Sunday day. November 30 is used for consolidation. Later December and January Static GK blocks continue as rotation practice, and Static GK counts toward daily resources and overall completion.

Empty Sundays are now recursive revision days. Each Sunday deep-reviews the latest completed week and quick-recalls older weeks by subject, so repeated material takes less time on later passes instead of leaving the calendar at zero.

The monthly second Saturday is marked as `Second Saturday` inside the schedule window. Normal study days on those dates become holiday bonus days; mock and sectional days keep their main day type while still showing the holiday label.

## Tests

```bash
npm test
```

The tests cover the required pure algorithms for resource-weighted topic completion, pace/verdict, rebalance feasibility, and weakness ranking.

## Security

This is local accountability software, not a hardened multi-user system. The default accounts are public demo accounts and passwords are not hashed because the code and JSON files are readable on disk by the same machine user.
For a private deployment, use the environment variables above instead of the demo passwords. The server binds to `127.0.0.1` by default for local safety; set `HOST=0.0.0.0` only on a trusted host.

Login uses httpOnly JWT cookies:

- `study_access`: short-lived access token, 15 minutes.
- `study_refresh`: refresh token, 30 days.

The server automatically accepts a valid refresh token and issues a new access token, so the browser can stay logged in without storing tokens in JavaScript or `localStorage`. Set `STUDY_TRACKER_AUTH_SECRET` for private use; otherwise the app uses a fixed demo signing secret.
