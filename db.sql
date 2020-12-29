drop table if exists site;
create table site (
  id integer primary key,
  name varchar,
  lat float8,
  lon float8
);

drop table if exists tour;
create table tour (
  id integer primary key,
  name varchar
);

drop table if exists site_day;
create table site_day (
  id integer primary key,
  tour integer references tour,
  site integer references site,
  day integer,
  unique (site, day)
);

drop table if exists site_guide;
create table site_guide (
  id integer primary key,
  name varchar,
  site integer references site,
  unique (id, site)
);

drop table if exists site_day_guide;
create table site_day_guide (
  id integer primary key,
  site integer references site,
  site_guide integer references site_guide,
  day integer,
  foreign key (site, day) references site_day (site, day),
  foreign key (site_guide, site) references site_guide (id, site)
);

-- insert Villa Azul as site 1
insert into site (id, name, lat, lon)
values (1, 'Villa Azul', -0.5745422166246894, -72.11438768433418);

-- insert Fred and Anthony as guide at Villa Azul
-- with site as (select id from site where name = "Villa Azul")
insert into site_guide (id, name, site)
values (1, 'Fred', 1);
insert into site_guide  (id, name, site)
values (2, 'Anthony', 1);

-- create a tour
insert into tour (id, name)
values (1, 'Araracuara Jan 2021');

insert into site_day (id, tour, site, day)
values (1, 1, 1, 1);
insert into site_day (id, tour, site, day)
values (2, 1, 1, 2);

-- Fred on day 1
insert into site_day_guide (id, site, site_guide, day)
values (1, 1, 1, 1);
-- Anthony on day 2
insert into site_day_guide (id, site, site_guide, day)
values (2, 1, 2, 2);
