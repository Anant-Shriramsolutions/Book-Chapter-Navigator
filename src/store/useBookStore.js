import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getAllChapters, getTotalChapters } from '../data/mockData';

const useBookStore = create(
  persist(
    (set, get) => ({
      // Reading Progress State
      readChapters: new Set(),
      currentChapter: null,
      lastReadChapter: null,

      // Bookmarks and Favorites
      bookmarks: new Set(),
      favorites: new Set(),
      
      // Notes and Annotations
      notes: {}, // chapterId: { text, timestamp, position }
      annotations: {}, // chapterId: [{ text, position, timestamp }]
      
      // UI State
      sidebarCollapsed: false,
      searchQuery: '',
      filterType: 'all', // 'all', 'read', 'unread', 'favorites'
      
      // Theme and Settings
      theme: 'light', // 'light', 'dark'
      fontSize: 'medium', // 'small', 'medium', 'large'
      fontFamily: 'serif', // 'serif', 'sans-serif', 'monospace'
      lineSpacing: 'normal', // 'compact', 'normal', 'relaxed'
      
      // Reading Statistics
      readingStreak: 0,
      totalReadingTime: 0, // in minutes
      chaptersReadToday: 0,
      lastReadDate: null,
      
      // Actions for Reading Progress
      markChapterAsRead: (chapterId) => {
        set((state) => {
          const currentReadChapters = state.readChapters instanceof Set ? state.readChapters : new Set();
          const newReadChapters = new Set(currentReadChapters);
          newReadChapters.add(chapterId);
          
          const today = new Date().toDateString();
          const isNewDay = state.lastReadDate !== today;
          
          return {
            readChapters: newReadChapters,
            lastReadChapter: chapterId,
            chaptersReadToday: isNewDay ? 1 : state.chaptersReadToday + 1,
            lastReadDate: today,
            readingStreak: isNewDay ? state.readingStreak + 1 : state.readingStreak,
          };
        });
      },
      
      markChapterAsUnread: (chapterId) => {
        set((state) => {
          const currentReadChapters = state.readChapters instanceof Set ? state.readChapters : new Set();
          const newReadChapters = new Set(currentReadChapters);
          newReadChapters.delete(chapterId);
          return { readChapters: newReadChapters };
        });
      },
      
      toggleChapterReadStatus: (chapterId) => {
        const { readChapters, markChapterAsRead, markChapterAsUnread } = get();
        const isRead = readChapters instanceof Set ? readChapters.has(chapterId) : false;
        if (isRead) {
          markChapterAsUnread(chapterId);
        } else {
          markChapterAsRead(chapterId);
        }
      },
      
      markAllAsRead: () => {
        const allChapters = getAllChapters();
        set((state) => ({
          readChapters: new Set(allChapters.map(ch => ch.id)),
          chaptersReadToday: allChapters.length,
          lastReadDate: new Date().toDateString(),
        }));
      },
      
      clearAllProgress: () => {
        set({
          readChapters: new Set(),
          currentChapter: null,
          lastReadChapter: null,
          chaptersReadToday: 0,
          readingStreak: 0,
          totalReadingTime: 0,
        });
      },
      
      // Actions for Current Chapter
      setCurrentChapter: (chapterId) => {
        set({ currentChapter: chapterId });
      },
      
      // Actions for Bookmarks and Favorites
      toggleBookmark: (chapterId) => {
        set((state) => {
          const currentBookmarks = state.bookmarks instanceof Set ? state.bookmarks : new Set();
          const newBookmarks = new Set(currentBookmarks);
          if (newBookmarks.has(chapterId)) {
            newBookmarks.delete(chapterId);
          } else {
            newBookmarks.add(chapterId);
          }
          return { bookmarks: newBookmarks };
        });
      },

      toggleFavorite: (chapterId) => {
        set((state) => {
          const currentFavorites = state.favorites instanceof Set ? state.favorites : new Set();
          const newFavorites = new Set(currentFavorites);
          if (newFavorites.has(chapterId)) {
            newFavorites.delete(chapterId);
          } else {
            newFavorites.add(chapterId);
          }
          return { favorites: newFavorites };
        });
      },
      
      // Actions for Notes and Annotations
      addNote: (chapterId, text, position = null) => {
        set((state) => ({
          notes: {
            ...state.notes,
            [chapterId]: {
              text,
              position,
              timestamp: new Date().toISOString(),
            },
          },
        }));
      },
      
      removeNote: (chapterId) => {
        set((state) => {
          const newNotes = { ...state.notes };
          delete newNotes[chapterId];
          return { notes: newNotes };
        });
      },
      
      addAnnotation: (chapterId, text, position) => {
        set((state) => ({
          annotations: {
            ...state.annotations,
            [chapterId]: [
              ...(state.annotations[chapterId] || []),
              {
                text,
                position,
                timestamp: new Date().toISOString(),
                id: Date.now().toString(),
              },
            ],
          },
        }));
      },
      
      removeAnnotation: (chapterId, annotationId) => {
        set((state) => ({
          annotations: {
            ...state.annotations,
            [chapterId]: (state.annotations[chapterId] || []).filter(
              (annotation) => annotation.id !== annotationId
            ),
          },
        }));
      },
      
      // Actions for UI State
      toggleSidebar: () => {
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
      },
      
      setSidebarCollapsed: (collapsed) => {
        set({ sidebarCollapsed: collapsed });
      },
      
      setSearchQuery: (query) => {
        set({ searchQuery: query });
      },
      
      setFilterType: (filterType) => {
        set({ filterType });
      },
      
      // Actions for Theme and Settings
      setTheme: (theme) => {
        set({ theme });
      },
      
      setFontSize: (fontSize) => {
        set({ fontSize });
      },
      
      setFontFamily: (fontFamily) => {
        set({ fontFamily });
      },
      
      setLineSpacing: (lineSpacing) => {
        set({ lineSpacing });
      },
      
      // Computed Values
      getReadingProgress: () => {
        const { readChapters } = get();
        const totalChapters = getTotalChapters();
        const size = readChapters instanceof Set ? readChapters.size : 0;
        return totalChapters > 0 ? (size / totalChapters) * 100 : 0;
      },

      isChapterRead: (chapterId) => {
        const { readChapters } = get();
        return readChapters instanceof Set ? readChapters.has(chapterId) : false;
      },

      isChapterBookmarked: (chapterId) => {
        const { bookmarks } = get();
        return bookmarks instanceof Set ? bookmarks.has(chapterId) : false;
      },

      isChapterFavorite: (chapterId) => {
        const { favorites } = get();
        return favorites instanceof Set ? favorites.has(chapterId) : false;
      },
      
      getChapterNote: (chapterId) => {
        const { notes } = get();
        return notes[chapterId] || null;
      },
      
      getChapterAnnotations: (chapterId) => {
        const { annotations } = get();
        return annotations[chapterId] || [];
      },
      
      // Reading Time Tracking
      addReadingTime: (minutes) => {
        set((state) => ({
          totalReadingTime: state.totalReadingTime + minutes,
        }));
      },
    }),
    {
      name: 'book-reading-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        ...state,
        readChapters: Array.from(state.readChapters),
        bookmarks: Array.from(state.bookmarks),
        favorites: Array.from(state.favorites),
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Ensure these are always Sets
          state.readChapters = new Set(Array.isArray(state.readChapters) ? state.readChapters : []);
          state.bookmarks = new Set(Array.isArray(state.bookmarks) ? state.bookmarks : []);
          state.favorites = new Set(Array.isArray(state.favorites) ? state.favorites : []);
        }
      },
    }
  )
);

export default useBookStore;
