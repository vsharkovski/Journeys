create or replace view post_like_count as
    select post.id as id, COUNT(*) as like_count
    from post
        inner join post_likes
            on post.id = post_likes.post_id
    group by post.id