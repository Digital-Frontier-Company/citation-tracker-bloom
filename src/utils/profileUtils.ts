import { supabase } from "@/integrations/supabase/client";

export const checkAndFixUserProfile = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      throw new Error('User not authenticated');
    }

    console.log('Checking profile for user:', session.user.id);

    // Check if profile exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', session.user.id)
      .maybeSingle();

    console.log('Profile check result:', { profile, profileError });

    if (profileError) {
      console.error('Profile check error:', profileError);
      throw profileError;
    }

    if (!profile) {
      console.log('No profile found, creating one...');
      
      // Get or create default organization first
      let { data: defaultOrg, error: orgError } = await supabase
        .from('organizations')
        .select('id')
        .eq('name', 'Default Organization')
        .maybeSingle();

      if (orgError || !defaultOrg) {
        console.log('Creating default organization...');
        const { data: newOrg, error: createOrgError } = await supabase
          .from('organizations')
          .insert({
            name: 'Default Organization',
            subscription_tier: 'starter'
          })
          .select('id')
          .single();

        if (createOrgError) {
          console.error('Failed to create default organization:', createOrgError);
          throw createOrgError;
        }
        defaultOrg = newOrg;
      }

      // Create profile
      const { data: newProfile, error: createProfileError } = await supabase
        .from('profiles')
        .insert({
          user_id: session.user.id,
          display_name: session.user.user_metadata?.full_name || 
                       session.user.user_metadata?.name || 
                       'User',
          avatar_url: session.user.user_metadata?.avatar_url,
          organization_id: defaultOrg.id
        })
        .select()
        .single();

      if (createProfileError) {
        console.error('Failed to create profile:', createProfileError);
        throw createProfileError;
      }

      console.log('Profile created successfully:', newProfile);
      return newProfile;
    }

    if (!profile.organization_id) {
      console.log('Profile exists but missing organization, fixing...');
      
      // Get or create default organization
      let { data: defaultOrg, error: orgError } = await supabase
        .from('organizations')
        .select('id')
        .eq('name', 'Default Organization')
        .maybeSingle();

      if (orgError || !defaultOrg) {
        const { data: newOrg, error: createOrgError } = await supabase
          .from('organizations')
          .insert({
            name: 'Default Organization',
            subscription_tier: 'starter'
          })
          .select('id')
          .single();

        if (createOrgError) throw createOrgError;
        defaultOrg = newOrg;
      }

      // Update profile with organization
      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update({ organization_id: defaultOrg.id })
        .eq('user_id', session.user.id)
        .select()
        .single();

      if (updateError) {
        console.error('Failed to update profile:', updateError);
        throw updateError;
      }

      console.log('Profile updated with organization:', updatedProfile);
      return updatedProfile;
    }

    console.log('Profile is valid:', profile);
    return profile;

  } catch (error) {
    console.error('Profile check/fix failed:', error);
    throw error;
  }
};

// Hook to use in components
export const useProfileCheck = () => {
  const checkProfile = async () => {
    try {
      await checkAndFixUserProfile();
      return { success: true };
    } catch (error: any) {
      console.error('Profile check failed:', error);
      return { success: false, error: error.message };
    }
  };

  return { checkProfile };
};