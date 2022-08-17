alter table post
    drop column cost,
    add cost integer
        default 0;