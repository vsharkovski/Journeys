create table users
(
    id bigserial primary key,
    name text,
    surname text,
    username text not null,
    password text not null
);

create table post
(
    id bigserial primary key,
    user_id bigint references users(id) not null default 1,
    title text not null,
    description text
)