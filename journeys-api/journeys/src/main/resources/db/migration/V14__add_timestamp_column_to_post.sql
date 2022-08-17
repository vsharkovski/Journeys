alter table post
    add column timestamp timestamp;

alter table post
    alter column timestamp set default now();