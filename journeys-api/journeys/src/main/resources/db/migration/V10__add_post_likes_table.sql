create table post_likes
(
    id          bigserial primary key,
    user_id bigserial references users (id),
    post_id bigserial references post (id)
)