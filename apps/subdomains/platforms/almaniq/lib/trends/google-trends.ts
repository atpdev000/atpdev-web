import googleTrends from 'google-trends-api';

export async function fetchGoogleTrends(geo = 'US') {
  try {
    const results = await googleTrends.dailyTrends({ geo });
    const parsed = JSON.parse(results);
    const trendingSearches = parsed.default.trendingSearchesDays[0].trendingSearches;
    
    return trendingSearches.map((trend: any) => ({
      source: 'google_trends',
      topic: trend.title.query,
      volume: trend.formattedTraffic ? parseInt(trend.formattedTraffic.replace(/[^0-9]/g, '')) * 1000 : 0,
      growth_percent: null,
      raw_payload: trend
    }));
  } catch (error) {
    console.error('Error fetching Google Trends:', error);
    return [];
  }
}
