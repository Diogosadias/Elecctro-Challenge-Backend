CREATE TABLE IF NOT EXISTS todos (
    id UUID PRIMARY KEY,
    state VARCHAR(20) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP
); 