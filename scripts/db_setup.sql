CREATE TABLE public.download_counts
(
    file character varying NOT NULL,
    downloads integer NOT NULL DEFAULT 0,
    PRIMARY KEY (file)
);

ALTER TABLE public.download_counts
    OWNER to postgres;
