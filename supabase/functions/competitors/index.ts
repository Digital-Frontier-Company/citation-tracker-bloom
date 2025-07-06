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
    const domainId = url.searchParams.get('domain_id');

    switch (method) {
      case 'GET':
        // RLS policies will automatically filter to user's accessible competitors
        let query = supabaseClient
          .from('competitors')
          .select(`
            *,
            monitored_domains!inner(
              domain,
              display_name
            )
          `);

        if (domainId) {
          query = query.eq('domain_id', domainId);
        }

        const { data: competitors, error: getError } = await query
          .order('created_at', { ascending: false });

        if (getError) throw getError;
        return new Response(JSON.stringify(competitors), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'POST':
        const { competitor_domain, competitor_name, domain_id } = await req.json();
        
        const { data: newCompetitor, error: createError } = await supabaseClient
          .from('competitors')
          .insert({
            competitor_domain,
            competitor_name,
            domain_id,
          })
          .select()
          .single();

        if (createError) throw createError;
        return new Response(JSON.stringify(newCompetitor), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 201,
        });

      case 'DELETE':
        const competitorId = url.pathname.split('/').pop();
        if (!competitorId) throw new Error('Competitor ID required for deletion');
        
        // RLS policies will ensure user can only delete their org's competitors
        const { error: deleteError } = await supabaseClient
          .from('competitors')
          .delete()
          .eq('id', competitorId);

        if (deleteError) throw deleteError;
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      default:
        throw new Error(`Method ${method} not allowed`);
    }
  } catch (error) {
    console.error('Competitors API error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});