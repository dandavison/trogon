db:
	dropdb --if-exists sylph
	createdb sylph
	psql -d sylph < db.sql
