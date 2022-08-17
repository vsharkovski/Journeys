create table followers(
    id bigserial primary key,
    follower_id bigserial references users(id) unique,
    followed_id bigserial references users(id) unique
)