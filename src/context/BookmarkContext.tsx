import React, { createContext, useContext, useState, useEffect } from 'react';
import { NewsItem } from '../types';

interface BookmarkContextType {
  bookmarks: NewsItem[];
  addBookmark: (item: NewsItem) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export function BookmarkProvider({ children }: { children: React.ReactNode }) {
  const [bookmarks, setBookmarks] = useState<NewsItem[]>(() => {
    const saved = localStorage.getItem('bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const addBookmark = (item: NewsItem) => {
    setBookmarks(prev => [...prev, item]);
  };

  const removeBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(item => item.id !== id));
  };

  const isBookmarked = (id: string) => {
    return bookmarks.some(item => item.id === id);
  };

  return (
    <BookmarkContext.Provider value={{ bookmarks, addBookmark, removeBookmark, isBookmarked }}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
}
