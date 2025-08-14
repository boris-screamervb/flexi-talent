-- Fix security issue: Add RLS policy for audit_log table
CREATE POLICY "Audit logs are publicly viewable" ON audit_log FOR SELECT USING (true);
CREATE POLICY "Audit logs can be inserted" ON audit_log FOR INSERT WITH CHECK (true);