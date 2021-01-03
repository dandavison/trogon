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
insert into image (site, guide, url) values (1, null, 'https://user-images.githubusercontent.com/52205/103485834-2d5f8f00-4dc7-11eb-8072-507b200faffc.png');
insert into image (site, guide, url) values (1, null, 'https://user-images.githubusercontent.com/52205/103485853-639d0e80-4dc7-11eb-95af-6c64187e90e6.png');
insert into image (site, guide, url) values (1, null, 'https://user-images.githubusercontent.com/52205/103485873-90512600-4dc7-11eb-8c8e-42137cd9e403.png');
insert into image (site, guide, url) values (1, null, 'https://user-images.githubusercontent.com/52205/103486046-e7a3c600-4dc8-11eb-83f4-8a702e65364b.png');
insert into image (site, guide, url) values (1, null, 'https://user-images.githubusercontent.com/52205/103486080-1457dd80-4dc9-11eb-8088-ca5ee516b2d3.png');

-- Mitu
insert into image (site, guide, url) values (2, null, 'https://user-images.githubusercontent.com/52205/103485896-becf0100-4dc7-11eb-9298-1cb350123df6.png');
insert into image (site, guide, url) values (2, null, 'https://user-images.githubusercontent.com/52205/103485926-f473ea00-4dc7-11eb-9e56-244abd9f4faf.png');
insert into image (site, guide, url) values (2, null, 'https://user-images.githubusercontent.com/52205/103485998-9398e180-4dc8-11eb-9604-bc89fe6566a1.png');

-- Araracuara
insert into image (site, guide, url) values (3, null, 'https://user-images.githubusercontent.com/52205/103486906-49672e80-4dcf-11eb-99e6-020c6f095ba2.png');

-- Villa Azul
insert into image (site, guide, url) values (4, null, 'https://www.paisatours.com/images/leticia_l.JPG');

-- Jose
insert into image (site, guide, url) values (null, 1, 'https://user-images.githubusercontent.com/52205/103488643-458dd900-4ddc-11eb-9177-b06b4a067785.png');

-- Miguel
insert into image (site, guide, url) values (null, 2, 'https://user-images.githubusercontent.com/52205/103485942-17060300-4dc8-11eb-8fcd-e0abab17865f.png');
