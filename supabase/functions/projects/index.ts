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

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError) throw userError;
    const user = userData.user;
    if (!user) throw new Error('User not authenticated');

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

        if (getError) throw getError;
        return new Response(JSON.stringify(projects), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'POST':
        console.log('POST request started for user:', user.id);
        
        let requestBody;
        try {
          requestBody = await req.json();
          console.log('Request body:', requestBody);
        } catch (error) {
          console.error('Failed to parse request body:', error);
          throw new Error('Invalid JSON in request body');
        }
        
        const { domain, display_name } = requestBody;
        
        // Get user's organization_id for insertion with better error handling
        const { data: profile, error: profileError } = await supabaseClient
          .from('profiles')
          .select('organization_id')
          .eq('user_id', user.id)
          .maybeSingle();

        console.log('Profile query result:', { profile, profileError });

        if (profileError) {
          console.error('Profile query error:', profileError);
          throw new Error(`Failed to get user profile: ${profileError.message}`);
        }

        if (!profile?.organization_id) {
          console.error('No profile or organization found for user:', user.id);
          throw new Error('User organization not found');
        }

        console.log('Creating project with org_id:', profile.organization_id);
        
        const { data: newProject, error: createError } = await supabaseClient
          .from('monitored_domains')
          .insert({
            domain,
            display_name: display_name || domain,
            organization_id: profile.organization_id,
          })
          .select()
          .single();

        console.log('Insert result:', { newProject, createError });

        if (createError) {
          console.error('Create error:', createError);
          throw createError;
        }
        
        return new Response(JSON.stringify(newProject), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 201,
        });

      case 'DELETE':
        if (!projectId) throw new Error('Project ID required for deletion');
        
        // RLS policies will ensure user can only delete their org's domains
        const { error: deleteError } = await supabaseClient
          .from('monitored_domains')
          .delete()
          .eq('id', projectId);

        if (deleteError) throw deleteError;
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      default:
        throw new Error(`Method ${method} not allowed`);
    }
  } catch (error) {
    console.error('Projects API error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});