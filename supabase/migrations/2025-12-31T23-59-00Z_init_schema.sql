-- Farmer Profiles
CREATE TABLE farmers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    location VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Financial Records
CREATE TABLE financial_records (
    id SERIAL PRIMARY KEY,
    farmer_id INTEGER REFERENCES farmers(id),
    type VARCHAR(20) CHECK (type IN ('income', 'expense')),
    amount NUMERIC(12,2) NOT NULL,
    description TEXT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Marketplace Listings
CREATE TABLE marketplace (
    id SERIAL PRIMARY KEY,
    farmer_id INTEGER REFERENCES farmers(id),
    product VARCHAR(100) NOT NULL,
    price NUMERIC(12,2) NOT NULL,
    quantity INTEGER,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Disease Diagnosis History
CREATE TABLE diagnosis_history (
    id SERIAL PRIMARY KEY,
    farmer_id INTEGER REFERENCES farmers(id),
    symptoms TEXT,
    diagnosis TEXT,
    recommendation TEXT,
    diagnosed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
