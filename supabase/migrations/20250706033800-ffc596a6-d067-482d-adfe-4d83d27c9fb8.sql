-- Citations and monitoring infrastructure
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  domain VARCHAR(255),
  subscription_tier VARCHAR(50) NOT NULL DEFAULT 'starter',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  display_name VARCHAR(255),
  avatar_url TEXT,
  role VARCHAR(50) DEFAULT 'member',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS monitored_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  domain VARCHAR(255) NOT NULL,
  display_name VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  monitoring_frequency VARCHAR(20) DEFAULT 'daily',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(organization_id, domain)
);

CREATE TABLE IF NOT EXISTS monitored_keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id UUID NOT NULL REFERENCES monitored_domains(id) ON DELETE CASCADE,
  keyword TEXT NOT NULL,
  category VARCHAR(100),
  priority INTEGER DEFAULT 5,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(domain_id, keyword)
);

CREATE TABLE IF NOT EXISTS citations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id UUID NOT NULL REFERENCES monitored_domains(id) ON DELETE CASCADE,
  keyword_id UUID REFERENCES monitored_keywords(id) ON DELETE SET NULL,
  query TEXT NOT NULL,
  ai_engine VARCHAR(50) NOT NULL,
  citation_type VARCHAR(50) NOT NULL,
  citation_text TEXT,
  source_url TEXT,
  position INTEGER,
  total_sources INTEGER,
  context_before TEXT,
  context_after TEXT,
  authority_score DECIMAL(5,2),
  relevance_score DECIMAL(5,2),
  context_score DECIMAL(5,2),
  position_score DECIMAL(5,2),
  quality_score DECIMAL(5,2) GENERATED ALWAYS AS (authority_score + relevance_score + context_score + position_score) STORED,
  confidence DECIMAL(5,2),
  is_verified BOOLEAN DEFAULT false,
  competitor_domains TEXT[],
  market_share DECIMAL(5,2),
  discovered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  citation_timestamp TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS competitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id UUID NOT NULL REFERENCES monitored_domains(id) ON DELETE CASCADE,
  competitor_domain VARCHAR(255) NOT NULL,
  competitor_name VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(domain_id, competitor_domain)
);

CREATE TABLE IF NOT EXISTS traffic_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id UUID NOT NULL REFERENCES monitored_domains(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  organic_sessions INTEGER DEFAULT 0,
  brand_searches INTEGER DEFAULT 0,
  direct_sessions INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  leads INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  source VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(domain_id, date, source)
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  domain_id UUID REFERENCES monitored_domains(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  config JSONB NOT NULL,
  schedule VARCHAR(50),
  last_generated TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitored_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitored_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE citations ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE traffic_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own organization" ON organizations FOR SELECT USING (id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their organization domains" ON monitored_domains FOR SELECT USING (organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can manage their organization domains" ON monitored_domains FOR ALL USING (organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can view their domain keywords" ON monitored_keywords FOR SELECT USING (domain_id IN (SELECT id FROM monitored_domains WHERE organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid())));
CREATE POLICY "Users can manage their domain keywords" ON monitored_keywords FOR ALL USING (domain_id IN (SELECT id FROM monitored_domains WHERE organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Users can view their domain citations" ON citations FOR SELECT USING (domain_id IN (SELECT id FROM monitored_domains WHERE organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid())));
CREATE POLICY "Users can manage their domain citations" ON citations FOR ALL USING (domain_id IN (SELECT id FROM monitored_domains WHERE organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Users can view their domain competitors" ON competitors FOR SELECT USING (domain_id IN (SELECT id FROM monitored_domains WHERE organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid())));
CREATE POLICY "Users can manage their domain competitors" ON competitors FOR ALL USING (domain_id IN (SELECT id FROM monitored_domains WHERE organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Users can view their domain traffic" ON traffic_data FOR SELECT USING (domain_id IN (SELECT id FROM monitored_domains WHERE organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid())));
CREATE POLICY "Users can manage their domain traffic" ON traffic_data FOR ALL USING (domain_id IN (SELECT id FROM monitored_domains WHERE organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Users can view their notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update their notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can view their organization reports" ON reports FOR SELECT USING (organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can manage their organization reports" ON reports FOR ALL USING (organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid()));

-- Indexes for performance
CREATE INDEX idx_citations_domain_time ON citations (domain_id, discovered_at DESC);
CREATE INDEX idx_citations_quality_time ON citations (quality_score DESC, discovered_at DESC);
CREATE INDEX idx_citations_engine_time ON citations (ai_engine, discovered_at DESC);
CREATE INDEX idx_notifications_user_time ON notifications (user_id, created_at DESC);
CREATE INDEX idx_profiles_user ON profiles (user_id);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_citations_updated_at BEFORE UPDATE ON citations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();