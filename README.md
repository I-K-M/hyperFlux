# HyperFlux

Personal development sandbox. Docker defaults are for local development, not Internet-facing production.

## Docker setup

```bash
cp .env.example .env
# Generate two independent random values: openssl rand -hex 32
# Set POSTGRES_PASSWORD and SECRET_KEY before continuing.
docker compose config -q
docker compose up --build
```

The web UI is bound to 127.0.0.1:5173 and API to 127.0.0.1:3000. PostgreSQL has no published host port. The backend no longer bind-mounts its source, runs as unprivileged `node`, and uses per-context .dockerignore rules.

The frontend currently contains hardcoded localhost API URLs, so this Compose is **local development only**. Before production, use a same-origin reverse proxy or configurable public API URL and enforce HTTPS. Review CSRF, login rate limits, reset token handling and `/chat` authentication.

PostgreSQL remains on major 15 to avoid breaking existing persisted volumes. Update databases using a supported migration procedure, not an image-only major-version jump. Updating POSTGRES_PASSWORD in .env does **not** rotate the password in existing databases. After merging, rotate any known exposed credentials in actual deployments.

Node 18 has been replaced with Node 22. Run application tests and dependency vulnerability scans in CI; Docker builds cannot be validated in this environment.
