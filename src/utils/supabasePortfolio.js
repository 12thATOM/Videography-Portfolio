import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { defaultSiteData } from '../config/siteData';

const PORTFOLIO_ID = 'main';

export const fetchPortfolioFromSupabase = async () => {
  if (!isSupabaseConfigured || !supabase) return null;

  const { data, error } = await supabase
    .from('portfolio_content')
    .select('data, updated_at')
    .eq('id', PORTFOLIO_ID)
    .maybeSingle();

  if (error) {
    console.error('Failed to load portfolio from Supabase:', error);
    return null;
  }

  if (!data?.data || Object.keys(data.data).length === 0) {
    return null;
  }

  return data.data;
};

export const savePortfolioToSupabase = async (siteData) => {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured');
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from('portfolio_content').upsert(
    {
      id: PORTFOLIO_ID,
      data: siteData,
      updated_by: user?.id || null,
    },
    { onConflict: 'id' }
  );

  if (error) {
    console.error('Failed to save portfolio to Supabase:', error);
    throw error;
  }

  return true;
};

export const seedPortfolioIfEmpty = async () => {
  if (!isSupabaseConfigured || !supabase) return;

  const existing = await fetchPortfolioFromSupabase();
  if (existing) return;

  const { error } = await supabase.from('portfolio_content').upsert(
    {
      id: PORTFOLIO_ID,
      data: defaultSiteData,
    },
    { onConflict: 'id' }
  );

  if (error) {
    console.warn('Could not seed portfolio_content:', error);
  }
};
