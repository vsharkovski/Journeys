create table location
(
    id bigserial primary key,
    name text,
    latitude float,
    longitude float
);

create table post_locations (
    id bigserial primary key,
    post_id bigserial references post(id),
    location_id bigserial references location(id)
);