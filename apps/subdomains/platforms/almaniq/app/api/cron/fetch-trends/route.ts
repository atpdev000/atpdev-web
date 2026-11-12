import { NextResponse } from 'next/server';
import { fetchGoogleTrends } from '@/lib/trends/google-trends';
import { fetchNewsTrends } from '@/lib/trends/news-api';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const googleTrends = await fetchGoogleTrends();
    const newsTrends = await fetchNewsTrends();
    const allTrends = [...googleTrends, ...newsTrends];

    if (allTrends.length > 0 && supabaseUrl && supabaseUrl !== 'YOUR_SUPABASE_URL_HERE') {
      const newTrends = [];
      for (const trend of allTrends) {
        const { data: existing } = await supabase
          .from('trends')
          .select('id')
          .eq('topic', trend.topic)
          .maybeSingle();

        if (!existing) {
          newTrends.push(trend);
        }
      }

      if (newTrends.length > 0) {
        const { error } = await supabase.from('trends').insert(newTrends);
        if (error) {
          console.error('Error inserting trends to DB:', error);
        }
      }

      return NextResponse.json({ success: true, totalFetched: allTrends.length, insertedCount: newTrends.length });
    }

    return NextResponse.json({ success: true, totalFetched: allTrends.length, insertedCount: 0 });
  } catch (error) {
    console.error('Fetch trends error:', error);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}
