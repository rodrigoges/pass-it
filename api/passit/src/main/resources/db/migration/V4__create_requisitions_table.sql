CREATE TABLE requisitions (
    requisition_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL,
    user_id UUID NOT NULL,
    status VARCHAR(255),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_requisitions_item FOREIGN KEY (item_id)
        REFERENCES items (item_id) ON DELETE CASCADE,

    CONSTRAINT fk_requisitions_user FOREIGN KEY (user_id)
        REFERENCES users (user_id) ON DELETE CASCADE
);
