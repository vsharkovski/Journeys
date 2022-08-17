alter table users
rename to old_users;

alter table post
    add old_user_id bigint references old_users(id) not null default 1,
    drop column user_id;

drop table followers;

create table followers(
    id bigserial primary key,
    follower_id bigserial references old_users(id),
    followed_id bigserial references old_users(id)
)