-- First, let's check and fix the user profile
-- Use service role to bypass RLS and directly check/create the profile
DO $$
DECLARE
    user_profile_exists BOOLEAN;
    default_org_id UUID;
BEGIN
    -- Check if profile exists for this user
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE user_id = '4d767d30-8746-4457-8922-617deab9e7e4') INTO user_profile_exists;
    
    -- Get the default organization ID
    SELECT id INTO default_org_id FROM public.organizations WHERE name = 'Default Organization' LIMIT 1;
    
    -- If profile doesn't exist, create it
    IF NOT user_profile_exists THEN
        INSERT INTO public.profiles (user_id, display_name, organization_id)
        VALUES ('4d767d30-8746-4457-8922-617deab9e7e4', 'User', default_org_id);
    ELSE
        -- If it exists but has no org, update it
        UPDATE public.profiles 
        SET organization_id = default_org_id 
        WHERE user_id = '4d767d30-8746-4457-8922-617deab9e7e4' AND organization_id IS NULL;
    END IF;
END $$;

-- Now let's completely rebuild the RLS policies for profiles to avoid recursion
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create simple, non-recursive policies
CREATE POLICY "Enable read access for users to their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for users to create their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users to update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);