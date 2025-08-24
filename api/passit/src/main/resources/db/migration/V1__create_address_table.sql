CREATE TABLE addresses (
    address_id UUID PRIMARY KEY,
    street     VARCHAR(255),
    city       VARCHAR(255),
    state      VARCHAR(255),
    zip_code   VARCHAR(50)
);