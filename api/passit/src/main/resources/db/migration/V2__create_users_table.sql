CREATE TABLE users (
    user_id             UUID PRIMARY KEY,
    name                VARCHAR(255),
    email               VARCHAR(100) UNIQUE,
    password            VARCHAR(255),
    national_identifier VARCHAR(255) UNIQUE,
    user_type     VARCHAR(255),
    address_id          UUID UNIQUE,
    CONSTRAINT fk_user_address FOREIGN KEY (address_id) REFERENCES addresses(address_id)
);