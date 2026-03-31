import { NewsItem, Category, RSS_FEEDS } from '../types';

const CACHE_KEY = 'buzz_news_cache';
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

interface CacheData {
  [category: string]: {
    timestamp: number;
    items: NewsItem[];
  };
}

const GNEWS_API_KEY = process.env.GNEWS_API_KEY?.trim();
const NEWSDATA_API_KEY = process.env.NEWSDATA_API_KEY?.trim();
const NEWSAPI_KEY = process.env.NEWSAPI_KEY?.trim();

// --- Helper: Fetch with Retry ---
async function fetchWithRetry(url: string, options: RequestInit = {}, retries = 2): Promise<Response> {
  let lastError: any;
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        // Add a timeout to prevent hanging requests
        signal: AbortSignal.timeout(10000)
      });
      return response;
    } catch (error) {
      lastError = error;
      if (i < retries) {
        const delay = Math.pow(2, i) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError;
}

export async function fetchNews(category: Category, forceRefresh = false, page = 1, query?: string): Promise<NewsItem[]> {
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached && !forceRefresh && page === 1 && !query) {
    const cache: CacheData = JSON.parse(cached);
    const categoryCache = cache[category];
    if (categoryCache && Date.now() - categoryCache.timestamp < CACHE_DURATION && categoryCache.items.length > 0) {
      console.log(`Serving ${category} news from cache (age: ${Math.round((Date.now() - categoryCache.timestamp) / 1000)}s)`);
      return categoryCache.items;
    }
  }

  const feeds = query ? [`https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-IN&gl=IN&ceid=IN:en`] : RSS_FEEDS[category];
  console.log(`Fetching news for ${query ? `query: ${query}` : `category: ${category}`} from ${feeds.length} feeds, GNews, NewsData, and NewsAPI`);
  
  const allNews: NewsItem[] = [];

  // --- Fetch from RSS Feeds ---
  const feedPromises = feeds.map(async (feed) => {
    try {
      const response = await fetchWithRetry(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed)}&count=45&_=${Date.now()}`);
      if (!response.ok) return [];
      
      const data = await response.json();

      if (data.status === 'ok' && Array.isArray(data.items)) {
        return data.items.map((item: any) => ({
          id: item.guid || item.link || Math.random().toString(36).substr(2, 9),
          title: item.title,
          description: item.description?.replace(/<[^>]*>?/gm, '').substring(0, 200) || 'No description available.',
          content: item.content || '',
          url: item.link,
          image: item.enclosure?.link || item.thumbnail || extractImageFromDescription(item.description) || `https://picsum.photos/seed/${encodeURIComponent(item.title.substring(0, 10))}/800/450`,
          publishedAt: parseDate(item.pubDate),
          source: {
            name: data.feed?.title || 'News Source',
          },
          category
        }));
      }
      return [];
    } catch (error) {
      // Silently skip failed feeds
      return [];
    }
  });

  // --- Fetch from GNews API ---
  const fetchGNews = async (): Promise<NewsItem[]> => {
    if (!GNEWS_API_KEY || GNEWS_API_KEY === 'MY_GNEWS_API_KEY' || GNEWS_API_KEY === 'undefined' || GNEWS_API_KEY === '') {
      return [];
    }

    try {
      let url = '';
      const gnewsCategoryMap: Record<string, string> = {
        'General': 'general',
        'India': 'nation',
        'International': 'world',
        'Sports': 'sports',
        'Technology': 'technology',
        'Business': 'business',
        'Entertainment': 'entertainment'
      };

      if (query) {
        url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&country=in&max=20&apikey=${GNEWS_API_KEY}`;
      } else if (gnewsCategoryMap[category]) {
        url = `https://gnews.io/api/v4/top-headlines?category=${gnewsCategoryMap[category]}&lang=en&country=in&max=20&apikey=${GNEWS_API_KEY}`;
      } else {
        url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(category)}&lang=en&country=in&max=20&apikey=${GNEWS_API_KEY}`;
      }
      
      if (page > 1) return [];

      const response = await fetchWithRetry(url);
      
      if (!response.ok) return [];

      const data = await response.json();

      if (data.articles && Array.isArray(data.articles)) {
        return data.articles.map((article: any) => ({
          id: article.url,
          title: article.title,
          description: article.description,
          content: article.content,
          url: article.url,
          image: article.image || `https://picsum.photos/seed/${encodeURIComponent(article.title.substring(0, 10))}/800/450`,
          publishedAt: parseDate(article.publishedAt),
          source: {
            name: article.source.name,
            url: article.source.url
          },
          category
        }));
      }
      return [];
    } catch (error) {
      return [];
    }
  };

  // --- Fetch from NewsData.io API ---
  const fetchNewsData = async (): Promise<NewsItem[]> => {
    if (!NEWSDATA_API_KEY || NEWSDATA_API_KEY === 'MY_NEWSDATA_API_KEY' || NEWSDATA_API_KEY === 'undefined' || NEWSDATA_API_KEY === '') {
      return [];
    }

    try {
      const newsDataCategoryMap: Record<string, string> = {
        'General': 'top',
        'India': 'top',
        'International': 'world',
        'Sports': 'sports',
        'Technology': 'technology',
        'Business': 'business',
        'Entertainment': 'entertainment'
      };

      let url = `https://newsdata.io/api/1/news?apikey=${NEWSDATA_API_KEY}&country=in&language=en`;
      
      if (query) {
        url += `&q=${encodeURIComponent(query)}`;
      } else if (newsDataCategoryMap[category]) {
        url += `&category=${newsDataCategoryMap[category]}`;
      } else {
        url += `&q=${encodeURIComponent(category)}`;
      }

      if (page > 1) return [];

      const response = await fetchWithRetry(url);

      if (!response.ok) return [];

      const data = await response.json();

      if (data.results && Array.isArray(data.results)) {
        return data.results.map((article: any) => ({
          id: article.article_id || article.link,
          title: article.title,
          description: article.description || 'No description available.',
          content: article.content || '',
          url: article.link,
          image: article.image_url || `https://picsum.photos/seed/${encodeURIComponent(article.title.substring(0, 10))}/800/450`,
          publishedAt: parseDate(article.pubDate),
          source: {
            name: article.source_id || 'NewsData',
          },
          category
        }));
      }
      return [];
    } catch (error) {
      return [];
    }
  };

  // --- Fetch from NewsAPI.org ---
  const fetchNewsAPI = async (): Promise<NewsItem[]> => {
    if (!NEWSAPI_KEY || NEWSAPI_KEY === 'MY_NEWSAPI_KEY' || NEWSAPI_KEY === 'undefined' || NEWSAPI_KEY === '') {
      return [];
    }

    try {
      const newsApiCategoryMap: Record<string, string> = {
        'General': 'general',
        'India': 'general',
        'International': 'general',
        'Sports': 'sports',
        'Technology': 'technology',
        'Business': 'business',
        'Entertainment': 'entertainment'
      };

      let url = '';
      if (query) {
        url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&pageSize=45&page=${page}&apiKey=${NEWSAPI_KEY}`;
      } else if (newsApiCategoryMap[category]) {
        url = `https://newsapi.org/v2/top-headlines?category=${newsApiCategoryMap[category]}&country=in&pageSize=45&page=${page}&apiKey=${NEWSAPI_KEY}`;
      } else {
        url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(category)}&language=en&pageSize=45&page=${page}&apiKey=${NEWSAPI_KEY}`;
      }

      const response = await fetchWithRetry(url);

      if (!response.ok) return [];

      const data = await response.json();

      if (data.articles && Array.isArray(data.articles)) {
        return data.articles.map((article: any) => ({
          id: article.url,
          title: article.title,
          description: article.description || 'No description available.',
          content: article.content || '',
          url: article.url,
          image: article.urlToImage || `https://picsum.photos/seed/${encodeURIComponent(article.title.substring(0, 10))}/800/450`,
          publishedAt: parseDate(article.publishedAt),
          source: {
            name: article.source.name || 'NewsAPI',
          },
          category
        }));
      }
      return [];
    } catch (error) {
      return [];
    }
  };

  const [rssResults, gnewsResults, newsDataResults, newsApiResults] = await Promise.all([
    page === 1 ? Promise.all(feedPromises) : Promise.resolve([]),
    fetchGNews(),
    fetchNewsData(),
    fetchNewsAPI()
  ]);

  allNews.push(...rssResults.flat(), ...gnewsResults, ...newsDataResults, ...newsApiResults);

  // Deduplicate by title or URL
  const uniqueNews = Array.from(new Map(allNews.map(item => [item.title + item.url, item])).values());
  
  // Sort by date (newest first)
  uniqueNews.sort((a, b) => {
    const dateA = new Date(a.publishedAt).getTime() || 0;
    const dateB = new Date(b.publishedAt).getTime() || 0;
    return dateB - dateA;
  });

  // Update cache if we got results and it's the first page and no query
  if (uniqueNews.length > 0 && page === 1 && !query) {
    const currentCache: CacheData = cached ? JSON.parse(cached) : {};
    currentCache[category] = {
      timestamp: Date.now(),
      items: uniqueNews
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(currentCache));
  }

  return uniqueNews;
}

