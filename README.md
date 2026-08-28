# Grafana K6 Demo for Zaelab QA Meetup

A live demo repository for a **Grafana k6** load testing.

The application under test is **OWASP Juice Shop** — a deliberately
insecure web shop — running in Docker with a **1 CPU limit**. The CPU
limit is intentional: it makes the app give up under load so that the
"breaking point" is clearly visible during the live presentation.

> ⚠️ Do **not** change the CPU limit in `docker-compose.yml`. The whole
> point of Demo 1 is to watch the app break under pressure.

## Repository structure

```
Zaelab-K6-Demo/
├── .gitignore
├── docker-compose.yml            # Juice Shop in Docker, limited to 1 CPU
├── Makefile                      # one-command helpers (up, smoke, stress, guard, down)
├── README.md
├── scripts/
│   ├── smoke.js                  # Demo 1, step 1: environment smoke test (~35s, GREEN)
│   ├── stress.js                 # Demo 1, step 2: VU ramp up to the breaking point (~2m40s, RED)
│   └── guard.js                  # Demo 2: the "Guardian" used by the Quality Gate (~45s)
└── .github/
    └── workflows/
        └── k6-quality-gate.yml   # PR check: runs guard.js and blocks the merge if the SLO is crossed
```

## Requirements

- **k6** — install with Homebrew:

  ```sh
  brew install grafana/tap/k6
  ```

- **Docker Desktop** with **at least 4 CPUs and 8 GB of RAM** assigned to
  the VM (Settings → Resources). This matters: with the default
  resources the machine absorbs the load and the breaking point is not
  visible.

## Quick usage

All the commands you need during the workshop:

```sh
make up       # start Juice Shop and wait until it is ready
make smoke    # run the smoke test  (smoke.js)  — must finish GREEN
make stress   # run the stress test (stress.js) — must finish RED
make guard    # run the Guardian    (guard.js)  — like GitHub Actions would
make down     # stop and remove the containers

make check    # sanity check: k6 installed + app responding
make logs     # tail the Juice Shop logs
```

You can also override the base URL if the app runs elsewhere:

```sh
BASE_URL=http://other-host:3000 k6 run scripts/smoke.js
```
