import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Enhanced auth handling
    const authHeader = req.headers.get('Authorization');
    console.log('Auth header present:', !!authHeader);
    
    if (!authHeader) {
      throw new Error('No authorization header provided');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    console.log('User auth result:', { 
      hasUser: !!userData?.user, 
      userId: userData?.user?.id,
      error: userError?.message 
    });
    
    if (userError) {
      console.error('Auth error:', userError);
      throw new Error(`Authentication failed: ${userError.message}`);
    }
    
    const user = userData.user;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const method = req.method;
    const url = new URL(req.url);
    const projectId = url.pathname.split('/').pop();

    switch (method) {
      case 'GET':
        // RLS policies will automatically filter to user's organization
        const { data: projects, error: getError } = await supabaseClient
          .from('monitored_domains')
          .select('*')
          .order('created_at', { ascending: false });

        if (getError) {
          console.error('Get projects error:', getError);
          throw getError;
        }
        
        console.log('Retrieved projects:', projects?.length || 0);
        return new Response(JSON.stringify(projects), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'POST':
        console.log('POST request started for user:', user.id);
        
        let requestBody;
        try {
          const bodyText = await req.text();
          console.log('Raw request body:', bodyText);
          requestBody = JSON.parse(bodyText);
          console.log('Parsed request body:', requestBody);
        } catch (error) {
          console.error('Failed to parse request body:', error);
          throw new Error('Invalid JSON in request body');
        }
        
        const { domain, display_name } = requestBody;
        
        if (!domain?.trim()) {
          throw new Error('Domain is required');
        }

        // Get user's profile and organization with detailed logging
        console.log('Looking up profile for user:', user.id);
        const { data: profile, error: profileError } = await supabaseClient
          .from('profiles')
          .select('organization_id, display_name')
          .eq('user_id', user.id)
          .maybeSingle();

        console.log('Profile query result:', { 
          profile, 
          profileError: profileError?.message,
          hasOrgId: !!profile?.organization_id 
        });

        if (profileError) {
          console.error('Profile query error:', profileError);
          throw new Error(`Failed to get user profile: ${profileError.message}`);
        }

        if (!profile) {
          console.error('No profile found for user:', user.id);
          throw new Error('User profile not found. Please contact support.');
        }

        if (!profile.organization_id) {
          console.error('No organization found for user profile:', user.id);
          throw new Error('User organization not found. Please contact support.');
        }

        console.log('Creating project with:', {
          domain: domain.trim(),
          display_name: display_name?.trim() || domain.trim(),
          organization_id: profile.organization_id
        });
        
        const { data: newProject, error: createError } = await supabaseClient
          .from('monitored_domains')
          .insert({
            domain: domain.trim(),
            display_name: display_name?.trim() || domain.trim(),
            organization_id: profile.organization_id,
          })
          .select()
          .single();

        console.log('Insert result:', { 
          success: !!newProject, 
          error: createError?.message 
        });

        if (createError) {
          console.error('Create error details:', createError);
          
          // Provide more specific error messages
          if (createError.code === '23505') {
            throw new Error('A project with this domain already exists in your organization');
          }
          
          throw new Error(`Failed to create project: ${createError.message}`);
        }
        
        return new Response(JSON.stringify(newProject), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 201,
        });

      case 'DELETE':
        if (!projectId) throw new Error('Project ID required for deletion');
        
        console.log('Deleting project:', projectId, 'for user:', user.id);
        
        // RLS policies will ensure user can only delete their org's domains
        const { error: deleteError } = await supabaseClient
          .from('monitored_domains')
          .delete()
          .eq('id', projectId);

        if (deleteError) {
          console.error('Delete error:', deleteError);
          throw deleteError;
        }
        
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      default:
        throw new Error(`Method ${method} not allowed`);
    }
  } catch (error) {
    console.error('Projects API error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: error.details || 'No additional details available'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: error.message.includes('not authenticated') ? 401 : 400,
    });
  }
});