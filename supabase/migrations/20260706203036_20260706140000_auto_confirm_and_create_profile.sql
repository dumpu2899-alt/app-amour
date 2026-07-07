-- ── 1. Trigger function: auto-confirm email + create profile + create couple ─────
--    This runs BEFORE INSERT on auth.users so the user is confirmed at signup time.

CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  new_couple_id uuid;
  new_code text;
  attempts int := 0;
BEGIN
  -- Auto-confirm the email by setting email_confirmed_at
  NEW.email_confirmed_at := now();
  NEW.confirmed_at := now();
  
  -- Generate a unique 6-char user code
  new_code := upper(substring(md5(random()::text || NEW.id::text) from 1 for 6));
  
  -- Ensure uniqueness (max 5 attempts)
  WHILE attempts < 5 LOOP
    SELECT INTO new_couple_id id FROM user_profiles WHERE user_code = new_code;
    IF new_couple_id IS NULL THEN
      EXIT; -- code is unique
    END IF;
    new_code := upper(substring(md5(random()::text || NEW.id::text || attempts::text) from 1 for 6));
    attempts := attempts + 1;
  END LOOP;
  
  -- Create couple (created_by = new user's id)
  INSERT INTO public.couples (created_by) VALUES (NEW.id) RETURNING id INTO new_couple_id;
  
  -- Create user_profile with name from metadata or empty
  INSERT INTO public.user_profiles (id, name, user_code, couple_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    new_code,
    new_couple_id
  );
  
  RETURN NEW;
END;
$$;

-- ── 2. Attach trigger to auth.users (BEFORE INSERT) ─────────────────────────────
DROP TRIGGER IF EXISTS on_auth_user_signup ON auth.users;
CREATE TRIGGER on_auth_user_signup
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_signup();

-- ── 3. Grant necessary permissions ────────────────────────────────────────────
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT SELECT ON auth.users TO authenticated;
