import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowUp, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Clock,
  Eye,
  EyeOff,
  Star,
  Bookmark,
  MessageSquare,
  Settings
} from 'lucide-react';
import useBookStore from '../../store/useBookStore';
import { getChapterById, getNextChapter, getPreviousChapter, bookData } from '../../data/mockData';
import './ChapterContent.scss';

const ChapterContent = () => {
  const {
    currentChapter,
    sidebarCollapsed,
    theme,
    fontSize,
    fontFamily,
    lineSpacing,
    readChapters,
    favorites,
    bookmarks,
    setCurrentChapter,
    toggleChapterReadStatus,
    toggleFavorite,
    toggleBookmark,
    markChapterAsRead,
    addReadingTime,
  } = useBookStore();

  const contentRef = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [readingStartTime, setReadingStartTime] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const chapter = currentChapter ? getChapterById(currentChapter) : null;
  const nextChapter = currentChapter ? getNextChapter(currentChapter) : null;
  const previousChapter = currentChapter ? getPreviousChapter(currentChapter) : null;

  const isRead = currentChapter ? (readChapters instanceof Set ? readChapters.has(currentChapter) : false) : false;
  const isFavorite = currentChapter ? (favorites instanceof Set ? favorites.has(currentChapter) : false) : false;
  const isBookmarked = currentChapter ? (bookmarks instanceof Set ? bookmarks.has(currentChapter) : false) : false;

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const scrollTop = contentRef.current.scrollTop;
        setShowScrollTop(scrollTop > 300);
      }
    };

    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
      return () => contentElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Track reading time
  useEffect(() => {
    if (currentChapter) {
      setReadingStartTime(Date.now());
      
      return () => {
        if (readingStartTime) {
          const readingTime = Math.round((Date.now() - readingStartTime) / 60000); // Convert to minutes
          if (readingTime > 0) {
            addReadingTime(readingTime);
          }
        }
      };
    }
  }, [currentChapter, addReadingTime, readingStartTime]);

  // Auto-mark as read when scrolled to bottom
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current && currentChapter && !isRead) {
        const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
        const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
        
        if (scrollPercentage > 0.9) { // 90% scrolled
          markChapterAsRead(currentChapter);
        }
      }
    };

    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
      return () => contentElement.removeEventListener('scroll', handleScroll);
    }
  }, [currentChapter, isRead, markChapterAsRead]);

  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavigation = (chapterId) => {
    setCurrentChapter(chapterId);
    scrollToTop();
  };

  if (!chapter) {
    return (
      <div className="chapter-content no-chapter">
        <div className="welcome-message">
          <BookOpen size={64} />
          <h2>Welcome to {bookData?.title || 'Your Book'}</h2>
          <p>Select a chapter from the sidebar to start reading</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`chapter-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}
      data-theme={theme}
      data-font-size={fontSize}
      data-font-family={fontFamily}
      data-line-spacing={lineSpacing}
    >
      {/* Chapter Header */}
      <div className="chapter-header">
        <div className="chapter-info">
          <h1 className="chapter-title">{chapter.title}</h1>
          <div className="chapter-meta">
            <span className="read-time">
              <Clock size={16} />
              {chapter.estimatedReadTime} min read
            </span>
            <span className="word-count">{chapter.wordCount} words</span>
          </div>
        </div>

        <div className="chapter-actions">
          <button
            className={`action-btn ${isRead ? 'active' : ''}`}
            onClick={() => toggleChapterReadStatus(currentChapter)}
            title={isRead ? 'Mark as unread' : 'Mark as read'}
          >
            {isRead ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          
          <button
            className={`action-btn ${isFavorite ? 'active' : ''}`}
            onClick={() => toggleFavorite(currentChapter)}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star size={18} />
          </button>
          
          <button
            className={`action-btn ${isBookmarked ? 'active' : ''}`}
            onClick={() => toggleBookmark(currentChapter)}
            title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            <Bookmark size={18} />
          </button>

          <button
            className="action-btn"
            onClick={() => setShowSettings(!showSettings)}
            title="Reading settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Reading Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <ReadingSettings onClose={() => setShowSettings(false)} />
        )}
      </AnimatePresence>

      {/* Chapter Content */}
      <div className="content-container" ref={contentRef}>
        <motion.div
          className="chapter-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          dangerouslySetInnerHTML={{ __html: chapter.content }}
        />

        {/* Navigation */}
        <div className="chapter-navigation">
          {previousChapter && (
            <motion.button
              className="nav-btn prev-btn"
              onClick={() => handleNavigation(previousChapter.id)}
              whileHover={!isMobile ? { x: -4 } : {}}
              whileTap={!isMobile ? { scale: 0.95 } : {}}
              animate={false}
            >
              <ChevronLeft size={20} />
              <div className="nav-info">
                <span className="nav-label">Previous</span>
                <span className="nav-title">{previousChapter.title}</span>
              </div>
            </motion.button>
          )}

          {nextChapter && (
            <motion.button
              className="nav-btn next-btn"
              onClick={() => handleNavigation(nextChapter.id)}
              whileHover={!isMobile ? { x: 4 } : {}}
              whileTap={!isMobile ? { scale: 0.95 } : {}}
              animate={false}
            >
              <div className="nav-info">
                <span className="nav-label">Next</span>
                <span className="nav-title">{nextChapter.title}</span>
              </div>
              <ChevronRight size={20} />
            </motion.button>
          )}
        </div>
      </div>

    </div>
  );
};

// Reading Settings Component
const ReadingSettings = ({ onClose }) => {
  const {
    theme,
    fontSize,
    fontFamily,
    lineSpacing,
    setTheme,
    setFontSize,
    setFontFamily,
    setLineSpacing,
  } = useBookStore();

  return (
    <motion.div
      className="reading-settings-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="reading-settings-panel"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Reading Settings</h3>

        <div className="setting-group">
          <label>Theme</label>
          <div className="setting-options">
            <button
              className={theme === 'light' ? 'active' : ''}
              onClick={() => setTheme('light')}
            >
              Light
            </button>
            <button
              className={theme === 'dark' ? 'active' : ''}
              onClick={() => setTheme('dark')}
            >
              Dark
            </button>
          </div>
        </div>

        <div className="setting-group">
          <label>Font Size</label>
          <div className="setting-options">
            {['small', 'medium', 'large'].map(size => (
              <button
                key={size}
                className={fontSize === size ? 'active' : ''}
                onClick={() => setFontSize(size)}
              >
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="setting-group">
          <label>Font Family</label>
          <div className="setting-options">
            {['serif', 'sans-serif', 'monospace'].map(family => (
              <button
                key={family}
                className={fontFamily === family ? 'active' : ''}
                onClick={() => setFontFamily(family)}
              >
                {family === 'sans-serif' ? 'Sans Serif' : 
                 family.charAt(0).toUpperCase() + family.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="setting-group">
          <label>Line Spacing</label>
          <div className="setting-options">
            {['compact', 'normal', 'relaxed'].map(spacing => (
              <button
                key={spacing}
                className={lineSpacing === spacing ? 'active' : ''}
                onClick={() => setLineSpacing(spacing)}
              >
                {spacing.charAt(0).toUpperCase() + spacing.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </motion.div>
    </motion.div>
  );
};

export default ChapterContent;
