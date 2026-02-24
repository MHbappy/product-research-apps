-- Create Payment Gateway Config Table
CREATE TABLE payment_gateway_config (
    id BIGSERIAL PRIMARY KEY,
    gateway_name VARCHAR(50) NOT NULL UNIQUE,
    api_key VARCHAR(255),
    secret_key VARCHAR(255),
    webhook_secret VARCHAR(255),
    is_enabled BOOLEAN DEFAULT FALSE,
    is_test_mode BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Create Subscription Plans Table
CREATE TABLE subscription_plans (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(100) NOT NULL UNIQUE,
    price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    interval VARCHAR(20) NOT NULL,
    description TEXT,
    stripe_price_id VARCHAR(255),
    paypal_plan_id VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Create Plan Features Table (ElementCollection)
CREATE TABLE plan_features (
    plan_id BIGINT NOT NULL,
    feature VARCHAR(255),
    FOREIGN KEY (plan_id) REFERENCES subscription_plans(id)
);

-- Create User Subscriptions Table
CREATE TABLE user_subscriptions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    plan_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL,
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    stripe_subscription_id VARCHAR(255),
    paypal_subscription_id VARCHAR(255),
    auto_renew BOOLEAN DEFAULT TRUE,
    gateway_type VARCHAR(50),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    canceled_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (plan_id) REFERENCES subscription_plans(id)
);

-- Create Payment Transactions Table
CREATE TABLE payment_transactions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    gateway VARCHAR(50) NOT NULL,
    transaction_id VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    failure_reason TEXT,
    created_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Seed Initial Data
INSERT INTO payment_gateway_config (gateway_name, is_enabled, is_test_mode, created_at, updated_at) 
VALUES 
('STRIPE', false, true, NOW(), NOW()),
('PAYPAL', false, true, NOW(), NOW());

INSERT INTO subscription_plans (name, code, price, currency, interval, description, is_active, created_at, updated_at)
VALUES 
('Free', 'free_tier', 0.00, 'USD', 'MONTHLY', 'Basic access for individuals', true, NOW(), NOW()),
('Pro', 'pro_monthly', 29.00, 'USD', 'MONTHLY', 'Advanced features for professionals', true, NOW(), NOW());

INSERT INTO plan_features (plan_id, feature) 
SELECT id, 'Basic Project Access' FROM subscription_plans WHERE code = 'free_tier';

INSERT INTO plan_features (plan_id, feature) 
SELECT id, 'Community Support' FROM subscription_plans WHERE code = 'free_tier';

INSERT INTO plan_features (plan_id, feature) 
SELECT id, 'Unlimited Projects' FROM subscription_plans WHERE code = 'pro_monthly';

INSERT INTO plan_features (plan_id, feature) 
SELECT id, 'Priority Support' FROM subscription_plans WHERE code = 'pro_monthly';

INSERT INTO plan_features (plan_id, feature) 
SELECT id, 'Advanced Analytics' FROM subscription_plans WHERE code = 'pro_monthly';
