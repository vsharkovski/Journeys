drop table followers;

create table followers(
    id bigserial primary key,
    follower_id bigserial references users(id),
    followed_id bigserial references users(id)
)