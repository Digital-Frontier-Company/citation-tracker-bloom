-- Create default organization if it doesn't exist
DO $$
DECLARE
    default_org_id UUID;
    org_exists BOOLEAN;
BEGIN
    -- Check if default organization exists
    SELECT EXISTS(SELECT 1 FROM public.organizations WHERE name = 'Default Organization') INTO org_exists;
    
    -- Create it if it doesn't exist
    IF NOT org_exists THEN
        INSERT INTO public.organizations (name, subscription_tier) 
        VALUES ('Default Organization', 'starter');
    END IF;
    
    -- Get the default organization ID
    SELECT id INTO default_org_id FROM public.organizations WHERE name = 'Default Organization' LIMIT 1;
    
    -- Update any profiles that don't have an organization_id
    UPDATE public.profiles 
    SET organization_id = default_org_id
    WHERE organization_id IS NULL;
    
    -- Create profiles for any auth users who don't have one
    INSERT INTO public.profiles (user_id, display_name, organization_id)
    SELECT 
        au.id,
        COALESCE(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name', 'User'),
        default_org_id
    FROM auth.users au
    LEFT JOIN public.profiles p ON au.id = p.user_id
    WHERE p.user_id IS NULL;
END $$;