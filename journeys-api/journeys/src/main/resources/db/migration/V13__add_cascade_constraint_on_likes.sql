drop table if exists post_likes cascade;

create table post_likes
(
    id      bigserial primary key,
    user_id bigserial references users (id) on delete cascade,
    post_id bigserial references post (id) on delete cascade
)