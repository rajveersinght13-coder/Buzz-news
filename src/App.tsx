import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Menu, 
  X, 
  Moon, 
  Sun, 
  Bookmark, 
  TrendingUp, 
  Share2, 
  ChevronRight,
  Clock,
  ExternalLink,
  Mail,
  Send,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Globe,
  Globe2,
  RefreshCw,
  Flag,
  Map,
  Trophy,
  Cpu,
  Briefcase,
  Film,
  MapPin,
  Loader2
} from 'lucide-react';
import { cn, isBreaking } from './lib/utils';
import { NewsItem, Category, CATEGORIES, MAIN_CATEGORIES, STATE_SUB_CATEGORIES, CATEGORY_ICONS } from './types';
import { fetchNews } from './services/newsService';
import { Logo } from './components/Logo';
import { useTheme, ThemeProvider } from './context/ThemeContext';
import { useBookmarks, BookmarkProvider } from './context/BookmarkContext';

// --- Components ---

const TopBar = ({ lastUpdated }: { lastUpdated: Date }) => {
  return (
    <div className="hidden md:block bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 h-9">
      <div className="max-w-7xl mx-auto px-4 h-full flex justify-between items-center text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Globe className="w-3 h-3 text-red-600" /> {lastUpdated.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
          <div className="w-px h-3 bg-slate-300 dark:bg-slate-700" />
          <span className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-red-600" /> Last Updated: {lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </span>
          <div className="w-px h-3 bg-slate-300 dark:bg-slate-700" />
          <span className="flex items-center gap-1.5 text-red-600 animate-pulse">
            <TrendingUp className="w-3 h-3" /> Trending: AI Revolution, Global Markets, Space X
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-red-600 transition-colors">About</a>
          <a href="#" className="hover:text-red-600 transition-colors">Contact</a>
          <a href="#" className="hover:text-red-600 transition-colors">Advertise</a>
        </div>
      </div>
    </div>
  );
};

const CategoryIcon = ({ name, className }: { name: string, className?: string }) => {
  const IconName = CATEGORY_ICONS[name] || 'Globe';
  const icons: Record<string, any> = { Globe, Flag, Globe2, Map, Trophy, Cpu, Briefcase, Film, MapPin };
  const Icon = icons[IconName] || Globe;
  return <Icon className={className} />;
};

const SkeletonCard = ({ layout = 'grid' }: { layout?: 'grid' | 'list', key?: any }) => (
  <div className={cn(
    "bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 animate-pulse",
    layout === 'list' ? "flex flex-col md:flex-row h-full" : "flex flex-col"
  )}>
    <div className={cn(
      "bg-slate-200 dark:bg-slate-700",
      layout === 'list' ? "md:w-1/3 aspect-video md:aspect-auto" : "aspect-video"
    )} />
    <div className="p-5 flex flex-col flex-grow gap-3">
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
      <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-full" />
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
      <div className="mt-auto flex justify-between">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
      </div>
    </div>
  </div>
);

