create table site (
  id serial primary key,
  name varchar,
  lat float8,
  lng float8
);

insert into site values (1, 'Moroco', 0.1444015171331046, -70.96084408873314);
insert into site values (2, 'Mitú', 1.2539646349060007, -70.23341850460245);
insert into site values (3, 'Araracuara', -0.5930590066379546, -72.38932491030444);
insert into site values (4, 'Villa Azul', -0.5745422166246894, -72.11438768433418);

------------------------------------------------------------------------------------

create table guide (
  id integer primary key,
  name varchar,
  trip_guide boolean,
  biography text
);

insert into guide values (1, 'Jose Castaño', true, 'Jose has been studying birds since 2001 when he became interested in the protection of the Yellow-eared Parrot. Jose was a founding member of Proaves, and helped to establish many successful nature reserves. Jose has been guiding professionally since 2008.');
insert into guide values (2, 'Miguel', false, 'Miguel has many years of experience of field identification of forest birds in the sites close to Mitú. He uses both English and scientific names of bird species.');
insert into guide values (3, 'Florencio', false, null);
insert into guide values (4, 'Anthony', false, null);

------------------------------------------------------------------------------------

create table site_guide (
  id integer primary key,
  site integer references site,
  guide integer references guide,
  unique (site, guide)
);

insert into site_guide values (1, 2, 2);
insert into site_guide  values (2, 2, 3);
insert into site_guide  values (3, 3, 4);

------------------------------------------------------------------------------------

create table language (
  id integer primary key,
  name varchar
);

------------------------------------------------------------------------------------

insert into language values (1, 'Spanish');
insert into language values (2, 'English');

create table guide_language (
  id integer primary key,
  guide integer references guide (id),
  language integer references language (id)
);

insert into guide_language values (1, 1, 1);
insert into guide_language values (2, 1, 2);
insert into guide_language values (3, 2, 1);

------------------------------------------------------------------------------------

create table trip (
  id integer primary key,
  name varchar
);

insert into trip values (1, 'Araracuara Jan 2021');

------------------------------------------------------------------------------------

create table trip_site_day (
  id integer primary key,
  trip integer references trip,
  site integer references site,
  day integer,
  unique (trip, site, day)
);

insert into trip_site_day (id, trip, site, day) values (1, 1, 4, 1);
insert into trip_site_day (id, trip, site, day) values (2, 1, 3, 2);
insert into trip_site_day (id, trip, site, day) values (3, 1, 3, 3);

------------------------------------------------------------------------------------

-- create table day_site_guide (
--   id integer primary key,
--   site integer references site,
--   site_guide integer references site_guide,
--   day integer,
--   foreign key (site, day) references site_day (site, day),
--   foreign key (site_guide, site) references site_guide (id, site)
-- );

-- insert into site_day_guide values (1, 1, 1, 1);
-- insert into site_day_guide values (2, 1, 2, 2);

------------------------------------------------------------------------------------

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
