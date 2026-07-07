/*
# RLS Policy Documentation for Single-Tenant App

## Purpose
This migration re-creates RLS policies with documentation comments in the SQL and table-level comments, clarifying that this application is **single-tenant** (no user authentication). The `USING (true)` policies are intentional because all data is shared across the single app instance.

## Security Design
- This app has NO user authentication (no sign-in screen)
- All data is intentionally shared/public within the single app instance
- The anon key is used by the frontend for all operations
- `USING (true)` is ACCEPTABLE here because there is no `user_id` to check against
- This follows the single-tenant pattern from the database skill

## Changes
- Re-creates policies with documented intent for each table
- Adds table-level comments explaining the security model
*/

-- Re-create app_state policies with documentation
DROP POLICY IF EXISTS "anon_select_app_state" ON app_state;
CREATE POLICY "anon_select_app_state" 
ON app_state FOR SELECT
TO anon, authenticated 
USING (true); -- Single-tenant: all rows are shared, no user_id to filter

DROP POLICY IF EXISTS "anon_insert_app_state" ON app_state;
CREATE POLICY "anon_insert_app_state" 
ON app_state FOR INSERT
TO anon, authenticated 
WITH CHECK (true); -- Single-tenant: any app instance can initialize state

DROP POLICY IF EXISTS "anon_update_app_state" ON app_state;
CREATE POLICY "anon_update_app_state" 
ON app_state FOR UPDATE
TO anon, authenticated 
USING (true) -- Single-tenant: shared state, any instance can update
WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_app_state" ON app_state;
CREATE POLICY "anon_delete_app_state" 
ON app_state FOR DELETE
TO anon, authenticated 
USING (true); -- Single-tenant: shared state, any instance can reset


-- Re-create activity_completions policies with documentation
DROP POLICY IF EXISTS "anon_select_completions" ON activity_completions;
CREATE POLICY "anon_select_completions" 
ON activity_completions FOR SELECT
TO anon, authenticated 
USING (true); -- Single-tenant: completion history is shared

DROP POLICY IF EXISTS "anon_insert_completions" ON activity_completions;
CREATE POLICY "anon_insert_completions" 
ON activity_completions FOR INSERT
TO anon, authenticated 
WITH CHECK (true); -- Single-tenant: any instance can mark activity done

DROP POLICY IF EXISTS "anon_update_completions" ON activity_completions;
CREATE POLICY "anon_update_completions" 
ON activity_completions FOR UPDATE
TO anon, authenticated 
USING (true) -- Single-tenant: update completion status
WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_completions" ON activity_completions;
CREATE POLICY "anon_delete_completions" 
ON activity_completions FOR DELETE
TO anon, authenticated 
USING (true); -- Single-tenant: can remove completion records


-- Re-create quiz_answers policies with documentation
DROP POLICY IF EXISTS "anon_select_quiz_answers" ON quiz_answers;
CREATE POLICY "anon_select_quiz_answers" 
ON quiz_answers FOR SELECT
TO anon, authenticated 
USING (true); -- Single-tenant: quiz answer history is shared

DROP POLICY IF EXISTS "anon_insert_quiz_answers" ON quiz_answers;
CREATE POLICY "anon_insert_quiz_answers" 
ON quiz_answers FOR INSERT
TO anon, authenticated 
WITH CHECK (true); -- Single-tenant: save quiz answers

DROP POLICY IF EXISTS "anon_update_quiz_answers" ON quiz_answers;
CREATE POLICY "anon_update_quiz_answers" 
ON quiz_answers FOR UPDATE
TO anon, authenticated 
USING (true) -- Single-tenant: update answers
WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_quiz_answers" ON quiz_answers;
CREATE POLICY "anon_delete_quiz_answers" 
ON quiz_answers FOR DELETE
TO anon, authenticated 
USING (true); -- Single-tenant: can clear answer history


-- Add table comments documenting the security model
COMMENT ON TABLE app_state IS 'Single-tenant app state - no user_id, intentionally shared across all sessions. RLS allows anon access by design.';
COMMENT ON TABLE activity_completions IS 'Single-tenant completion tracking - no user_id, intentionally shared. RLS allows anon access by design.';
COMMENT ON TABLE quiz_answers IS 'Single-tenant quiz answers - no user_id, intentionally shared. RLS allows anon access by design.';
