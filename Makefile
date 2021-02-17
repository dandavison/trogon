TROGON=./target/release/trogon
PSQL=psql -v ON_ERROR_STOP=1
WITH_ENV_DEV=env $$(xargs < .env)
WITH_ENV_PROD=env $$(xargs < .env.prod)
SHELL = bash -u

build: build-ui build-backend

build-ui:
	cd ui && $(WITH_ENV_PROD) npm run build

build-backend:
	cargo build --release

serve-prod:
	$(WITH_ENV_PROD) cargo run --release

serve-ui:
	cd ui && npm run serve

serve-backend:
	$(WITH_ENV_DEV) cargo run

serve-backend-and-ui: build-ui serve-backend

test: test-ui

test-ui:
	cd ui && npm test

test-ui-live:
	cd ui && $(WITH_ENV_DEV) npx cypress open

clean:
	rm -fr ui/dist

psql:
	$(PSQL) "$$TROGON_DB"

pgcli:
	pgcli "$$TROGON_DB"

lint:
	cargo clippy

format:
	cd ui && zsh -c 'npx prettier --write * types/**/* src/**/*'

create-db:
	echo "create database trogon" | $(PSQL)

create-db-schema:
	$(PSQL) "$$TROGON_DB" < db.sql > /dev/null

load-ebird-species: build-backend
	$(TROGON) --load-ebird-species

delete-db:
	@echo "echo 'drop database trogon' | $(PSQL)"

describe-db:
	@echo "SELECT relname as table, n_live_tup as rows FROM pg_stat_user_tables ORDER BY n_live_tup DESC;" \
	| $(PSQL) "$$TROGON_DB"
