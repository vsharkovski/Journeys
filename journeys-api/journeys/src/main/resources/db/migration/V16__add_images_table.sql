drop table if exists images;

create table images
(
    id      bigserial primary key,
    picture bytea
);

create table post_images
(
    id       bigserial primary key,
    post_id  bigserial references post (id),
    image_id bigserial references images (id)
);