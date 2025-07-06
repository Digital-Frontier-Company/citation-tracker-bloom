-- ============================================================================
-- COMPREHENSIVE RLS POLICY SETUP FOR CITATIONTRACKER PRO
-- ============================================================================

-- First, drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can manage their domain citations" ON public.citations;
DROP POLICY IF EXISTS "Users can view their domain citations" ON public.citations;
DROP POLICY IF EXISTS "Users can manage their domain competitors" ON public.competitors;
DROP POLICY IF EXISTS "Users can view their domain competitors" ON public.competitors;
DROP POLICY IF EXISTS "Users can manage their organization domains" ON public.monitored_domains;
DROP POLICY IF EXISTS "Users can view their organization domains" ON public.monitored_domains;
DROP POLICY IF EXISTS "Users can manage their domain keywords" ON public.monitored_keywords;
DROP POLICY IF EXISTS "Users can view their domain keywords" ON public.monitored_keywords;
DROP POLICY IF EXISTS "Users can update their notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can view their notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can view their own organization" ON public.organizations;
DROP POLICY IF EXISTS "Enable read access for users to their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for users to create their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users to update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can manage their organization reports" ON public.reports;
DROP POLICY IF EXISTS "Users can view their organization reports" ON public.reports;
DROP POLICY IF EXISTS "Users can manage their domain traffic" ON public.traffic_data;
DROP POLICY IF EXISTS "Users can view their domain traffic" ON public.traffic_data;

-- ============================================================================
-- PROFILES TABLE POLICIES
-- ============================================================================
CREATE POLICY "profiles_select_own" ON public.profiles
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "profiles_insert_own" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "profiles_update_own" ON public.profiles
FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================================
-- ORGANIZATIONS TABLE POLICIES
-- ============================================================================
CREATE POLICY "organizations_select_member" ON public.organizations
FOR SELECT USING (
  id IN (
    SELECT organization_id FROM public.profiles 
    WHERE user_id = auth.uid()
  )
);

-- Only allow reading organizations, not modifying (admin-controlled)

