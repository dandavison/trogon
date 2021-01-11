create table site (
  id serial primary key,
  name varchar,
  lat float8,
  lng float8,
  description text
);

insert into site values (1, 'Moroco', 0.1444015171331046, -70.96084408873314, 'Moroco is a small community on the right bank of the Rio Apaporis. The cliffs of one of the nearby table top mesetas can be reached in 3 hours walk through the forest starting from the opposite bank.');
insert into site values (2, 'Mitú', 1.2539646349060007, -70.23341850460245, 'Mitú is is a medium-sized town on the banks of the Rio Vaupés in the Colombian Amazon basin. It is the capital of the department of Vaupes. It can only be reached by air or river, but there are several roads leaving town giving access to well-preserved Amazonian terra firme and white sand forests, at which over 400 bird species have been recorded.');
insert into site values (3, 'Araracuara', -0.5930590066379546, -72.38932491030444, 'Araracuara is a small town with an airstrip on the left bank of the Rio Caquetá.');
insert into site values (4, 'Villa Azul', -0.5745422166246894, -72.11438768433418, 'Villa Azul is a small community on the left bank of the Rio Caquetá, 10 miles downstream of Araracuara.');

------------------------------------------------------------------------------------

create table habitat (
  id serial primary key,
  name varchar,
  description text
);

insert into habitat (name, description) values ('Terra Firme forest', 'Terra Firme literally means "firm earth" and refers to rainforest that is not inundated by flooded rivers. This forest is noticeably taller and more diverse (>400 species/hectare in some areas) than igapò or flooded forest. It is found only on dry, well-drained soils and is characterized by such species as Brazil nut trees, Rubber trees, and many tropical hardwood trees.');
insert into habitat (name, description) values ('Vàrzea forest', 'Vàrzea forests are floodplain forests which flood seasonally. Unlike swamp forests, varzeà forests have relatively rich soils from the annual replenishment of nutrients from whitewater rivers. Because these forests are more suitable for agriculture than typical rainforest, they are some of the most threatened. Even in the Amazon where vast majority of such forests are found, vàrzea are disappearing rapidly for development. <br> Floodplain forests, especially those located on river banks and islands, are often short-lived due to the meandering nature of tropical lowland rivers which eat away at the forests&#39; base. According to Amazon Headwaters, a book by Michael Goulding and his colleagues, research in Peru suggests that most floodplain forests are rarely older than 200 years and may have turnover rates exceeding 1.6 percent, implying an average tree life of 63 years. For this reason, floodplain forests are nearly always in some stage of succession with pioneer species like Cecropia being replaced with Kapok (Ceiba) and fig trees further away from the river.');
insert into habitat (name, description) values ('Igapò forest', 'Igapò forest is rainforest that is regularly inundated for extended periods during the flood season (sometimes considered permanently flooded rainforest). The best known of such forests are found in the Amazon Basin where they make up about 2 percent of the total rainforest. Igapò forest trees are shorter than those of non-flooded forest because of the instability caused by the wet, poorly drained soils (hence it is sometimes known as "swamp forest") and characterized by certain tree species like Cecropia, Ceiba, and Mauritia palms (also known as the aguaje palm). Many igapò tree species have stilt roots and flying buttresses to lend structural support. Igapò forest is flooded (4-10 months of the year) and flooding is usually predictable. Fish play an important role in seed dispersal in this forest system.');
insert into habitat (name, description) values ('White sand forest', 'Neotropical white-sand forests are unique rainforest ecosystems found throughout tropical South America, often occurring as “habitat islands” surrounded by more typical rainforests that grow in terra firme, where the soil has higher clay content.');
insert into habitat (name, description) values ('Tropical montane forest', 'Tropical montane rainforest is forest that grows on mountains and above an altitude of 3,300 feet. High montane forest, above 6,600-10,000 feet (2,500-3,000 meters) in elevation, is often manifested as "cloud forest," forest that receives the majority of its precipitation from mist or fog that passes up from the moist, humid lowlands. The trees of cloud forests are typically shorter than those of lowland forest resulting in a less-developed canopy. Nevertheless, cloud forest trees are heavily burdened with epiphytes that thrive with the abundance of moisture from the passing fog. Trees in places like the lower elevations of the Andes in Ecuador, Peru, Colombia, and Venezuela; Central America (Monteverde in Costa Rica in particular); Borneo (Mount Kinabalu); and Africa (Ethiopia, Kenya, Rwanda, Zaire, Uganda), are frequently green with dense moss and beautiful, often rare, orchids.<br> Patches of cloud forests tend to have many endemic species, because they are often isolated from other sections of cloud forest by valleys and ridges. These species are prevented from migrating to other forest areas by these obstacles to the sides, by the lowland forest below, and by steep cliffs above. Cloud forests are home to an abundance of hummingbirds, frogs, and epiphytes like orchids, bromeliads, and mosses. Many of these species are endemic to a single locality, like the Golden toad of Monteverde, Costa Rica, a species which is now believed to be extinct. Cloud forests generally lack an abundance of large-bodied mammals due to the small number of fruiting trees.<br>Tropical montane forests are especially in the South American Andean region, where much of the forest has been cleared for agriculture. Of the continent&#39;s endangered species, a disproportionate number of those are found in yungas, the regional name for tropical montane forests in the Andes. These forests have also been little studied.<br>Above 10,000 feet (3,300 m), cloud forest may give way to sub-alpine and alpine forest. These habitats have less rain, fewer trees, and reduced biodiversity compared with lower elevation forests.');


