CREATE TABLE items (
    item_id          UUID PRIMARY KEY,
    title       VARCHAR(200) NOT NULL,
    description VARCHAR(200),
    category    VARCHAR(50)  NOT NULL,
    image_url   VARCHAR(500),
    status      VARCHAR(20)  NOT NULL,
    user_id     UUID       NOT NULL,
    CONSTRAINT fk_item_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);