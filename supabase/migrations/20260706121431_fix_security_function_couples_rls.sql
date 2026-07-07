-- ── 1. Fix get_my_couple_id: SECURITY INVOKER + immutable search_path ─────────
--    SECURITY INVOKER means it runs as the calling user (not as definer),
--    eliminating the privilege-escalation risk.
--    SET search_path = '' prevents search-path hijacking.
CREATE OR REPLACE FUNCTION public.get_my_couple_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = ''
AS $$
  SELECT couple_id FROM public.user_profiles WHERE id = auth.uid();
$$;

-- ── 2. Revoke direct RPC execution by the anon role ────────────────────────────
--    Authenticated users still need EXECUTE so RLS policies can call the function.
--    Anon users have no legitimate use for it.
REVOKE EXECUTE ON FUNCTION public.get_my_couple_id() FROM anon;

-- ── 3. Fix couples INSERT policy: replace the always-true WITH CHECK ───────────
--    Add a created_by column so we can scope the INSERT to the creating user.
ALTER TABLE public.couples ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id);

DROP POLICY IF EXISTS "insert_couple" ON public.couples;

CREATE POLICY "insert_own_couple" ON public.couples
  FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid());