------------------------------------------------------------------------------------

create table site_habitat (
  id serial primary key,
  site integer references site,
  habitat integer references habitat,
  unique (site, habitat)
);

insert into site_habitat (site, habitat) values ((select id from site s where s.name = 'Moroco'),
                                                 (select id from habitat h where h.name = 'Terra Firme forest'));
insert into site_habitat (site, habitat) values ((select id from site s where s.name = 'Moroco'),
                                                 (select id from habitat h where h.name = 'Vàrzea forest'));
insert into site_habitat (site, habitat) values ((select id from site s where s.name = 'Mitú'),
                                                 (select id from habitat h where h.name = 'Terra Firme forest'));
insert into site_habitat (site, habitat) values ((select id from site s where s.name = 'Mitú'),
                                                 (select id from habitat h where h.name = 'Vàrzea forest'));
insert into site_habitat (site, habitat) values ((select id from site s where s.name = 'Mitú'),
                                                 (select id from habitat h where h.name = 'White sand forest'));
insert into site_habitat (site, habitat) values ((select id from site s where s.name = 'Araracuara'),
                                                 (select id from habitat h where h.name = 'Terra Firme forest'));
insert into site_habitat (site, habitat) values ((select id from site s where s.name = 'Araracuara'),
                                                 (select id from habitat h where h.name = 'Vàrzea forest'));
insert into site_habitat (site, habitat) values ((select id from site s where s.name = 'Villa Azul'),
                                                 (select id from habitat h where h.name = 'Terra Firme forest'));
insert into site_habitat (site, habitat) values ((select id from site s where s.name = 'Villa Azul'),
                                                 (select id from habitat h where h.name = 'Vàrzea forest'));

------------------------------------------------------------------------------------

create table guide (
  id integer primary key,
  name varchar,
  trip_guide boolean,
  description text
);

insert into guide values (1, 'Jose Castaño', true, 'Jose has been studying birds since 2001 when he became interested in the protection of the Yellow-eared Parrot. Jose was a founding member of Proaves, and helped to establish many successful nature reserves. Jose has been guiding professionally since 2008.');
insert into guide values (2, 'Miguel', false, 'Miguel has many years of experience of field identification of forest birds in the sites close to Mitú. He uses both English and scientific names for bird species.');
insert into guide values (3, 'Florencio', false, 'Florencio is expert in field identification of forest birds at sites close to Mitú. He lives in a community outside Mitú.');
insert into guide values (4, 'Anthony', false, 'Anthony can organize travel by boat to riverside communities downstream of Araracuara with access to forest for birdwatching.');

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
  habitat integer references habitat,
  url varchar,
  check (num_nonnulls(site, guide, habitat) = 1)
);

-- Moroco
insert into image (site, guide, habitat, url) values (1, null, null, 'https://user-images.githubusercontent.com/52205/103703932-6f7b0300-4f76-11eb-9310-0946e4f0d60d.png');
insert into image (site, guide, habitat, url) values (1, null, null, 'https://user-images.githubusercontent.com/52205/103703969-7c97f200-4f76-11eb-95f1-56132fedfaef.png');
insert into image (site, guide, habitat, url) values (1, null, null, 'https://user-images.githubusercontent.com/52205/103704002-891c4a80-4f76-11eb-9c38-cc6f485765b2.png');
insert into image (site, guide, habitat, url) values (1, null, null, 'https://user-images.githubusercontent.com/52205/103704015-90dbef00-4f76-11eb-86ac-0e79bd02611d.png');
insert into image (site, guide, habitat, url) values (1, null, null, 'https://user-images.githubusercontent.com/52205/103704023-933e4900-4f76-11eb-8dcb-326d714f8197.png');

