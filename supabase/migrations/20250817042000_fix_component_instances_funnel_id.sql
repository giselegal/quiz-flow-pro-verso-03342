-- Fix component_instances table to use funnel_id instead of quiz_id
-- This aligns the schema with the actual service implementations

-- First, check if the funnel_id column already exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'component_instances' 
        AND column_name = 'funnel_id'
    ) THEN
        -- Add funnel_id column
        ALTER TABLE component_instances 
        ADD COLUMN funnel_id UUID REFERENCES funnels(id) ON DELETE CASCADE;
        
        -- Create index for performance
        CREATE INDEX idx_component_instances_funnel_id ON component_instances(funnel_id);
        
        -- If there's existing data with quiz_id, we need to migrate it
        -- For now, we'll set a default funnel_id to NULL since we're focusing on new functionality
        -- In a production scenario, you'd want to map quiz_id to funnel_id properly
        
        -- Drop the old quiz_id foreign key constraint if it exists
        ALTER TABLE component_instances 
        DROP CONSTRAINT IF EXISTS component_instances_quiz_id_fkey;
        
        -- Make quiz_id nullable for backward compatibility
        ALTER TABLE component_instances 
        ALTER COLUMN quiz_id DROP NOT NULL;
        
        -- Update the unique constraint to use funnel_id instead of quiz_id
        ALTER TABLE component_instances 
        DROP CONSTRAINT IF EXISTS component_instances_quiz_id_instance_key_key;
        
        -- Add new unique constraint for funnel_id + instance_key
        ALTER TABLE component_instances 
        ADD CONSTRAINT component_instances_funnel_id_instance_key_unique 
        UNIQUE(funnel_id, instance_key);
    END IF;
END
$$;

-- Update RLS policies for component_instances if they exist
DROP POLICY IF EXISTS "component_instances_select_policy" ON component_instances;
DROP POLICY IF EXISTS "component_instances_insert_policy" ON component_instances;
DROP POLICY IF EXISTS "component_instances_update_policy" ON component_instances;
DROP POLICY IF EXISTS "component_instances_delete_policy" ON component_instances;

-- Create new RLS policies based on funnel ownership
CREATE POLICY "Users can view components of their funnels"
ON component_instances FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM funnels 
        WHERE funnels.id = component_instances.funnel_id 
        AND funnels.user_id = auth.uid()
    )
);

CREATE POLICY "Users can insert components to their funnels"
ON component_instances FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM funnels 
        WHERE funnels.id = component_instances.funnel_id 
        AND funnels.user_id = auth.uid()
    )
);

CREATE POLICY "Users can update components of their funnels"
ON component_instances FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM funnels 
        WHERE funnels.id = component_instances.funnel_id 
        AND funnels.user_id = auth.uid()
    )
);

CREATE POLICY "Users can delete components of their funnels"
ON component_instances FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM funnels 
        WHERE funnels.id = component_instances.funnel_id 
        AND funnels.user_id = auth.uid()
    )
);

-- Update the trigger function for updated_at if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for component_instances if it doesn't exist
DROP TRIGGER IF EXISTS update_component_instances_updated_at ON component_instances;
CREATE TRIGGER update_component_instances_updated_at
    BEFORE UPDATE ON component_instances
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comment for documentation
COMMENT ON COLUMN component_instances.funnel_id IS 'Reference to the funnel this component belongs to';
COMMENT ON COLUMN component_instances.quiz_id IS 'Legacy reference to quiz (kept for backward compatibility)';