import axios from 'axios';

export async function fetchNewsTrends() {
  const apiKey = process.env.NEWSAPI_KEY;
  if (!apiKey || apiKey === 'YOUR_NEWSAPI_KEY_HERE') {
    console.warn('NEWSAPI_KEY no configurado, saltando...');
    return [];
  }

  try {
    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        country: 'us', // o 'mx', 'es' dependiendo del público
        apiKey
      }
    });

    return response.data.articles.slice(0, 10).map((article: any) => ({
      source: 'news',
      topic: article.title,
      volume: null,
      growth_percent: null,
      raw_payload: article
    }));
  } catch (error) {
    console.error('Error fetching News API:', error);
    return [];
  }
}
