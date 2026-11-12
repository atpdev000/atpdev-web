import { NextResponse } from 'next/server';
import { evaluateContentSafety } from '@/lib/content-safety';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    if (supabaseUrl === 'YOUR_SUPABASE_URL_HERE') {
      return NextResponse.json({ success: false, message: 'Supabase not configured' });
    }

    // Get pending trends
    const { data: pendingTrends, error } = await supabase
      .from('trends')
      .select('*')
      .eq('status', 'pending')
      .limit(30);

    if (error || !pendingTrends) {
      return NextResponse.json({ success: false, error: 'Error fetching pending trends' });
    }

    for (const trend of pendingTrends) {
      const evaluation = await evaluateContentSafety(trend.topic, trend.source);
      
      // Update status in trends table
      await supabase
        .from('trends')
        .update({ status: evaluation.isSafe ? 'approved' : 'rejected' })
        .eq('id', trend.id);

      // Insert into trend_curation
      await supabase
        .from('trend_curation')
        .insert({
          trend_id: trend.id,
          editorial_angle: evaluation.editorialAngle,
          safety_flag: !evaluation.isSafe,
          safety_reason: evaluation.reason,
          originality_score: evaluation.originalityScore
        });
    }

    return NextResponse.json({ success: true, processed: pendingTrends.length });
  } catch (error) {
    console.error('Curate trends error:', error);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}
