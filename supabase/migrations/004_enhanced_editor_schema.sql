-- =============================================================================
-- ENHANCED SCHEMA FOR EDITORPRO + CALCULATION ENGINE INTEGRATION
-- Migration: 004_enhanced_editor_schema.sql
-- Description: Schema alignment for EditorPro, Calculation Engine and Quiz Quest
-- =============================================================================

-- =============================================================================
-- QUIZ DEFINITIONS TABLE (Enhanced for EditorPro Integration)
-- =============================================================================

CREATE TABLE IF NOT EXISTS quiz_definitions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'Untitled Quiz',
  description TEXT,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Schema and versioning
  schema_json JSONB NOT NULL,
  schema_hash TEXT GENERATED ALWAYS AS (md5(schema_json::text)) STORED,
  engine_version TEXT DEFAULT '2.0.0',
  schema_version TEXT DEFAULT '1.0.0',
  
  -- Status and visibility
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_public BOOLEAN DEFAULT false,
  is_template BOOLEAN DEFAULT false,
  
  -- Metadata
  category TEXT DEFAULT 'general',
  tags TEXT[] DEFAULT '{}',
  thumbnail_url TEXT,
  
  -- Performance and analytics
  view_count INTEGER DEFAULT 0,
  completion_count INTEGER DEFAULT 0,
  average_score DECIMAL(5,2),
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  
  -- Constraints
  CONSTRAINT valid_schema_json CHECK (jsonb_typeof(schema_json) = 'object'),
  CONSTRAINT valid_engine_version CHECK (engine_version ~ '^[0-9]+\.[0-9]+\.[0-9]+$')
);

-- =============================================================================
-- USER RESULTS TABLE (Enhanced for Calculation Engine)
-- =============================================================================

CREATE TABLE IF NOT EXISTS user_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  funnel_id UUID REFERENCES quiz_definitions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- User information
  participant_name TEXT,
  participant_email TEXT,
  
  -- Response data
  response_data JSONB NOT NULL DEFAULT '{}',
  raw_responses JSONB NOT NULL DEFAULT '{}',
  
  -- Calculated results (from calculation engine)
  calculated_results JSONB,
  engine_version TEXT DEFAULT '2.0.0',
  calculation_metadata JSONB DEFAULT '{}',
  
  -- Primary outcome
  primary_style TEXT,
  primary_score INTEGER DEFAULT 0,
  primary_percentage DECIMAL(5,2) DEFAULT 0,
  
  -- Quality metrics
  completeness_score INTEGER DEFAULT 0,
  consistency_score INTEGER DEFAULT 0,
  confidence_score INTEGER DEFAULT 0,
  
  -- Timing and completion
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  time_taken_seconds INTEGER,
  
  -- Status tracking
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  current_step INTEGER DEFAULT 1,
  total_steps INTEGER,
  
  -- Analytics and metadata
  user_agent TEXT,
  ip_address INET,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_response_data CHECK (jsonb_typeof(response_data) = 'object'),
  CONSTRAINT valid_calculated_results CHECK (calculated_results IS NULL OR jsonb_typeof(calculated_results) = 'object'),
  CONSTRAINT valid_completion_percentage CHECK (primary_percentage >= 0 AND primary_percentage <= 100),
  CONSTRAINT valid_quality_scores CHECK (
    completeness_score >= 0 AND completeness_score <= 100 AND
    consistency_score >= 0 AND consistency_score <= 100 AND
    confidence_score >= 0 AND confidence_score <= 100
  )
);

-- =============================================================================
-- OUTCOMES TABLE (For Calculation Engine Results)
-- =============================================================================

CREATE TABLE IF NOT EXISTS outcomes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_definition_id UUID REFERENCES quiz_definitions(id) ON DELETE CASCADE,
  
  -- Outcome definition
  outcome_id TEXT NOT NULL, -- Internal ID within the quiz
  name TEXT NOT NULL,
  description TEXT,
  
  -- Conditions for matching
  conditions JSONB NOT NULL DEFAULT '[]',
  
  -- Template and content
  template_title TEXT,
  template_description TEXT,
  recommendations TEXT[] DEFAULT '{}',
  
  -- Visual and branding
  color_primary TEXT,
  color_secondary TEXT,
  image_url TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_conditions CHECK (jsonb_typeof(conditions) = 'array'),
  CONSTRAINT unique_outcome_per_quiz UNIQUE (quiz_definition_id, outcome_id)
);