-- Mitu
insert into image (site, guide, habitat, url) values (2, null, null, 'https://user-images.githubusercontent.com/52205/103704051-9d604780-4f76-11eb-84ab-6aa35879620f.png');
insert into image (site, guide, habitat, url) values (2, null, null, 'https://user-images.githubusercontent.com/52205/103704057-9fc2a180-4f76-11eb-93a3-a5e14a956a4e.png');
insert into image (site, guide, habitat, url) values (2, null, null, 'https://user-images.githubusercontent.com/52205/103704065-a224fb80-4f76-11eb-8501-e30e70e4c0e4.png');

-- Araracuara
insert into image (site, guide, habitat, url) values (3, null, null, 'https://user-images.githubusercontent.com/52205/103704075-a8b37300-4f76-11eb-8c6b-48583688c378.png');

-- Villa Azul
insert into image (site, guide, habitat, url) values (4, null, null, 'https://www.paisatours.com/images/leticia_l.JPG');

-- Jose
insert into image (site, guide, habitat, url) values (null, 1, null, 'https://user-images.githubusercontent.com/52205/103704119-c1238d80-4f76-11eb-8ed2-8cc8891712f0.png');

-- Miguel
insert into image (site, guide, habitat, url) values (null, 2, null, 'https://user-images.githubusercontent.com/52205/103704128-c4b71480-4f76-11eb-9737-fb3698394068.png');

-- Florencio
insert into image (site, guide, habitat, url) values (null, 3, null, 'https://user-images.githubusercontent.com/52205/104144333-ccb8ef00-5390-11eb-8a66-6349c2e08825.png');

-- Guide (name?)
-- insert into image (site, guide, habitat, url) values (null, 4, null, 'https://user-images.githubusercontent.com/52205/103704148-cc76b900-4f76-11eb-8ab7-f66c36871b1c.png');


-- habitats
insert into image (site, guide, habitat, url) values (null, null, 1, 'https://mongabay-images.s3.amazonaws.com/1200/amazon/amazon_200302.jpg');
insert into image (site, guide, habitat, url) values (null, null, 2, 'https://upload.wikimedia.org/wikipedia/commons/2/20/Acapalms.jpg?1609950184474');
insert into image (site, guide, habitat, url) values (null, null, 3, 'http://www.mongabay.com/images/brazil/flooded_forest.gif');
insert into image (site, guide, habitat, url) values (null, null, 4, 'https://imgs.mongabay.com/wp-content/uploads/sites/20/2016/01/02190338/FINE_whitesands.jpg');
insert into image (site, guide, habitat, url) values (null, null, 5, 'https://user-images.githubusercontent.com/52205/103795053-80c61d00-5013-11eb-840e-d90bc079052e.png');

------------------------------------------------------------------------------------

create table url (
  id serial primary key,
  habitat integer references habitat,
  type varchar,
  url varchar,
  check (num_nonnulls(habitat) = 1)
);

insert into url (id, habitat, type, url) values ((select id from habitat h where h.name = 'Terra Firme forest'),
                                                 1, 'description', 'https://rainforests.mongabay.com/0103.htm');
insert into url (id, habitat, type, url) values ((select id from habitat h where h.name = 'Vàrzea forest'),
                                                 2, 'description', 'https://rainforests.mongabay.com/0103.htm');
insert into url (id, habitat, type, url) values ((select id from habitat h where h.name = 'Igapò forest'),
                                                 3, 'description', 'https://rainforests.mongabay.com/0103.htm');
insert into url (id, habitat, type, url) values ((select id from habitat h where h.name = 'White sand forest'),
                                                 4, 'description', 'https://news.mongabay.com/2016/01/special-issue-of-biotropica-makes-the-case-for-protecting-south-americas-white-sand-forests');
insert into url (id, habitat, type, url) values ((select id from habitat h where h.name = 'Tropical montane forest'),
                                                 5, 'description', 'https://rainforests.mongabay.com/0103.htm');
