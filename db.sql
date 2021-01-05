create table site (
  id serial primary key,
  name varchar,
  lat float8,
  lng float8,
  description text
);

insert into site values (1, 'Moroco', 0.1444015171331046, -70.96084408873314, 'Moroco is a small community on the right bank of the Rio Apaporis (?). The inhabitants mostly belong to the XXX indigenous ethnicity. It is surrounded by lowland terra firme forest in good condition. The cliffs of one of the nearby table top mesetas can be reached in 3 hours walk through the forest starting from the opposite bank.');
insert into site values (2, 'Mitú', 1.2539646349060007, -70.23341850460245, 'Mitú is is a medium-sized town on the banks of the Rio Vaupés in the Colombian Amazon basin. It is the capital of the department of Vaupes. It can only be reached by air or river, but there are several roads leaving town giving access to well-preserved Amazonian terra firme and white sand forests, at which over 400 bird species have been recorded.');
insert into site values (3, 'Araracuara', -0.5930590066379546, -72.38932491030444, 'Araracuara is a small town with an airstrip on the left bank of the Rio Caquetá.');
insert into site values (4, 'Villa Azul', -0.5745422166246894, -72.11438768433418, 'Villa Azul is a small community on the left bank of the Rio Caquetá, 10 miles downstream of Araracuara.');

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

------------------------------------------------------------------------------------

create table image (
  id serial primary key,
  site integer references site,
  guide integer references guide,
  url varchar,
  check (num_nonnulls(site, guide) = 1)
);

-- Moroco
insert into image (site, guide, url) values (1, null, 'https://user-images.githubusercontent.com/52205/103703932-6f7b0300-4f76-11eb-9310-0946e4f0d60d.png');
insert into image (site, guide, url) values (1, null, 'https://user-images.githubusercontent.com/52205/103703969-7c97f200-4f76-11eb-95f1-56132fedfaef.png');
insert into image (site, guide, url) values (1, null, 'https://user-images.githubusercontent.com/52205/103704002-891c4a80-4f76-11eb-9c38-cc6f485765b2.png');
insert into image (site, guide, url) values (1, null, 'https://user-images.githubusercontent.com/52205/103704015-90dbef00-4f76-11eb-86ac-0e79bd02611d.png');
insert into image (site, guide, url) values (1, null, 'https://user-images.githubusercontent.com/52205/103704023-933e4900-4f76-11eb-8dcb-326d714f8197.png');

-- Mitu
insert into image (site, guide, url) values (2, null, 'https://user-images.githubusercontent.com/52205/103704051-9d604780-4f76-11eb-84ab-6aa35879620f.png');
insert into image (site, guide, url) values (2, null, 'https://user-images.githubusercontent.com/52205/103704057-9fc2a180-4f76-11eb-93a3-a5e14a956a4e.png');
insert into image (site, guide, url) values (2, null, 'https://user-images.githubusercontent.com/52205/103704065-a224fb80-4f76-11eb-8501-e30e70e4c0e4.png');

-- Araracuara
insert into image (site, guide, url) values (3, null, 'https://user-images.githubusercontent.com/52205/103704075-a8b37300-4f76-11eb-8c6b-48583688c378.png');

-- Villa Azul
insert into image (site, guide, url) values (4, null, 'https://www.paisatours.com/images/leticia_l.JPG');

-- Jose
insert into image (site, guide, url) values (null, 1, 'https://user-images.githubusercontent.com/52205/103704119-c1238d80-4f76-11eb-8ed2-8cc8891712f0.png');

-- Miguel
insert into image (site, guide, url) values (null, 2, 'https://user-images.githubusercontent.com/52205/103704128-c4b71480-4f76-11eb-9737-fb3698394068.png');

-- Guide (name?)
-- insert into image (site, guide, url) values (null, 3, 'https://user-images.githubusercontent.com/52205/103704148-cc76b900-4f76-11eb-8ab7-f66c36871b1c.png');
