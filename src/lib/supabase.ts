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

// ── Helpers ───────────────────────────────────────────────────────────────────

function generateUserCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I confusion
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

// Helper to wait for session to be established after signUp
async function waitForSession(userId: string, maxAttempts = 10): Promise<void> {
  for (let i = 0; i < maxAttempts; i++) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session && session.user.id === userId) return;
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error('Session non établie. Veuillez réessayer.');
}

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<AuthUser> {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw new Error(error.message);

  const userId = data.user!.id;

  // Wait for session to be established (required for RLS policies)
  await waitForSession(userId);

  // Generate unique user_code
  let userCode = generateUserCode();
  let attempts = 0;
  while (attempts < 5) {
    const { data: existing } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('user_code', userCode)
      .maybeSingle();
    if (!existing) break;
    userCode = generateUserCode();
    attempts++;
  }

  // Create couple for this user (created_by required by RLS policy)
  const { data: couple, error: coupleErr } = await supabase
    .from('couples')
    .insert({ created_by: userId })
    .select('id')
    .single();
  if (coupleErr) throw new Error('Erreur création couple: ' + coupleErr.message);

  const coupleId: string = couple.id;

  // Create user_profile
  const { error: profileErr } = await supabase.from('user_profiles').insert({
    id: userId,
    name,
    user_code: userCode,
    couple_id: coupleId,
  });
  if (profileErr) throw new Error('Erreur création profil: ' + profileErr.message);

  // Persist locally so unlock screen works offline
  localStorage.setItem('paired_user_code', userCode);
  localStorage.setItem('paired_user_name', name);
  localStorage.setItem('paired_couple_id', coupleId);

  return { id: userId, name, userCode, coupleId };
}

export async function loginUser(email: string, password: string): Promise<AuthUser> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      throw new Error('Email ou mot de passe incorrect');
    }
    throw new Error(error.message);
  }

  const userId = data.user!.id;

  // Wait for session to be fully established
  await waitForSession(userId);

  const { data: profile, error: profileErr } = await supabase
    .from('user_profiles')
    .select('name, user_code, couple_id')
    .eq('id', userId)
    .maybeSingle();
  if (profileErr) throw new Error('Erreur chargement profil: ' + profileErr.message);
  if (!profile) throw new Error('Profil introuvable. Veuillez créer un compte.');

  const name: string = profile.name;
  const userCode: string = profile.user_code;
  const coupleId: string | null = profile.couple_id;

  localStorage.setItem('paired_user_code', userCode);
  localStorage.setItem('paired_user_name', name);
  if (coupleId) localStorage.setItem('paired_couple_id', coupleId);

  return { id: userId, name, userCode, coupleId };
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
