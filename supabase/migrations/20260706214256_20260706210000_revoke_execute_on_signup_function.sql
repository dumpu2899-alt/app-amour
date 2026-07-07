-- ── Security Fix: Revoke EXECUTE on handle_new_user_signup ─────────────────────
--    This function is a trigger that should ONLY be called by the auth.users
--    BEFORE INSERT trigger, never directly via RPC. Revoke all direct access.

REVOKE EXECUTE ON FUNCTION public.handle_new_user_signup() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_signup() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_signup() FROM public;

-- Note: The trigger still works because it executes as the superuser role
-- that owns auth.users table, bypassing EXECUTE permissions.
