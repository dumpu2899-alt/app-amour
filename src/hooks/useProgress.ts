import { useState, useEffect, useCallback } from 'react';
import { supabase, AppState, isDemoMode } from '../lib/supabase';

type Progress = {
  appState: AppState | null;
  completedIds: Set<string>;
  loading: boolean;
};

// couple_id is required so all inserts are properly scoped.
// SELECT/UPDATE/DELETE are scoped automatically by RLS (get_my_couple_id()).
export function useProgress(coupleId: string | null) {
  const [progress, setProgress] = useState<Progress>({
    appState: null,
    completedIds: new Set(),
    loading: true,
  });

  const loadProgress = useCallback(async () => {
    if (!coupleId) {
      setProgress({ appState: null, completedIds: new Set(), loading: false });
      return;
    }

    // Demo mode: use localStorage for progress
    if (isDemoMode()) {
      const storedCompletions = localStorage.getItem('demo_completions');
      const completedIds = storedCompletions
        ? new Set(JSON.parse(storedCompletions))
        : new Set<string>();
      const storedIndex = localStorage.getItem('demo_question_index');
      const appState: AppState = {
        id: 'demo-state',
        streak_count: 1,
        last_active_date: new Date().toISOString().split('T')[0],
        current_question_index: storedIndex ? parseInt(storedIndex, 10) : 0,
        created_at: new Date().toISOString(),
      };
      setProgress({ appState, completedIds, loading: false });
      return;
    }

    const [stateResult, completionsResult] = await Promise.all([
      supabase.from('app_state').select('*').maybeSingle(),
      supabase.from('activity_completions').select('activity_type, activity_id'),
    ]);

    let appState = stateResult.data as AppState | null;

    if (!appState) {
      const { data: newState } = await supabase
        .from('app_state')
        .insert({ streak_count: 0, current_question_index: 0, couple_id: coupleId })
        .select()
        .maybeSingle();
      appState = newState as AppState | null;
    } else {
      const today = new Date().toISOString().split('T')[0];
      if (appState.last_active_date !== today) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        const newStreak =
          appState.last_active_date === yesterday ? appState.streak_count + 1 : 1;
        await supabase
          .from('app_state')
          .update({ last_active_date: today, streak_count: newStreak })
          .eq('id', appState.id);
        appState = { ...appState, last_active_date: today, streak_count: newStreak };
      }
    }

    const completedIds = new Set<string>(
      (completionsResult.data ?? []).map(
        (c: { activity_type: string; activity_id: string }) =>
          `${c.activity_type}:${c.activity_id}`
      )
    );

    setProgress({ appState, completedIds, loading: false });
  }, [coupleId]);

  useEffect(() => {
    setProgress((p) => ({ ...p, loading: true }));
    loadProgress();
  }, [loadProgress]);

  const markCompleted = useCallback(
    async (activityType: string, activityId: string, answer?: string) => {
      if (!coupleId) return;

      // Demo mode: save to localStorage
      if (isDemoMode()) {
        const storedCompletions = localStorage.getItem('demo_completions');
        const completedIds = storedCompletions
          ? new Set(JSON.parse(storedCompletions))
          : new Set<string>();
        completedIds.add(`${activityType}:${activityId}`);
        localStorage.setItem('demo_completions', JSON.stringify([...completedIds]));
        setProgress((prev) => ({
          ...prev,
          completedIds,
        }));
        return;
      }

      await supabase.from('activity_completions').upsert(
        {
          activity_type: activityType,
          activity_id: activityId,
          answer: answer ?? null,
          couple_id: coupleId,
        },
        { onConflict: 'activity_type,activity_id' }
      );
      setProgress((prev) => ({
        ...prev,
        completedIds: new Set([
          ...prev.completedIds,
          `${activityType}:${activityId}`,
        ]),
      }));
    },
    [coupleId]
  );

  const advanceQuestion = useCallback(async () => {
    if (!progress.appState) return;
    const newIndex = progress.appState.current_question_index + 1;

    // Demo mode: save to localStorage
    if (isDemoMode()) {
      localStorage.setItem('demo_question_index', String(newIndex));
      setProgress((prev) => ({
        ...prev,
        appState: prev.appState
          ? { ...prev.appState, current_question_index: newIndex }
          : null,
      }));
      return;
    }

    await supabase
      .from('app_state')
      .update({ current_question_index: newIndex })
      .eq('id', progress.appState.id);
    setProgress((prev) => ({
      ...prev,
      appState: prev.appState
        ? { ...prev.appState, current_question_index: newIndex }
        : null,
    }));
  }, [progress.appState]);

  const isCompleted = useCallback(
    (activityType: string, activityId: string) =>
      progress.completedIds.has(`${activityType}:${activityId}`),
    [progress.completedIds]
  );

  return {
    appState: progress.appState,
    loading: progress.loading,
    isCompleted,
    markCompleted,
    advanceQuestion,
    reload: loadProgress,
  };
}
