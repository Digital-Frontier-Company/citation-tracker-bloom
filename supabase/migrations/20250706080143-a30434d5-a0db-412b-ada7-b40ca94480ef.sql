-- Ensure there's always a default organization
INSERT INTO public.organizations (name, subscription_tier) 
VALUES ('Default Organization', 'starter')
ON CONFLICT (name) DO NOTHING;

-- Update any profiles that don't have an organization_id
UPDATE public.profiles 
SET organization_id = (SELECT id FROM public.organizations WHERE name = 'Default Organization' LIMIT 1)
WHERE organization_id IS NULL;

-- Check if we have any users without profiles and create them
-- This will help with any auth users who don't have profiles yet
DO $$
DECLARE
    default_org_id UUID;
BEGIN
    -- Get the default organization ID
    SELECT id INTO default_org_id FROM public.organizations WHERE name = 'Default Organization' LIMIT 1;
    
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