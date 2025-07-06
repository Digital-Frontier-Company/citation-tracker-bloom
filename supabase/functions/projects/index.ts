import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  );

  try {
    console.log('=== PROJECTS FUNCTION START ===');
    console.log('Method:', req.method);
    console.log('URL:', req.url);

    // Check authentication
    const authHeader = req.headers.get('Authorization');
    console.log('Auth header present:', !!authHeader);
    
    if (!authHeader) {
      console.error('No authorization header');
      return new Response(JSON.stringify({ error: 'No authorization header provided' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError) {
      console.error('Auth error:', userError);
      return new Response(JSON.stringify({ error: `Authentication failed: ${userError.message}` }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    const user = userData.user;
    if (!user) {
      console.error('No user found');
      return new Response(JSON.stringify({ error: 'User not authenticated' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    console.log('User authenticated:', user.id);

    if (req.method === 'GET') {
      console.log('Handling GET request');
      
      const { data: projects, error: getError } = await supabaseClient
        .from('monitored_domains')
        .select('*')
        .order('created_at', { ascending: false });

      if (getError) {
        console.error('Get projects error:', getError);
        return new Response(JSON.stringify({ error: getError.message }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        });
      }
      
      console.log('Projects retrieved:', projects?.length || 0);
      return new Response(JSON.stringify(projects || []), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'POST') {
      console.log('Handling POST request');
      
      // Parse request body
      let requestBody;
      try {
        const bodyText = await req.text();
        console.log('Raw body:', bodyText);
        requestBody = JSON.parse(bodyText);
        console.log('Parsed body:', requestBody);
      } catch (parseError) {
        console.error('Body parse error:', parseError);
        return new Response(JSON.stringify({ error: 'Invalid JSON in request body' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        });
      }
      
      const { domain, display_name } = requestBody;
      
      if (!domain?.trim()) {
        console.error('Domain missing or empty');
        return new Response(JSON.stringify({ error: 'Domain is required and cannot be empty' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        });
      }

      // Get user profile
      console.log('Getting user profile...');
      const { data: profile, error: profileError } = await supabaseClient
        .from('profiles')
        .select('organization_id')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        console.error('Profile error:', profileError);
        return new Response(JSON.stringify({ error: `Profile error: ${profileError.message}` }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        });
      }

      if (!profile?.organization_id) {
        console.error('No organization_id in profile:', profile);
        return new Response(JSON.stringify({ error: 'User profile incomplete - missing organization' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        });
      }

      console.log('Profile found with org_id:', profile.organization_id);

      // Create the project
      const projectData = {
        domain: domain.trim(),
        display_name: display_name?.trim() || domain.trim(),
        organization_id: profile.organization_id,
      };
      
      console.log('Creating project with data:', projectData);
      
      const { data: newProject, error: createError } = await supabaseClient
        .from('monitored_domains')
        .insert(projectData)
        .select()
        .single();

      if (createError) {
        console.error('Create error:', createError);
        
        // Handle specific database errors
        if (createError.code === '23505') {
          return new Response(JSON.stringify({ error: 'A project with this domain already exists' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          });
        }
        
        return new Response(JSON.stringify({ error: `Database error: ${createError.message}` }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        });
      }
      
      console.log('Project created successfully:', newProject);
      return new Response(JSON.stringify(newProject), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201,
      });
    }

    // Handle unsupported methods
    return new Response(JSON.stringify({ error: `Method ${req.method} not allowed` }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405,
    });

  } catch (error) {
    console.error('=== FUNCTION ERROR ===');
    console.error('Error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return new Response(JSON.stringify({ 
      error: `Server error: ${error.message}`,
      details: error.stack 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});