-- =============================================================================
-- COMPONENT INSTANCES TABLE (EditorPro Integration)
-- =============================================================================

CREATE TABLE IF NOT EXISTS component_instances (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  funnel_id UUID REFERENCES quiz_definitions(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Component definition
  component_id TEXT NOT NULL,
  component_type TEXT NOT NULL,
  step_number INTEGER NOT NULL,
  
  -- Configuration and content
  component_data JSONB NOT NULL DEFAULT '{}',
  style_config JSONB DEFAULT '{}',
  
  -- Layout and positioning
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  
  -- Versioning
  version INTEGER DEFAULT 1,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_component_data CHECK (jsonb_typeof(component_data) = 'object'),
  CONSTRAINT valid_step_number CHECK (step_number > 0),
  CONSTRAINT unique_component_position UNIQUE (funnel_id, step_number, component_id)
);

-- =============================================================================
-- COMPONENT TYPES TABLE (EditorPro Block Registry)
-- =============================================================================

CREATE TABLE IF NOT EXISTS component_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Type definition
  type_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general',
  
  -- Schema and validation
  schema_definition JSONB NOT NULL,
  default_props JSONB DEFAULT '{}',
  
  -- UI and rendering
  icon TEXT,
  preview_url TEXT,
  is_system_type BOOLEAN DEFAULT false,
  
  -- Availability
  is_active BOOLEAN DEFAULT true,
  requires_auth BOOLEAN DEFAULT false,
  
  -- Versioning
  version TEXT DEFAULT '1.0.0',
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_schema_definition CHECK (jsonb_typeof(schema_definition) = 'object')
);

-- =============================================================================
-- CALCULATION AUDIT TABLE (For Engine Performance Tracking)
-- =============================================================================

CREATE TABLE IF NOT EXISTS calculation_audit (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Reference to calculation
  user_result_id UUID REFERENCES user_results(id) ON DELETE CASCADE,
  quiz_definition_id UUID REFERENCES quiz_definitions(id) ON DELETE CASCADE,
  
  -- Engine information
  engine_version TEXT NOT NULL,
  calculation_type TEXT DEFAULT 'standard' CHECK (calculation_type IN ('standard', 'fallback', 'manual')),
  
  -- Input data hash (for reproducibility)
  input_hash TEXT,
  
  -- Performance metrics
  execution_time_ms INTEGER,
  memory_usage_mb DECIMAL(10,2),
  
  -- Quality metrics
  data_integrity_score INTEGER CHECK (data_integrity_score >= 0 AND data_integrity_score <= 100),
  validation_errors JSONB DEFAULT '[]',
  warnings JSONB DEFAULT '[]',
  
  -- Results summary
  primary_outcome TEXT,
  confidence_level DECIMAL(5,2),
  
  -- Audit fields
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_validation_errors CHECK (jsonb_typeof(validation_errors) = 'array'),
  CONSTRAINT valid_warnings CHECK (jsonb_typeof(warnings) = 'array')
);

-- =============================================================================
-- INDEXES FOR OPTIMAL PERFORMANCE
-- =============================================================================

-- Quiz Definitions indexes
CREATE INDEX IF NOT EXISTS idx_quiz_definitions_owner_id ON quiz_definitions(owner_id);
CREATE INDEX IF NOT EXISTS idx_quiz_definitions_schema_hash ON quiz_definitions(schema_hash);
CREATE INDEX IF NOT EXISTS idx_quiz_definitions_status ON quiz_definitions(status);
CREATE INDEX IF NOT EXISTS idx_quiz_definitions_is_public ON quiz_definitions(is_public);
CREATE INDEX IF NOT EXISTS idx_quiz_definitions_category ON quiz_definitions(category);
CREATE INDEX IF NOT EXISTS idx_quiz_definitions_created_at ON quiz_definitions(created_at);
CREATE INDEX IF NOT EXISTS idx_quiz_definitions_updated_at ON quiz_definitions(updated_at);

