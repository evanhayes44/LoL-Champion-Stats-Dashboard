CREATE TABLE champion (
    id         BIGSERIAL    PRIMARY KEY,
    riot_id    VARCHAR(100) NOT NULL UNIQUE,
    name       VARCHAR(100) NOT NULL,
    title      VARCHAR(150),
    image_url  TEXT,
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO champion (riot_id, name, title, image_url) VALUES
    ('Ahri',   'Ahri',   'the Nine-Tailed Fox',  'https://ddragon.leagueoflegends.com/cdn/img/dsf/splash/Ahri_0.jpg'),
    ('Yasuo',  'Yasuo',  'the Unforgiven',        'https://ddragon.leagueoflegends.com/cdn/img/dsf/splash/Yasuo_0.jpg'),
    ('Jinx',   'Jinx',   'the Loose Cannon',      'https://ddragon.leagueoflegends.com/cdn/img/dsf/splash/Jinx_0.jpg');
