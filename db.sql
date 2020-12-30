create table site (
  id integer primary key,
  name varchar,
  lat float8,
  lon float8
);

create table tour (
  id integer primary key,
  name varchar
);

create table site_day (
  id integer primary key,
  tour integer references tour,
  site integer references site,
  day integer,
  unique (site, day)
);

create table site_guide (
  id integer primary key,
  name varchar,
  site integer references site,
  unique (id, site)
);

create table site_day_guide (
  id integer primary key,
  site integer references site,
  site_guide integer references site_guide,
  day integer,
  foreign key (site, day) references site_day (site, day),
  foreign key (site_guide, site) references site_guide (id, site)
);

create table ebird_hotspot (
  locId varchar primary key,
  locName varchar,
  countryCode varchar,
  subnational1Code varchar,
  lat float8,
  lng float8,
  latestObsDt varchar,
  numSpeciesAllTime integer
);

create table ebird_species (
  sciName varchar,
  comName varchar,
  speciesCode varchar primary key,
  category varchar,
  taxonOrder integer,
  _order varchar,
  familyComName varchar,
  familySciName varchar
);

create table ebird_hotspot_species (
  species varchar references ebird_species,
  locId varchar references ebird_hotspot
);

-- site
insert into site (id, name, lat, lon)
values (1, 'Villa Azul', -0.5745422166246894, -72.11438768433418);
insert into site (id, name, lat, lon)
values (2, 'Moroco', 0.1444015171331046, -70.96084408873314);

-- site_guide
-- insert Fred and Anthony as guide at Villa Azul
-- with site as (select id from site where name = "Villa Azul")
insert into site_guide (id, name, site)
values (1, 'Fred', 1);
insert into site_guide  (id, name, site)
values (2, 'Anthony', 1);

-- tour
insert into tour (id, name)
values (1, 'Araracuara Jan 2021');

-- site_day
insert into site_day (id, tour, site, day)
values (1, 1, 1, 1);
insert into site_day (id, tour, site, day)
values (2, 1, 1, 2);

-- site_day_guide
-- Fred on day 1
insert into site_day_guide (id, site, site_guide, day)
values (1, 1, 1, 1);
-- Anthony on day 2
insert into site_day_guide (id, site, site_guide, day)
values (2, 1, 2, 2);
