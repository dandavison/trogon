-- who is the guide on day 2?
select sg.name
from site_guide as sg
inner join site_day_guide as sdg on sdg.site_guide = sg.id
where sdg.day = 2;