const Navbar = ({ 
  activeCategory, 
  setActiveCategory, 
  searchQuery, 
  setSearchQuery, 
  onShowBookmarks, 
  isScrolled,
  news,
  onRefresh,
  lastUpdated
}: { 
  activeCategory: Category; 
  setActiveCategory: (c: Category) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onShowBookmarks: () => void;
  isScrolled: boolean;
  news: NewsItem[];
  onRefresh: () => void;
  lastUpdated: Date;
}) => {
  const { theme, toggleTheme } = useTheme();
  const isStateActive = activeCategory === 'State' || STATE_SUB_CATEGORIES.includes(activeCategory);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const activeRef = React.useRef<HTMLButtonElement>(null);

  const handleCategoryClick = (cat: Category) => {
    setActiveCategory(cat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      activeRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [activeCategory]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <TopBar lastUpdated={lastUpdated} />
      <nav className={cn(
        "bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-all duration-300 border-b border-slate-200 dark:border-slate-800 shadow-sm",
        isScrolled ? "py-1" : "py-2"
      )}>
        <div className="max-w-7xl mx-auto px-4">
          {/* Main Header Row */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4 cursor-pointer group" onClick={() => handleCategoryClick('General')}>
              <Logo className="scale-[0.35] md:scale-[0.4] origin-left transition-transform group-hover:scale-[0.37] md:group-hover:scale-[0.42]" />
              <div className="flex flex-col">
                <h1 className="text-base md:text-lg font-black tracking-tighter dark:text-white leading-none">BUZZ NEWS</h1>
                <p className="text-[7px] md:text-[8px] font-bold text-red-600 uppercase tracking-[0.3em] mt-0.5">Global Network</p>
              </div>
            </div>

            {/* Desktop Search & Actions */}
            <div className="hidden md:flex items-center gap-4 lg:gap-6">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-red-600 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search news..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-red-500 transition-all w-40 lg:w-60 dark:text-white border border-transparent focus:bg-white dark:focus:bg-slate-900"
                />
              </div>
              
              <div className="flex items-center gap-1">
                <button 
                  onClick={onRefresh}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all dark:text-white hover:text-red-600"
                  title="Refresh News"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button 
                  onClick={onShowBookmarks}
                  className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all dark:text-white hover:text-red-600 group"
                  title="Bookmarks"
                >
                  <Bookmark className="w-4 h-4 group-hover:fill-red-600/10" />
                </button>
                <button 
                  onClick={toggleTheme}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all dark:text-white"
                  title="Toggle Theme"
                >
                  {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="md:hidden flex items-center gap-2">
              <button 
                onClick={onRefresh}
                className="p-1.5 dark:text-white"
                title="Refresh News"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button onClick={toggleTheme} className="p-1.5 dark:text-white">
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>
              <button onClick={onShowBookmarks} className="p-1.5 dark:text-white">
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Categories Row */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-2">
            <div ref={scrollRef} className="overflow-x-auto no-scrollbar flex items-center gap-2 pb-1">
              {MAIN_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  ref={activeCategory === cat || (cat === 'State' && STATE_SUB_CATEGORIES.includes(activeCategory)) ? activeRef : null}
                  onClick={() => handleCategoryClick(cat)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-[11px] md:text-xs font-bold whitespace-nowrap transition-all uppercase tracking-wider flex items-center gap-2",
                    activeCategory === cat || (cat === 'State' && STATE_SUB_CATEGORIES.includes(activeCategory))
                      ? "bg-red-600 text-white shadow-md shadow-red-500/20" 
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                >
                  <CategoryIcon name={cat} className="w-3 h-3" />
                  {cat}
                </button>
              ))}
            </div>

            <AnimatePresence>
              {isStateActive && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-2 py-2 overflow-x-auto no-scrollbar border-t border-slate-50 dark:border-slate-800/50 mt-1">
                    <span className="text-[9px] font-black text-red-600 uppercase tracking-widest mr-2 flex-shrink-0">Select State:</span>
                    {STATE_SUB_CATEGORIES.map(sub => (
                      <button
                        key={sub}
                        onClick={() => handleCategoryClick(sub)}
                        className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap transition-all border",
                          activeCategory === sub
                            ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white"
                            : "text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-400"
                        )}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>
      <NewsTicker news={news} />
    </header>
  );
};

const NewsTicker = ({ news }: { news: NewsItem[] }) => {
  if (news.length === 0) return null;
  
  return (
    <div className="bg-red-600 dark:bg-red-700 text-white py-2 overflow-hidden whitespace-nowrap relative z-40 border-b border-red-800 shadow-lg">
      <div className="absolute left-0 top-0 bottom-0 px-6 bg-slate-900 flex items-center gap-3 font-black text-[10px] md:text-xs uppercase tracking-[0.2em] z-20 shadow-[10px_0_20px_rgba(0,0,0,0.3)]">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
        Breaking News
      </div>
      <div className="inline-block animate-marquee pl-48">
        {news.slice(0, 15).map((item, i) => (
          <a 
            key={i} 
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="mx-10 text-xs md:text-sm font-black hover:underline transition-all cursor-pointer inline-flex items-center gap-3 uppercase tracking-tight"
            title={`Read more: ${item.title}`}
          >
            {item.title}
            <span className="text-white/40">///</span>
          </a>
        ))}
      </div>
      {/* Duplicate for seamless loop if needed, but marquee usually handles it with 100% width */}
      <div className="inline-block animate-marquee pl-48">
        {news.slice(0, 15).map((item, i) => (
          <a 
            key={`dup-${i}`} 
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="mx-10 text-xs md:text-sm font-black hover:underline transition-all cursor-pointer inline-flex items-center gap-3 uppercase tracking-tight"
          >
            {item.title}
            <span className="text-white/40">///</span>
          </a>
        ))}
      </div>
    </div>
  );
};

interface NewsCardProps {
  item: NewsItem;
  layout?: 'grid' | 'list' | 'hero';
  key?: string | number;
}

const NewsCard = ({ item, layout = 'grid' }: NewsCardProps) => {
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const bookmarked = isBookmarked(item.id);
  const isNew = isBreaking(item.publishedAt);
  const fallbackImage = `https://picsum.photos/seed/${item.category}/800/450`;

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    if (navigator.share) {
      navigator.share({
        title: item.title,
        url: item.url
      });
    } else {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(item.title)}&url=${encodeURIComponent(item.url)}`);
    }
  };

  if (layout === 'hero') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-[400px] md:h-[600px] rounded-3xl overflow-hidden group cursor-pointer"
        onClick={() => window.open(item.url, '_blank')}
      >
        <img 
          src={item.image || fallbackImage} 
          alt={item.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute top-6 left-6 flex gap-2">
          <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full uppercase tracking-wider">
            {item.category}
          </span>
          {isNew && (
            <span className="px-3 py-1 bg-white text-red-600 text-xs font-bold rounded-full uppercase tracking-wider animate-pulse">
              Breaking
            </span>
          )}
        </div>
        <div className="absolute bottom-0 left-0 p-6 md:p-12 max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
            {item.title}
          </h2>
          <p className="text-slate-300 text-sm md:text-lg mb-6 line-clamp-2">
            {item.description || item.content || "Read the latest updates on this story. Click to view the full article."}
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-white/80 text-xs font-bold uppercase tracking-widest">
              <span>{item.source.name}</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all group cursor-pointer",
        layout === 'list' ? "flex flex-col md:flex-row h-full" : "flex flex-col"
      )}
      onClick={() => window.open(item.url, '_blank')}
    >
      <div className={cn(
        "relative overflow-hidden",
        layout === 'list' ? "md:w-1/3 aspect-video md:aspect-auto" : "aspect-video"
      )}>
        <img 
          src={item.image || fallbackImage} 
          alt={item.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2 py-1 bg-slate-900/90 backdrop-blur-sm text-white text-[10px] font-black rounded uppercase tracking-widest border border-white/10">
            {item.category}
          </span>
          {isNew && (
            <span className="px-2 py-1 bg-red-600 text-white text-[10px] font-black rounded uppercase tracking-widest animate-pulse shadow-lg shadow-red-500/40 flex items-center gap-1.5">
              <span className="w-1 h-1 bg-white rounded-full animate-ping" />
              Breaking
            </span>
          )}
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
            {item.source.name}
          </span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
          {item.title}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-3 mb-4 leading-relaxed">
          {item.description || item.content || "Stay informed with the latest developments on this topic. Click to read the full coverage."}
        </p>
        <div className="mt-auto pt-4 border-t border-slate-50 dark:border-slate-700/50 flex items-center justify-between">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              bookmarked ? removeBookmark(item.id) : addBookmark(item);
            }}
            className={cn(
              "p-2 rounded-full transition-all",
              bookmarked ? "bg-red-50 text-red-600" : "hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"
            )}
          >
            <Bookmark className={cn("w-4 h-4", bookmarked && "fill-current")} />
          </button>
          <div className="flex items-center gap-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleShare(e);
              }}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400 transition-all"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400 transition-all">
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main App ---

function BuzzNews() {
  const [activeCategory, setActiveCategory] = useState<Category>('General');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [visibleCount, setVisibleCount] = useState(15);
  const { bookmarks } = useBookmarks();

  const loadNews = async (cat: Category, isRefresh = false, pageNum = 1, query?: string, append = false) => {
    if (pageNum === 1 && !isRefresh && !append) {
      setLoading(true);
      setVisibleCount(15);
    }
    if (pageNum > 1 || append) setLoadingMore(true);
    
    try {
      const data = await fetchNews(cat, isRefresh, pageNum, query);
      setLastUpdated(new Date());
      
      if (pageNum === 1 && !append) {
        setNews(data);
        setHasMore(data.length > 0);
      } else {
        setNews(prev => {
          const combined = [...prev, ...data];
          // Deduplicate by ID
          const seen = new Set();
          return combined.filter(item => {
            if (seen.has(item.id)) return false;
            seen.add(item.id);
            return true;
          });
        });
        if (data.length === 0) setHasMore(false);
        else setHasMore(true); // Reset hasMore for the new category
      }
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const isAutoSwitching = React.useRef(false);

  // Reset and load when category changes
  useEffect(() => {
    if (isAutoSwitching.current) {
      isAutoSwitching.current = false;
      return;
    }
    
    setPage(1);
    setHasMore(true);
    loadNews(activeCategory, false, 1, searchQuery);
    
    // Auto refresh every 60 seconds (only for page 1)
    const interval = setInterval(() => {
      if (page === 1) {
        loadNews(activeCategory, true, 1, searchQuery);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [activeCategory]);

  // Load more when page changes
  useEffect(() => {
    if (page > 1) {
      loadNews(activeCategory, false, page, searchQuery);
    }
  }, [page]);

  // Reset when search query changes (debounced search would be better, but let's keep it simple for now)
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setHasMore(true);
      loadNews(activeCategory, false, 1, searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Infinite scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      setShowBackToTop(window.scrollY > 500);

      if (showBookmarks) return;
      
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;
      
      // Load more on current category
      if (scrollTop + clientHeight >= scrollHeight - 800 && !loading && !loadingMore && hasMore) {
        setPage(prev => prev + 1);
      }
      
      // Switch to next category when current one ends
      if (scrollTop + clientHeight >= scrollHeight - 100 && !loading && !loadingMore && !hasMore && !searchQuery && !showBookmarks) {
        const currentIndex = CATEGORIES.indexOf(activeCategory);
        if (currentIndex !== -1) {
          const nextIndex = (currentIndex + 1) % CATEGORIES.length;
          const nextCategory = CATEGORIES[nextIndex];
          
          isAutoSwitching.current = true;
          setActiveCategory(nextCategory);
          setPage(1);
          loadNews(nextCategory, false, 1, searchQuery, true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, loadingMore, hasMore, showBookmarks, activeCategory, searchQuery]);

  const filteredNews = news; // Now we fetch based on search query, so no need for client-side filtering here

  const trendingNews = news.slice(0, 4);
  const latestNews = filteredNews.slice(4);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar 
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onShowBookmarks={() => setShowBookmarks(!showBookmarks)}
        isScrolled={isScrolled}
        news={news}
        onRefresh={() => loadNews(activeCategory, true)}
        lastUpdated={lastUpdated}
      />
      
      <main className="max-w-7xl mx-auto px-4 pt-[160px] md:pt-[200px] pb-8">
        <AnimatePresence mode="wait">
          {showBookmarks ? (
            <motion.div 
              key="bookmarks"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black dark:text-white flex items-center gap-3">
                  <Bookmark className="w-8 h-8 text-red-600" /> Saved Stories
                </h2>
                <button 
                  onClick={() => {
                    setShowBookmarks(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-red-600 font-bold hover:underline"
                >
                  Back to Feed
                </button>
              </div>
              {bookmarks.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                  <Bookmark className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 dark:text-slate-400 text-lg">No bookmarks yet. Start saving stories you love!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bookmarks.map(item => (
                    <NewsCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="feed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              {/* Hero Section */}
              {!searchQuery && trendingNews.length > 0 && (
                <section className="space-y-6">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-red-600" />
                    <h2 className="text-xl font-black uppercase tracking-widest dark:text-white">Trending Now</h2>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <NewsCard item={trendingNews[0]} layout="hero" />
                    </div>
                    <div className="flex flex-col gap-6">
                      {trendingNews.slice(1, 4).map(item => (
                        <NewsCard key={item.id} item={item} layout="list" />
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* Latest News Grid */}
              <section>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-8 bg-red-600 rounded-full" />
                    <h2 className="text-2xl font-black dark:text-white">
                      {searchQuery ? `Search Results for "${searchQuery}"` : `Latest in ${activeCategory}`}
                    </h2>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Updated</span>
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{lastUpdated.toLocaleTimeString()}</span>
                    </div>
                    <button 
                      onClick={() => loadNews(activeCategory, true, 1, searchQuery)}
                      className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors dark:text-white"
                      title="Refresh News"
                    >
                      <RefreshCw className={cn("w-5 h-5", loading && "animate-spin")} />
                    </button>
                  </div>
                </div>

                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <SkeletonCard key={i} />
                    ))}
                  </div>
                ) : filteredNews.length === 0 ? (
                  <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
                    <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 dark:text-slate-400 text-lg mb-6">No news found matching your criteria.</p>
                    <button 
                      onClick={() => loadNews(activeCategory, true, 1, searchQuery)}
                      className="px-6 py-2 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-all flex items-center gap-2 mx-auto"
                    >
                      <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
                      Try Refreshing
                    </button>
                    <p className="mt-4 text-xs text-slate-400">
                      Check your internet connection or try a different category.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {(searchQuery ? filteredNews : latestNews).slice(0, visibleCount).map(item => (
                        <NewsCard key={item.id} item={item} />
                      ))}
                    </div>
                    
                    {visibleCount < (searchQuery ? filteredNews : latestNews).length && (
                      <div className="mt-12 text-center">
                        <button 
                          onClick={() => setVisibleCount(prev => prev + 12)}
                          className="px-8 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full font-bold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm flex items-center gap-2 mx-auto group"
                        >
                          Load More Stories
                          <ChevronRight className="w-4 h-4 rotate-90 group-hover:translate-y-1 transition-transform" />
                        </button>
                      </div>
                    )}
                  </>
                )}

                {loadingMore && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {[1, 2, 3].map(i => (
                      <SkeletonCard key={`loading-more-${i}`} />
                    ))}
                  </div>
                )}

                {!hasMore && news.length > 0 && (
                  <div className="text-center py-12">
                    <p className="text-slate-500 dark:text-slate-400 font-medium italic">You've reached the end of the news feed.</p>
                  </div>
                )}
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-20 pb-10 mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-8 gap-12 mb-20">
            <div className="lg:col-span-4">
              <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={() => {
                setActiveCategory('General');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}>
                <Logo className="scale-[0.5] origin-left" />
                <h2 className="text-2xl font-black dark:text-white tracking-tighter">BUZZ NEWS</h2>
              </div>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
                The world's most trusted source for breaking news, in-depth analysis, and exclusive reporting. Stay ahead with BUZZ NEWS.
              </p>
              <div className="flex gap-4">
                {[
                  { icon: Twitter, label: 'Twitter' },
                  { icon: Facebook, label: 'Facebook' },
                  { icon: Instagram, label: 'Instagram' },
                  { icon: Youtube, label: 'Youtube' },
                  { icon: Linkedin, label: 'LinkedIn' }
                ].map((social, i) => (
                  <a 
                    key={i} 
                    href="#" 
                    className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-red-600 hover:border-red-600 transition-all shadow-sm"
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2">
              <h4 className="font-black dark:text-white mb-8 uppercase text-[10px] tracking-[0.2em] text-red-600">Categories</h4>
              <ul className="space-y-4">
                {MAIN_CATEGORIES.slice(0, 6).map(cat => (
                  <li key={cat}>
                    <button 
                      onClick={() => {
                        setActiveCategory(cat);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }} 
                      className="text-slate-500 dark:text-slate-400 hover:text-red-600 text-sm font-medium transition-colors flex items-center gap-2 group"
                    >
                      <div className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full group-hover:bg-red-600 transition-colors" />
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="font-black dark:text-white mb-8 uppercase text-[10px] tracking-[0.2em] text-red-600">Company</h4>
              <ul className="space-y-4">
                {['About Us', 'Our Team', 'Careers', 'Contact', 'Press Kit'].map(item => (
                  <li key={item}>
                    <a href="#" className="text-slate-500 dark:text-slate-400 hover:text-red-600 text-sm font-medium transition-colors flex items-center gap-2 group">
                      <div className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full group-hover:bg-red-600 transition-colors" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-10 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-400 text-xs font-medium">
              © {new Date().getFullYear()} BUZZ NEWS GLOBAL NETWORK. ALL RIGHTS RESERVED. | MADE BY RAJVEER
            </p>
            <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <a href="#" className="hover:text-red-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-red-600 transition-colors">Terms</a>
              <a href="#" className="hover:text-red-600 transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 z-50 p-4 bg-red-600 text-white rounded-full shadow-2xl hover:bg-red-700 transition-all group"
            aria-label="Back to top"
          >
            <ChevronRight className="w-6 h-6 -rotate-90 group-hover:-translate-y-1 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BookmarkProvider>
        <BuzzNews />
      </BookmarkProvider>
    </ThemeProvider>
  );
}
