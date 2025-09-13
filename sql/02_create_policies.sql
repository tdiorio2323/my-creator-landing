-- Policies for profiles table
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Policies for creators table
CREATE POLICY "Creator profiles are viewable by everyone" ON public.creators
    FOR SELECT USING (true);

CREATE POLICY "Users can create their own creator profile" ON public.creators
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own creator profile" ON public.creators
    FOR UPDATE USING (auth.uid() = user_id);

-- Policies for subscription_tiers table
CREATE POLICY "Subscription tiers are viewable by everyone" ON public.subscription_tiers
    FOR SELECT USING (true);

CREATE POLICY "Creators can manage their own tiers" ON public.subscription_tiers
    FOR ALL USING (auth.uid() IN (
        SELECT user_id FROM public.creators WHERE id = creator_id
    ));

-- Policies for subscriptions table
CREATE POLICY "Users can view their own subscriptions" ON public.subscriptions
    FOR SELECT USING (
        auth.uid() = subscriber_id OR 
        auth.uid() IN (SELECT user_id FROM public.creators WHERE id = creator_id)
    );

CREATE POLICY "Users can create their own subscriptions" ON public.subscriptions
    FOR INSERT WITH CHECK (auth.uid() = subscriber_id);

CREATE POLICY "Users can update their own subscriptions" ON public.subscriptions
    FOR UPDATE USING (auth.uid() = subscriber_id);

-- Policies for content table
CREATE POLICY "Published content is viewable by everyone" ON public.content
    FOR SELECT USING (published_at IS NOT NULL);

CREATE POLICY "Creators can manage their own content" ON public.content
    FOR ALL USING (auth.uid() IN (
        SELECT user_id FROM public.creators WHERE id = creator_id
    ));

-- Policies for content_interactions table
CREATE POLICY "Users can view all interactions" ON public.content_interactions
    FOR SELECT USING (true);

CREATE POLICY "Users can manage their own interactions" ON public.content_interactions
    FOR ALL USING (auth.uid() = user_id);

-- Policies for messages table
CREATE POLICY "Users can view their own messages" ON public.messages
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages" ON public.messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their own sent messages" ON public.messages
    FOR UPDATE USING (auth.uid() = sender_id);

-- Policies for payments table
CREATE POLICY "Users can view their own payments" ON public.payments
    FOR SELECT USING (
        auth.uid() = payer_id OR 
        auth.uid() IN (SELECT user_id FROM public.creators WHERE id = creator_id)
    );

CREATE POLICY "System can create payments" ON public.payments
    FOR INSERT WITH CHECK (true);

-- Policies for creator_analytics table
CREATE POLICY "Creators can view their own analytics" ON public.creator_analytics
    FOR SELECT USING (auth.uid() IN (
        SELECT user_id FROM public.creators WHERE id = creator_id
    ));

CREATE POLICY "System can manage analytics" ON public.creator_analytics
    FOR ALL USING (true);