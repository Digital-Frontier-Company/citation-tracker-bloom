-- Fix RLS policy recursion issues by simplifying the profiles policies
DROP POLICY IF EXISTS "Users can view profiles in their organization" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile v2" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile directly" ON public.profiles;

-- Keep only the simple, non-recursive policy
-- The remaining policy "Users can view their own profile" should work fine

-- Create a default organization for users who don't have one
INSERT INTO public.organizations (name, subscription_tier) 
VALUES ('Default Organization', 'starter')
ON CONFLICT DO NOTHING;

-- Update the user profile creation function to assign a default organization
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  default_org_id UUID;
BEGIN
  -- Get or create a default organization
  SELECT id INTO default_org_id FROM public.organizations WHERE name = 'Default Organization' LIMIT 1;
  
  IF default_org_id IS NULL THEN
    INSERT INTO public.organizations (name, subscription_tier) 
    VALUES ('Default Organization', 'starter') 
    RETURNING id INTO default_org_id;
  END IF;

  -- Create the user profile with organization assignment
  INSERT INTO public.profiles (user_id, display_name, avatar_url, organization_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'New User'),
    NEW.raw_user_meta_data->>'avatar_url',
    default_org_id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- For existing users without organization_id, assign them to default org
UPDATE public.profiles 
SET organization_id = (SELECT id FROM public.organizations WHERE name = 'Default Organization' LIMIT 1)
WHERE organization_id IS NULL;