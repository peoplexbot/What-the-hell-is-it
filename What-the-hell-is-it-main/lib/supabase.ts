import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../constants/supabase';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface UserStats {
  id: string;
  user_id: string;
  current_streak: number;
  max_streak: number;
  created_at: string;
  updated_at: string;
}

export async function getUserStats(userId: string): Promise<UserStats | null> {
  const { data, error } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching user stats:', error);
    return null;
  }

  return data;
}

export async function updateUserStats(
  userId: string,
  updates: Partial<Omit<UserStats, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
) {
  const { error } = await supabase
    .from('user_stats')
    .update(updates)
    .eq('user_id', userId);

  if (error) {
    console.error('Error updating user stats:', error);
    throw error;
  }
}