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

create table cache (
  key varchar primary key,
  value text
);
