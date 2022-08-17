create table post_comments
(
    id        bigserial primary key,
    user_id   bigserial references users (id) on delete cascade,
    post_id   bigserial references post (id) on delete cascade,
    comment   text not null,
    timestamp timestamp
)