-- User Results indexes
CREATE INDEX IF NOT EXISTS idx_user_results_session_id ON user_results(session_id);
CREATE INDEX IF NOT EXISTS idx_user_results_funnel_id ON user_results(funnel_id);
CREATE INDEX IF NOT EXISTS idx_user_results_user_id ON user_results(user_id);
CREATE INDEX IF NOT EXISTS idx_user_results_status ON user_results(status);
CREATE INDEX IF NOT EXISTS idx_user_results_primary_style ON user_results(primary_style);
CREATE INDEX IF NOT EXISTS idx_user_results_completed_at ON user_results(completed_at);
CREATE INDEX IF NOT EXISTS idx_user_results_created_at ON user_results(created_at);

-- Outcomes indexes
CREATE INDEX IF NOT EXISTS idx_outcomes_quiz_definition_id ON outcomes(quiz_definition_id);
CREATE INDEX IF NOT EXISTS idx_outcomes_outcome_id ON outcomes(outcome_id);

-- Component Instances indexes
CREATE INDEX IF NOT EXISTS idx_component_instances_funnel_id ON component_instances(funnel_id);
CREATE INDEX IF NOT EXISTS idx_component_instances_owner_id ON component_instances(owner_id);
CREATE INDEX IF NOT EXISTS idx_component_instances_step_number ON component_instances(step_number);
CREATE INDEX IF NOT EXISTS idx_component_instances_component_type ON component_instances(component_type);
CREATE INDEX IF NOT EXISTS idx_component_instances_is_active ON component_instances(is_active);

-- Component Types indexes
CREATE INDEX IF NOT EXISTS idx_component_types_type_id ON component_types(type_id);
CREATE INDEX IF NOT EXISTS idx_component_types_category ON component_types(category);
CREATE INDEX IF NOT EXISTS idx_component_types_is_active ON component_types(is_active);

-- Calculation Audit indexes
CREATE INDEX IF NOT EXISTS idx_calculation_audit_user_result_id ON calculation_audit(user_result_id);
CREATE INDEX IF NOT EXISTS idx_calculation_audit_quiz_definition_id ON calculation_audit(quiz_definition_id);
CREATE INDEX IF NOT EXISTS idx_calculation_audit_engine_version ON calculation_audit(engine_version);
CREATE INDEX IF NOT EXISTS idx_calculation_audit_calculated_at ON calculation_audit(calculated_at);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE quiz_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE component_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE component_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculation_audit ENABLE ROW LEVEL SECURITY;

-- Quiz Definitions policies
CREATE POLICY "quiz_definitions_select_policy" ON quiz_definitions
  FOR SELECT USING (
    is_public = true OR 
    owner_id = auth.uid() OR
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "quiz_definitions_insert_policy" ON quiz_definitions
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND 
    owner_id = auth.uid()
  );

CREATE POLICY "quiz_definitions_update_policy" ON quiz_definitions
  FOR UPDATE USING (
    owner_id = auth.uid() OR
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "quiz_definitions_delete_policy" ON quiz_definitions
  FOR DELETE USING (
    owner_id = auth.uid() OR
    auth.jwt() ->> 'role' = 'admin'
  );

-- User Results policies
CREATE POLICY "user_results_select_policy" ON user_results
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM quiz_definitions qd 
      WHERE qd.id = user_results.funnel_id 
      AND qd.owner_id = auth.uid()
    ) OR
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "user_results_insert_policy" ON user_results
  FOR INSERT WITH CHECK (true); -- Allow anonymous submissions

CREATE POLICY "user_results_update_policy" ON user_results
  FOR UPDATE USING (
    user_id = auth.uid() OR
    user_id IS NULL OR -- Allow updates to anonymous submissions
    EXISTS (
      SELECT 1 FROM quiz_definitions qd 
      WHERE qd.id = user_results.funnel_id 
      AND qd.owner_id = auth.uid()
    )
  );

-- Outcomes policies
CREATE POLICY "outcomes_select_policy" ON outcomes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM quiz_definitions qd 
      WHERE qd.id = outcomes.quiz_definition_id 
      AND (qd.is_public = true OR qd.owner_id = auth.uid())
    )
  );

CREATE POLICY "outcomes_insert_policy" ON outcomes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM quiz_definitions qd 
      WHERE qd.id = outcomes.quiz_definition_id 
      AND qd.owner_id = auth.uid()
    )
  );

