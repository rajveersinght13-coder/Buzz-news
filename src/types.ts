export interface NewsItem {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
    url?: string;
  };
  category: string;
}

export type Category = 
  | 'General' 
  | 'India' 
  | 'International' 
  | 'State' 
  | 'Rajasthan'
  | 'Maharashtra'
  | 'Uttar Pradesh'
  | 'Madhya Pradesh'
  | 'Gujarat'
  | 'Delhi'
  | 'Punjab'
  | 'Mumbai'
  | 'Udaipur'
  | 'Sports' 
  | 'Technology' 
  | 'Business' 
  | 'Entertainment';

export const MAIN_CATEGORIES: Category[] = [
  'General',
  'India',
  'International',
  'State',
  'Sports',
  'Technology',
  'Business',
  'Entertainment'
];

export const STATE_SUB_CATEGORIES: Category[] = [
  'Rajasthan',
  'Maharashtra',
  'Uttar Pradesh',
  'Madhya Pradesh',
  'Gujarat',
  'Delhi',
  'Punjab',
  'Mumbai',
  'Udaipur'
];

export const CATEGORIES: Category[] = [
  'General',
  'India',
  'International',
  'State',
  ...STATE_SUB_CATEGORIES,
  'Sports',
  'Technology',
  'Business',
  'Entertainment'
];

export const RSS_FEEDS: Record<Category, string[]> = {
  'General': [
    'https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en', // India (General)
    'https://feeds.feedburner.com/ndtvnews-top-stories', // NDTV Top Stories
    'https://feeds.feedburner.com/ndtvnews-latest', // NDTV Latest
    'https://www.aajtak.in/rssfeeds/?id=home', // Aaj Tak
    'https://www.indiatoday.in/rss/home', // India Today
    'https://www.bhaskar.com/rss-v1--category-1.xml', // Dainik Bhaskar
    'https://www.news18.com/commonfeeds/v1/eng/rss/india.xml' // News18
  ],
  'India': [
    'https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml', // Hindustan Times
    'https://news.abplive.com/rss/india-news.xml', // ABP News
    'https://www.jagran.com/rss/news-national.xml', // Jagran
    'https://zeenews.india.com/rss/india-national-news.xml', // Zee News
    'https://www.news18.com/commonfeeds/v1/eng/rss/india.xml', // News18
    'https://feeds.feedburner.com/ndtvnews-india-news', // NDTV India News
    'https://www.thehindu.com/news/national/feeder/default.rss', // The Hindu
    'https://www.indiatoday.in/rss/1206550' // India Today National
  ],
  'International': [
    'https://news.google.com/rss/headlines/section/topic/WORLD?hl=en-IN&gl=IN&ceid=IN:en', // World
    'https://news.un.org/feed/subscribe/en/news/all/rss.xml', // UN News
    'http://rss.cnn.com/rss/edition.rss', // CNN
    'http://feeds.bbci.co.uk/news/world/rss.xml' // BBC World
  ],
  'State': [
    'https://news.google.com/rss/search?q=rajasthan&hl=en-IN&gl=IN&ceid=IN:en',
    'https://news.google.com/rss/search?q=maharashtra&hl=en-IN&gl=IN&ceid=IN:en',
    'https://news.google.com/rss/search?q=uttar+pradesh&hl=en-IN&gl=IN&ceid=IN:en',
    'https://news.google.com/rss/search?q=madhya+pradesh&hl=en-IN&gl=IN&ceid=IN:en',
    'https://news.google.com/rss/search?q=gujarat&hl=en-IN&gl=IN&ceid=IN:en',
    'https://news.google.com/rss/search?q=delhi&hl=en-IN&gl=IN&ceid=IN:en',
    'https://news.google.com/rss/search?q=punjab&hl=en-IN&gl=IN&ceid=IN:en',
    'https://news.google.com/rss/search?q=mumbai&hl=en-IN&gl=IN&ceid=IN:en',
    'https://news.google.com/rss/search?q=udaipur&hl=en-IN&gl=IN&ceid=IN:en'
  ],
  'Rajasthan': ['https://news.google.com/rss/search?q=rajasthan&hl=en-IN&gl=IN&ceid=IN:en'],
  'Maharashtra': ['https://news.google.com/rss/search?q=maharashtra&hl=en-IN&gl=IN&ceid=IN:en'],
  'Uttar Pradesh': ['https://news.google.com/rss/search?q=uttar+pradesh&hl=en-IN&gl=IN&ceid=IN:en'],
  'Madhya Pradesh': ['https://news.google.com/rss/search?q=madhya+pradesh&hl=en-IN&gl=IN&ceid=IN:en'],
  'Gujarat': ['https://news.google.com/rss/search?q=gujarat&hl=en-IN&gl=IN&ceid=IN:en'],
  'Delhi': ['https://news.google.com/rss/search?q=delhi&hl=en-IN&gl=IN&ceid=IN:en'],
  'Punjab': ['https://news.google.com/rss/search?q=punjab&hl=en-IN&gl=IN&ceid=IN:en'],
  'Mumbai': ['https://news.google.com/rss/search?q=mumbai&hl=en-IN&gl=IN&ceid=IN:en'],
  'Udaipur': ['https://news.google.com/rss/search?q=udaipur&hl=en-IN&gl=IN&ceid=IN:en'],
  'Sports': [
    'https://news.google.com/rss/headlines/section/topic/SPORTS?hl=en-IN&gl=IN&ceid=IN:en', // Sports
    'https://www.espncricinfo.com/rss/content/story/feeds/0.xml', // Cricinfo
    'https://www.hindustantimes.com/feeds/rss/sports/rssfeed.xml' // HT Sports
  ],
  'Technology': [
    'https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?hl=en-IN&gl=IN&ceid=IN:en', // Technology
    'https://www.gadgets360.com/rss/feeds', // Gadgets 360
    'https://www.hindustantimes.com/feeds/rss/tech/rssfeed.xml' // HT Tech
  ],
  'Business': [
    'https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=en-IN&gl=IN&ceid=IN:en', // Business
    'https://economictimes.indiatimes.com/rssfeedsdefault.cms', // Economic Times
    'https://www.livemint.com/rss/news' // Mint
  ],
  'Entertainment': [
    'https://news.google.com/rss/headlines/section/topic/ENTERTAINMENT?hl=en-IN&gl=IN&ceid=IN:en', // Entertainment
    'https://www.pinkvilla.com/rss.xml', // Pinkvilla
    'https://www.hindustantimes.com/feeds/rss/entertainment/rssfeed.xml' // HT Entertainment
  ]
};

export const CATEGORY_ICONS: Record<string, string> = {
  'General': 'Globe',
  'India': 'Flag',
  'International': 'Globe2',
  'State': 'Map',
  'Sports': 'Trophy',
  'Technology': 'Cpu',
  'Business': 'Briefcase',
  'Entertainment': 'Film',
  'Rajasthan': 'MapPin',
  'Maharashtra': 'MapPin',
  'Uttar Pradesh': 'MapPin',
  'Madhya Pradesh': 'MapPin',
  'Gujarat': 'MapPin',
  'Delhi': 'MapPin',
  'Punjab': 'MapPin',
  'Mumbai': 'MapPin',
  'Udaipur': 'MapPin'
};
