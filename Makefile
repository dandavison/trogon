SYLPH = target/debug/sylph

build:
	cargo build

server:
	cargo run

db: build
	@dropdb --if-exists sylph
	@createdb sylph
	@psql -d sylph < db.sql > /dev/null
	$(SYLPH) --load-ebird-species
	$(SYLPH) --load-ebird-hotspots
	$(SYLPH) --load-ebird-hotspot-species

describe-db:
	@echo "SELECT relname as table, n_live_tup as rows FROM pg_stat_user_tables ORDER BY n_live_tup DESC;" \
	| psql -d sylph

psql:
	psql -d sylph

fetch-ebird-data: fetch-ebird-species fetch-ebird-hotspots

fetch-ebird-species:
	$(SYLPH) --fetch-ebird-species

fetch-ebird-hotspots:
	for region in CO-AMA CO-CAQ; do \
		$(SYLPH) --fetch-ebird-hotspots $$region; \
	done

# --fetch-ebird-hotspot-species requires that the hotspots are in the
# db (so that it can query for the locIds).
fetch-and-load-hotspot-species:
	$(SYLPH) --load-ebird-hotspots
	$(SYLPH) --fetch-ebird-hotspot-species
	$(SYLPH) --load-ebird-hotspot-species