CREATE POLICY "outcomes_update_policy" ON outcomes
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM quiz_definitions qd 
      WHERE qd.id = outcomes.quiz_definition_id 
      AND qd.owner_id = auth.uid()
    )
  );

-- Component Instances policies
CREATE POLICY "component_instances_select_policy" ON component_instances
  FOR SELECT USING (
    owner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM quiz_definitions qd 
      WHERE qd.id = component_instances.funnel_id 
      AND qd.is_public = true
    )
  );

CREATE POLICY "component_instances_insert_policy" ON component_instances
  FOR INSERT WITH CHECK (
    owner_id = auth.uid()
  );

CREATE POLICY "component_instances_update_policy" ON component_instances
  FOR UPDATE USING (
    owner_id = auth.uid()
  );

CREATE POLICY "component_instances_delete_policy" ON component_instances
  FOR DELETE USING (
    owner_id = auth.uid()
  );

-- Component Types policies (read-only for most users)
CREATE POLICY "component_types_select_policy" ON component_types
  FOR SELECT USING (is_active = true);

CREATE POLICY "component_types_insert_policy" ON component_types
  FOR INSERT WITH CHECK (
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "component_types_update_policy" ON component_types
  FOR UPDATE USING (
    auth.jwt() ->> 'role' = 'admin'
  );

-- Calculation Audit policies (admin and quiz owners only)
CREATE POLICY "calculation_audit_select_policy" ON calculation_audit
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM quiz_definitions qd 
      WHERE qd.id = calculation_audit.quiz_definition_id 
      AND qd.owner_id = auth.uid()
    ) OR
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "calculation_audit_insert_policy" ON calculation_audit
  FOR INSERT WITH CHECK (true); -- System can insert audit records

-- =============================================================================
-- TRIGGERS AND FUNCTIONS
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_quiz_definitions_updated_at
  BEFORE UPDATE ON quiz_definitions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_user_results_updated_at
  BEFORE UPDATE ON user_results
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_outcomes_updated_at
  BEFORE UPDATE ON outcomes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_component_instances_updated_at
  BEFORE UPDATE ON component_instances
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_component_types_updated_at
  BEFORE UPDATE ON component_types
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Function to update quiz statistics
CREATE OR REPLACE FUNCTION update_quiz_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update completion count when a result is completed
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    UPDATE quiz_definitions 
    SET 
      completion_count = completion_count + 1,
      average_score = (
        SELECT AVG(primary_percentage) 
        FROM user_results 
        WHERE funnel_id = NEW.funnel_id 
        AND status = 'completed'
        AND primary_percentage IS NOT NULL
      )
    WHERE id = NEW.funnel_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update quiz stats
CREATE TRIGGER update_quiz_stats_trigger
  AFTER UPDATE ON user_results
  FOR EACH ROW
  EXECUTE FUNCTION update_quiz_stats();

-- =============================================================================
-- USEFUL VIEWS
-- =============================================================================

-- Quiz Statistics View
CREATE OR REPLACE VIEW quiz_statistics AS
SELECT 
  qd.id,
  qd.title,
  qd.owner_id,
  qd.status,
  qd.view_count,
  qd.completion_count,
  qd.average_score,
  COUNT(ur.id) as total_attempts,
  COUNT(ur.id) FILTER (WHERE ur.status = 'completed') as completed_attempts,
  COUNT(ur.id) FILTER (WHERE ur.status = 'in_progress') as in_progress_attempts,
  COUNT(ur.id) FILTER (WHERE ur.status = 'abandoned') as abandoned_attempts,
  AVG(ur.time_taken_seconds) FILTER (WHERE ur.status = 'completed') as avg_completion_time,
  MAX(ur.completed_at) as last_completion,
  qd.created_at,
  qd.updated_at
FROM quiz_definitions qd
LEFT JOIN user_results ur ON qd.id = ur.funnel_id
GROUP BY qd.id, qd.title, qd.owner_id, qd.status, qd.view_count, 
         qd.completion_count, qd.average_score, qd.created_at, qd.updated_at;

