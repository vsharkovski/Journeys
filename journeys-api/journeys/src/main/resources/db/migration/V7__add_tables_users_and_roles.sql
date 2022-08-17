create table users (
    id bigserial primary key,
    username varchar(20),
    email varchar(50),
    password varchar(120)
);

create table roles (
    id bigserial primary key,
    name varchar(20)
);

insert into roles (name)
values ('ROLE_USER'), ('ROLE_ADMIN');

create table user_roles (
    id bigserial primary key,
    user_id bigserial references users(id),
    role_id bigserial references roles(id)
);