-- ============================================================================
-- MONITORED_DOMAINS TABLE POLICIES  
-- ============================================================================
CREATE POLICY "domains_select_org_member" ON public.monitored_domains
FOR SELECT USING (
  organization_id IN (
    SELECT organization_id FROM public.profiles 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "domains_insert_org_member" ON public.monitored_domains
FOR INSERT WITH CHECK (
  organization_id IN (
    SELECT organization_id FROM public.profiles 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "domains_update_org_member" ON public.monitored_domains
FOR UPDATE USING (
  organization_id IN (
    SELECT organization_id FROM public.profiles 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "domains_delete_org_member" ON public.monitored_domains
FOR DELETE USING (
  organization_id IN (
    SELECT organization_id FROM public.profiles 
    WHERE user_id = auth.uid()
  )
);

-- ============================================================================
-- MONITORED_KEYWORDS TABLE POLICIES
-- ============================================================================
CREATE POLICY "keywords_select_org_member" ON public.monitored_keywords
FOR SELECT USING (
  domain_id IN (
    SELECT md.id FROM public.monitored_domains md
    JOIN public.profiles p ON md.organization_id = p.organization_id
    WHERE p.user_id = auth.uid()
  )
);

CREATE POLICY "keywords_insert_org_member" ON public.monitored_keywords
FOR INSERT WITH CHECK (
  domain_id IN (
    SELECT md.id FROM public.monitored_domains md
    JOIN public.profiles p ON md.organization_id = p.organization_id
    WHERE p.user_id = auth.uid()
  )
);

CREATE POLICY "keywords_update_org_member" ON public.monitored_keywords
FOR UPDATE USING (
  domain_id IN (
    SELECT md.id FROM public.monitored_domains md
    JOIN public.profiles p ON md.organization_id = p.organization_id
    WHERE p.user_id = auth.uid()
  )
);

CREATE POLICY "keywords_delete_org_member" ON public.monitored_keywords
FOR DELETE USING (
  domain_id IN (
    SELECT md.id FROM public.monitored_domains md
    JOIN public.profiles p ON md.organization_id = p.organization_id
    WHERE p.user_id = auth.uid()
  )
);

-- ============================================================================
-- COMPETITORS TABLE POLICIES
-- ============================================================================
CREATE POLICY "competitors_select_org_member" ON public.competitors
FOR SELECT USING (
  domain_id IN (
    SELECT md.id FROM public.monitored_domains md
    JOIN public.profiles p ON md.organization_id = p.organization_id
    WHERE p.user_id = auth.uid()
  )
);

CREATE POLICY "competitors_insert_org_member" ON public.competitors
FOR INSERT WITH CHECK (
  domain_id IN (
    SELECT md.id FROM public.monitored_domains md
    JOIN public.profiles p ON md.organization_id = p.organization_id
    WHERE p.user_id = auth.uid()
  )
);

CREATE POLICY "competitors_update_org_member" ON public.competitors
FOR UPDATE USING (
  domain_id IN (
    SELECT md.id FROM public.monitored_domains md
    JOIN public.profiles p ON md.organization_id = p.organization_id
    WHERE p.user_id = auth.uid()
  )
);

CREATE POLICY "competitors_delete_org_member" ON public.competitors
FOR DELETE USING (
  domain_id IN (
    SELECT md.id FROM public.monitored_domains md
    JOIN public.profiles p ON md.organization_id = p.organization_id
    WHERE p.user_id = auth.uid()
  )
);

-- ============================================================================
-- CITATIONS TABLE POLICIES
-- ============================================================================
CREATE POLICY "citations_select_org_member" ON public.citations
FOR SELECT USING (
  domain_id IN (
    SELECT md.id FROM public.monitored_domains md
    JOIN public.profiles p ON md.organization_id = p.organization_id
    WHERE p.user_id = auth.uid()
  )
);

CREATE POLICY "citations_insert_org_member" ON public.citations
FOR INSERT WITH CHECK (
  domain_id IN (
    SELECT md.id FROM public.monitored_domains md
    JOIN public.profiles p ON md.organization_id = p.organization_id
    WHERE p.user_id = auth.uid()
  )
);

CREATE POLICY "citations_update_org_member" ON public.citations
FOR UPDATE USING (
  domain_id IN (
    SELECT md.id FROM public.monitored_domains md
    JOIN public.profiles p ON md.organization_id = p.organization_id
    WHERE p.user_id = auth.uid()
  )
);

CREATE POLICY "citations_delete_org_member" ON public.citations
FOR DELETE USING (
  domain_id IN (
    SELECT md.id FROM public.monitored_domains md
    JOIN public.profiles p ON md.organization_id = p.organization_id
    WHERE p.user_id = auth.uid()
  )
);

-- ============================================================================
-- TRAFFIC_DATA TABLE POLICIES
-- ============================================================================
CREATE POLICY "traffic_select_org_member" ON public.traffic_data
FOR SELECT USING (
  domain_id IN (
    SELECT md.id FROM public.monitored_domains md
    JOIN public.profiles p ON md.organization_id = p.organization_id
    WHERE p.user_id = auth.uid()
  )
);

CREATE POLICY "traffic_insert_org_member" ON public.traffic_data
FOR INSERT WITH CHECK (
  domain_id IN (
    SELECT md.id FROM public.monitored_domains md
    JOIN public.profiles p ON md.organization_id = p.organization_id
    WHERE p.user_id = auth.uid()
  )
);

CREATE POLICY "traffic_update_org_member" ON public.traffic_data
FOR UPDATE USING (
  domain_id IN (
    SELECT md.id FROM public.monitored_domains md
    JOIN public.profiles p ON md.organization_id = p.organization_id
    WHERE p.user_id = auth.uid()
  )
);

CREATE POLICY "traffic_delete_org_member" ON public.traffic_data
FOR DELETE USING (
  domain_id IN (
    SELECT md.id FROM public.monitored_domains md
    JOIN public.profiles p ON md.organization_id = p.organization_id
    WHERE p.user_id = auth.uid()
  )
);

-- ============================================================================
-- REPORTS TABLE POLICIES
-- ============================================================================
CREATE POLICY "reports_select_org_member" ON public.reports
FOR SELECT USING (
  organization_id IN (
    SELECT organization_id FROM public.profiles 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "reports_insert_org_member" ON public.reports
FOR INSERT WITH CHECK (
  organization_id IN (
    SELECT organization_id FROM public.profiles 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "reports_update_org_member" ON public.reports
FOR UPDATE USING (
  organization_id IN (
    SELECT organization_id FROM public.profiles 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "reports_delete_org_member" ON public.reports
FOR DELETE USING (
  organization_id IN (
    SELECT organization_id FROM public.profiles 
    WHERE user_id = auth.uid()
  )
);

-- ============================================================================
-- NOTIFICATIONS TABLE POLICIES
-- ============================================================================
CREATE POLICY "notifications_select_own" ON public.notifications
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "notifications_update_own" ON public.notifications
FOR UPDATE USING (user_id = auth.uid());

-- Notifications are typically created by system/admin, so no insert policy for users
-- Users typically don't delete notifications, just mark as read

-- ============================================================================
-- SUMMARY
-- ============================================================================
-- All policies follow the principle:
-- 1. Users can only access data from their organization
-- 2. Profiles: users can only manage their own profile
-- 3. Organizations: users can only read their own organization
-- 4. Domain-related data: access via organization membership
-- 5. Notifications: personal to each user
-- 6. All policies are named consistently for easy identification