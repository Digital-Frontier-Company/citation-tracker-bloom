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

    const url = new URL(req.url);
    const ai_engine = url.searchParams.get('ai_engine');
    const domain_id = url.searchParams.get('domain_id');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    let query = supabaseClient
      .from('citations')
      .select(`
        *,
        monitored_domains!inner(
          domain,
          display_name,
          organization_id,
          profiles!inner(user_id)
        )
      `)
      .range(offset, offset + limit - 1)
      .order('discovered_at', { ascending: false });

    if (ai_engine && ai_engine !== 'all') {
      query = query.eq('ai_engine', ai_engine);
    }

    if (domain_id) {
      query = query.eq('domain_id', domain_id);
    }

    const { data: citations, error: getError } = await query;
    if (getError) throw getError;

    // Get total count for pagination
    let countQuery = supabaseClient
      .from('citations')
      .select('*', { count: 'exact', head: true })
      .eq('monitored_domains.profiles.user_id', user.id);

    if (ai_engine && ai_engine !== 'all') {
      countQuery = countQuery.eq('ai_engine', ai_engine);
    }

    if (domain_id) {
      countQuery = countQuery.eq('domain_id', domain_id);
    }

    const { count } = await countQuery;

    return new Response(JSON.stringify({ 
      citations: citations || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Citations API error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});