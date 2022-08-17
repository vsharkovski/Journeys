alter table post
    drop column timestamp_created,
    add column timestamp_created timestamp not null default now();

alter table post_comments
    drop column timestamp_created,
    add column timestamp_created timestamp not null default now();