import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const dateRange = url.searchParams.get('dateRange') || 'last_30_days';
    const projectId = url.searchParams.get('projectId');

    // Validate authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: { message: 'Unauthorized: Missing or invalid token' } }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // For now, return the mock data structure
    // In a real implementation, this would query the database
    const dashboardData = {
      data: {
        lastUpdatedAt: new Date().toISOString(),
        kpis: {
          totalCitations: {
            value: 248,
            change: 0.12,
            changeDirection: "up"
          },
          shareOfVoice: {
            value: 0.42,
            change: 0.08,
            changeDirection: "up"
          },
          trafficFromCitations: {
            value: 5400,
            change: 0.24,
            changeDirection: "up"
          },
          citationQualityScore: {
            value: 86,
            change: -3,
            changeDirection: "down"
          }
        },
        performanceTrends: {
          citations: [
            { date: "2025-01-01", value: 20 },
            { date: "2025-01-08", value: 42 },
            { date: "2025-01-15", value: 35 },
            { date: "2025-01-22", value: 45 },
            { date: "2025-01-29", value: 60 },
            { date: "2025-02-05", value: 75 },
            { date: "2025-02-12", value: 82 }
          ],
          traffic: [
            { date: "2025-01-01", value: 800 },
            { date: "2025-01-08", value: 1500 },
            { date: "2025-01-15", value: 1200 },
            { date: "2025-01-22", value: 1800 },
            { date: "2025-01-29", value: 2500 },
            { date: "2025-02-05", value: 4300 },
            { date: "2025-02-12", value: 5400 }
          ],
          conversions: [
            { date: "2025-01-01", value: 5 },
            { date: "2025-01-08", value: 12 },
            { date: "2025-01-15", value: 9 },
            { date: "2025-01-22", value: 15 },
            { date: "2025-01-29", value: 22 },
            { date: "2025-02-05", value: 31 },
            { date: "2025-02-12", value: 38 }
          ]
        },
        recentActivity: [
          {
            id: "evt_1",
            type: "new_citation",
            title: "New citation detected",
            description: "'How to Optimize Content for AI Search' on Google SGE",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
          },
          {
            id: "evt_2",
            type: "competitor_alert",
            title: "Competitor alert",
            description: "TechInsider gained 5 new citations for 'AI SEO'",
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() // 4 hours ago
          },
          {
            id: "evt_3",
            type: "traffic_increase",
            title: "Traffic increase detected",
            description: "+32% traffic from UX Pilot citations",
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() // 6 hours ago
          },
          {
            id: "evt_4",
            type: "new_source",
            title: "New AI source added",
            description: "Now tracking citations on Perplexity.ai",
            timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() // 12 hours ago
          },
          {
            id: "evt_5",
            type: "citation_lost",
            title: "Citation lost",
            description: "'AI Marketing Guide' no longer cited on UX Pilot",
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 24 hours ago
          }
        ]
      }
    };

    return new Response(
      JSON.stringify(dashboardData),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Dashboard API Error:', error);
    return new Response(
      JSON.stringify({ error: { message: 'An unexpected error occurred while fetching dashboard data.' } }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
})