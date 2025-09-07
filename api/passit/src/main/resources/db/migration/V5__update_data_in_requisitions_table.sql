ALTER TABLE requisitions
    ALTER COLUMN item_id TYPE uuid USING item_id::uuid,
    ALTER COLUMN user_id TYPE uuid USING user_id::uuid;