function extractImageFromDescription(description: string): string | null {
  const imgTag = description.match(/<img[^>]+src="([^">]+)"/);
  return imgTag ? imgTag[1] : null;
}

function parseDate(dateStr: string): string {
  if (!dateStr) return new Date().toISOString();
  
  const cleanDateStr = dateStr.trim();
  
  // 1. If it's already ISO 8601 with timezone, return it
  if (cleanDateStr.includes('T') && (cleanDateStr.endsWith('Z') || cleanDateStr.includes('+') || (cleanDateStr.lastIndexOf('-') > 10))) {
    return cleanDateStr;
  }
  
  // 2. Handle YYYY-MM-DD HH:mm:ss
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(cleanDateStr)) {
    // Assume UTC if no timezone is specified
    return cleanDateStr.replace(' ', 'T') + 'Z';
  }
  
  // 3. Handle DD-MM-YYYY HH:mm:ss (common in some Indian feeds)
  if (/^\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}/.test(cleanDateStr)) {
    const [datePart, timePart] = cleanDateStr.split(' ');
    const [day, month, year] = datePart.split('-');
    return `${year}-${month}-${day}T${timePart}Z`;
  }
  
  // 4. Handle standard Date parsing
  try {
    const date = new Date(cleanDateStr);
    if (!isNaN(date.getTime())) {
      // If it's a future date (likely timezone mismatch), we might need to adjust
      // But for now, we'll just return it and let timeAgo handle it as "Just now"
      return date.toISOString();
    }
  } catch (e) {}
  
  // 5. Last resort: try to find a date-like pattern
  const match = cleanDateStr.match(/(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);
  if (match) {
    const [_, d, m, y] = match;
    // Try both D/M/Y and M/D/Y
    const d1 = new Date(`${y}-${m}-${d}T00:00:00Z`);
    if (!isNaN(d1.getTime())) return d1.toISOString();
  }
  
  return new Date().toISOString();
}
