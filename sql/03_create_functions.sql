-- Function to handle profile creation on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, username, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'username',
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to tables
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.creators
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.subscription_tiers
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.content
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.messages
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to update subscriber count when subscription changes
CREATE OR REPLACE FUNCTION public.update_creator_subscriber_count()
RETURNS trigger AS $$
BEGIN
    -- Update subscriber count for the creator
    UPDATE public.creators 
    SET subscriber_count = (
        SELECT COUNT(*) 
        FROM public.subscriptions 
        WHERE creator_id = COALESCE(NEW.creator_id, OLD.creator_id)
        AND status = 'active'
    )
    WHERE id = COALESCE(NEW.creator_id, OLD.creator_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update subscriber count
CREATE TRIGGER update_subscriber_count
    AFTER INSERT OR UPDATE OR DELETE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION public.update_creator_subscriber_count();

-- Function to update content interaction counts
CREATE OR REPLACE FUNCTION public.update_content_counts()
RETURNS trigger AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.interaction_type = 'like' THEN
            UPDATE public.content 
            SET like_count = like_count + 1 
            WHERE id = NEW.content_id;
        ELSIF NEW.interaction_type = 'view' THEN
            UPDATE public.content 
            SET view_count = view_count + 1 
            WHERE id = NEW.content_id;
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.interaction_type = 'like' THEN
            UPDATE public.content 
            SET like_count = GREATEST(like_count - 1, 0) 
            WHERE id = OLD.content_id;
        END IF;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update content counts
CREATE TRIGGER update_content_interaction_counts
    AFTER INSERT OR DELETE ON public.content_interactions
    FOR EACH ROW EXECUTE FUNCTION public.update_content_counts();

-- Function to get user's subscription status with a creator
CREATE OR REPLACE FUNCTION public.get_subscription_status(creator_user_id UUID)
RETURNS TABLE (
    is_subscribed BOOLEAN,
    tier_name TEXT,
    tier_type tier_type
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        CASE WHEN s.id IS NOT NULL THEN TRUE ELSE FALSE END as is_subscribed,
        st.name as tier_name,
        st.tier_type
    FROM public.creators c
    LEFT JOIN public.subscriptions s ON c.id = s.creator_id 
        AND s.subscriber_id = auth.uid() 
        AND s.status = 'active'
    LEFT JOIN public.subscription_tiers st ON s.tier_id = st.id
    WHERE c.user_id = creator_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;