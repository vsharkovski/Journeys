alter table post
    rename column timestamp to timestamp_created;

alter table post_comments
    rename column timestamp to timestamp_created;