-- Results Summary View
CREATE OR REPLACE VIEW results_summary AS
SELECT 
  ur.id,
  ur.session_id,
  ur.funnel_id,
  qd.title as quiz_title,
  ur.participant_name,
  ur.primary_style,
  ur.primary_percentage,
  ur.completeness_score,
  ur.consistency_score,
  ur.confidence_score,
  ur.status,
  ur.time_taken_seconds,
  ur.completed_at,
  ur.engine_version
FROM user_results ur
JOIN quiz_definitions qd ON ur.funnel_id = qd.id
WHERE ur.status = 'completed';

-- =============================================================================
-- SAMPLE DATA FOR COMPONENT TYPES
-- =============================================================================

INSERT INTO component_types (type_id, name, description, category, schema_definition, default_props, icon, is_system_type) VALUES
('quiz-question', 'Quiz Question', 'Interactive quiz question with multiple choice options', 'quiz', 
 '{"type": "object", "properties": {"question": {"type": "string"}, "options": {"type": "array"}}}', 
 '{"question": "Sample question?", "options": []}', '❓', true),
 
('quiz-result', 'Quiz Result', 'Display calculated quiz results and recommendations', 'quiz',
 '{"type": "object", "properties": {"template": {"type": "string"}, "showRecommendations": {"type": "boolean"}}}',
 '{"template": "default", "showRecommendations": true}', '🎯', true),
 
('text-block', 'Text Block', 'Simple text content block', 'content',
 '{"type": "object", "properties": {"text": {"type": "string"}, "style": {"type": "object"}}}',
 '{"text": "Enter your text here", "style": {}}', '📝', true),
 
('image-block', 'Image Block', 'Image display with optional caption', 'media',
 '{"type": "object", "properties": {"src": {"type": "string"}, "alt": {"type": "string"}, "caption": {"type": "string"}}}',
 '{"src": "", "alt": "", "caption": ""}', '🖼️', true),
 
('button-block', 'Button Block', 'Interactive button for navigation or actions', 'interactive',
 '{"type": "object", "properties": {"text": {"type": "string"}, "action": {"type": "string"}, "style": {"type": "object"}}}',
 '{"text": "Click me", "action": "next", "style": {}}', '🔘', true)

ON CONFLICT (type_id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  schema_definition = EXCLUDED.schema_definition,
  updated_at = NOW();

-- =============================================================================
-- COMMENTS AND DOCUMENTATION
-- =============================================================================

COMMENT ON TABLE quiz_definitions IS 'Enhanced quiz definitions for EditorPro integration with calculation engine support';
COMMENT ON TABLE user_results IS 'User quiz results with enhanced calculation engine metadata and quality metrics';
COMMENT ON TABLE outcomes IS 'Outcome definitions for calculation engine result matching and templating';
COMMENT ON TABLE component_instances IS 'EditorPro component instances linked to quiz definitions';
COMMENT ON TABLE component_types IS 'Registry of available component types for EditorPro';
COMMENT ON TABLE calculation_audit IS 'Audit trail for calculation engine performance and quality tracking';

COMMENT ON COLUMN quiz_definitions.schema_hash IS 'MD5 hash of schema_json for versioning and change detection';
COMMENT ON COLUMN quiz_definitions.engine_version IS 'Version of calculation engine this quiz is compatible with';
COMMENT ON COLUMN user_results.calculated_results IS 'Full results from calculation engine including breakdown and metadata';
COMMENT ON COLUMN user_results.calculation_metadata IS 'Metadata from calculation engine execution';
COMMENT ON COLUMN outcomes.conditions IS 'JSON array of conditions for outcome matching';

-- =============================================================================
-- FINAL VALIDATION
-- =============================================================================

-- Verify all tables exist
DO $$
DECLARE
    missing_tables TEXT[];
    table_name TEXT;
BEGIN
    FOR table_name IN VALUES ('quiz_definitions'), ('user_results'), ('outcomes'), ('component_instances'), ('component_types'), ('calculation_audit') LOOP
        IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = table_name AND table_schema = 'public') THEN
            missing_tables := array_append(missing_tables, table_name);
        END IF;
    END LOOP;
    
    IF array_length(missing_tables, 1) > 0 THEN
        RAISE EXCEPTION 'Missing tables: %', array_to_string(missing_tables, ', ');
    ELSE
        RAISE NOTICE 'Schema migration completed successfully. All tables created.';
    END IF;
END $$;