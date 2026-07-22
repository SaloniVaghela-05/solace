-- ============================================================
-- SUPABASE AUTO-CONFIRM EMAIL TRIGGER
-- Bypasses the need for email confirmation by auto-confirming
-- new signups, resolving 550 SMTP verification failures.
-- ============================================================

CREATE OR REPLACE FUNCTION public.auto_confirm_user()
RETURNS TRIGGER AS $$
BEGIN
  NEW.confirmed_at = NOW();
  NEW.email_confirmed_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach the BEFORE INSERT trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created_before ON auth.users;

CREATE TRIGGER on_auth_user_created_before
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_confirm_user();
