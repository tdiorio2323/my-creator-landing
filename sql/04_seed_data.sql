-- Insert sample creator profiles (these would normally be created via signup)
-- Note: In production, these would be created through the normal signup flow

-- Sample subscription tiers (will be created once creators are set up)
-- These are examples of what tiers might look like

INSERT INTO public.subscription_tiers (creator_id, name, description, price, tier_type, features) VALUES
-- These will be filled when we have actual creator IDs
-- For now, this serves as documentation of the tier structure

-- Basic tier example
(
    '00000000-0000-0000-0000-000000000000'::uuid, -- placeholder
    'Basic Access', 
    'Access to basic content and community updates',
    9.99,
    'basic',
    '{"features": ["Basic content access", "Community posts", "Monthly updates"]}'::jsonb
),

-- Premium tier example  
(
    '00000000-0000-0000-0000-000000000000'::uuid, -- placeholder
    'Premium Access',
    'Full content access plus exclusive perks',
    19.99,
    'premium', 
    '{"features": ["All basic features", "Exclusive content", "Direct messaging", "Early access"]}'::jsonb
),

-- VIP tier example
(
    '00000000-0000-0000-0000-000000000000'::uuid, -- placeholder
    'VIP Access',
    'Ultimate fan experience with personal interaction',
    49.99,
    'vip',
    '{"features": ["All premium features", "1-on-1 video calls", "Custom content requests", "Priority support"]}'::jsonb
);

-- Sample content categories for reference
-- These will be stored as simple text fields but here are common categories:
-- 'Fitness & Wellness', 'Cooking & Recipes', 'Art & Design', 'Tech Reviews', 
-- 'Music & Audio', 'Gaming', 'Fashion & Beauty', 'Travel & Lifestyle',
-- 'Education & Tutorials', 'Comedy & Entertainment', 'Business & Finance'

-- Note: Actual data seeding should be done after users sign up through the application
-- This file serves as a reference for the data structure and sample content