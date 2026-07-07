import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── Types ─────────────────────────────────────────────────────────────────────

export type AuthUser = {
  id: string;
  name: string;
  userCode: string;
  coupleId: string | null;
};

export type AppState = {
  id: string;
  streak_count: number;
  last_active_date: string;
  current_question_index: number;
  created_at: string;
};

export type ActivityCompletion = {
  id: string;
  activity_type: string;
  activity_id: string;
  answer: string | null;
  completed_at: string;
};

export type QuizAnswer = {
  id: string;
  quiz_id: string;
  question_index: number;
  answer: string;
  is_correct: boolean;
  answered_at: string;
};

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function loginUser(email: string): Promise<AuthUser> {
  // Send magic link via email
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: window.location.origin,
    },
  });
  if (error) throw new Error(error.message);

  // Return a placeholder - user will complete login via magic link
  throw new Error('UNSENT_MAGIC_LINK'); // Signal to show "check your email" message
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  const userId = session.user.id;
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('name, user_code, couple_id')
    .eq('id', userId)
    .maybeSingle();
  if (!profile) return null;

  return {
    id: userId,
    name: profile.name,
    userCode: profile.user_code,
    coupleId: profile.couple_id,
  };
}

// Join partner's couple: find partner by code, adopt their couple_id
export async function joinPartnerCouple(
  myUserId: string,
  partnerCode: string
): Promise<{ coupleId: string }> {
  // Find partner
  const { data: partner, error } = await supabase
    .from('user_profiles')
    .select('id, couple_id')
    .eq('user_code', partnerCode.toUpperCase())
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!partner) throw new Error('Code introuvable');
  if (!partner.couple_id) throw new Error('Ce partenaire n\'a pas encore de couple');

  // Adopt partner's couple_id
  const { error: updateErr } = await supabase
    .from('user_profiles')
    .update({ couple_id: partner.couple_id })
    .eq('id', myUserId);
  if (updateErr) throw new Error(updateErr.message);

  const coupleId: string = partner.couple_id;
  localStorage.setItem('paired_couple_id', coupleId);
  return { coupleId };
}

export async function signOutUser(): Promise<void> {
  await supabase.auth.signOut();
  localStorage.removeItem('paired_user_code');
  localStorage.removeItem('paired_user_name');
  localStorage.removeItem('paired_couple_id');
  localStorage.removeItem('paired_unlocked');
}
