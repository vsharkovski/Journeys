alter table post
    add user_id bigint references users(id) not null default 1,
    drop column old_user_id;

drop table old_users