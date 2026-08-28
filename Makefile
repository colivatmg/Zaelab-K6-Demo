.PHONY: up down logs smoke stress guard check

up:
	docker compose up -d
	@echo "Waiting for Juice Shop to be ready..."
	@for i in $$(seq 1 30); do curl -sf http://localhost:3000/api/products >/dev/null 2>&1 && break; sleep 2; done
	@echo "Juice Shop ready at http://localhost:3000"

down:
	docker compose down

logs:
	docker compose logs -f juice-shop

smoke:
	k6 run scripts/smoke.js

stress:
	k6 run scripts/stress.js

guard:
	k6 run scripts/guard.js

check:
	k6 version && curl -sf http://localhost:3000/api/products >/dev/null && echo "Environment OK"
