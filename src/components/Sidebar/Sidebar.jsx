import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp,
  Search,
  Filter,
  BookOpen,
  Check,
  Star,
  Bookmark
} from 'lucide-react';
import useBookStore from '../../store/useBookStore';
import { bookData } from '../../data/mockData';
import './Sidebar.scss';

const Sidebar = () => {
  const {
    sidebarCollapsed,
    searchQuery,
    filterType,
    currentChapter,
    readChapters,
    favorites,
    bookmarks,
    toggleSidebar,
    setSearchQuery,
    setFilterType,
    setCurrentChapter,
    toggleChapterReadStatus,
    toggleFavorite,
    toggleBookmark,
    getReadingProgress,
  } = useBookStore();

  const [expandedVolumes, setExpandedVolumes] = useState(
    new Set(bookData.volumes.map(v => v.id))
  );
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleVolumeExpansion = (volumeId) => {
    setExpandedVolumes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(volumeId)) {
        newSet.delete(volumeId);
      } else {
        newSet.add(volumeId);
      }
      return newSet;
    });
  };

  const filteredChapters = useMemo(() => {
    let chapters = bookData.volumes.flatMap(volume => 
      volume.chapters.map(chapter => ({ ...chapter, volumeTitle: volume.title }))
    );

    // Apply search filter
    if (searchQuery.trim()) {
      chapters = chapters.filter(chapter =>
        chapter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chapter.volumeTitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    switch (filterType) {
      case 'read':
        chapters = chapters.filter(chapter => readChapters instanceof Set ? readChapters.has(chapter.id) : false);
        break;
      case 'unread':
        chapters = chapters.filter(chapter => readChapters instanceof Set ? !readChapters.has(chapter.id) : true);
        break;
      case 'favorites':
        chapters = chapters.filter(chapter => favorites instanceof Set ? favorites.has(chapter.id) : false);
        break;
      default:
        break;
    }

    return chapters;
  }, [searchQuery, filterType, readChapters, favorites]);

  const sidebarVariants = {
    expanded: { width: '320px' },
    collapsed: { width: '60px' }
  };

  const contentVariants = {
    expanded: { opacity: 1, x: 0 },
    collapsed: { opacity: 0, x: -20 }
  };

  const progress = getReadingProgress();

  return (
    <motion.div
      className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}
      variants={!isMobile ? sidebarVariants : {}}
      animate={!isMobile ? (sidebarCollapsed ? 'collapsed' : 'expanded') : false}
      transition={!isMobile ? { duration: 0.3, ease: 'easeInOut' } : {}}
    >
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <motion.button
          className="toggle-btn"
          onClick={() => {
            if (window.setUserToggledSidebar) {
              // Set flag when opening, reset when closing
              window.setUserToggledSidebar(!sidebarCollapsed);
            }
            toggleSidebar();
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {sidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </motion.button>

        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              className="header-content"
              variants={contentVariants}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
            >
              <h2 className="book-title">{bookData.title}</h2>
              <p className="book-author">by {bookData.author}</p>
              
              {/* Progress Bar */}
              <div className="progress-container">
                <div className="progress-bar">
                  <motion.div
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <span className="progress-text">{Math.round(progress)}% Complete</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {!sidebarCollapsed && (
          <motion.div
            className="sidebar-content"
            variants={contentVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
          >
            {/* Search and Filter */}
            <div className="search-section">
              <div className="search-input-container">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Search chapters..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
              
              <button
                className={`filter-btn ${showFilters ? 'active' : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter />
              </button>
            </div>

            {/* Filter Options */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  className="filter-options"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {['all', 'read', 'unread', 'favorites'].map(filter => (
                    <button
                      key={filter}
                      className={`filter-option ${filterType === filter ? 'active' : ''}`}
                      onClick={() => setFilterType(filter)}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chapter List */}
            <div className="chapter-list">
              {searchQuery.trim() || filterType !== 'all' ? (
                // Filtered view - flat list
                <div className="filtered-chapters">
                  {filteredChapters.map(chapter => (
                    <ChapterItem
                      key={chapter.id}
                      chapter={chapter}
                      isActive={currentChapter === chapter.id}
                      isRead={readChapters instanceof Set ? readChapters.has(chapter.id) : false}
                      isFavorite={favorites instanceof Set ? favorites.has(chapter.id) : false}
                      isBookmarked={bookmarks instanceof Set ? bookmarks.has(chapter.id) : false}
                      onSelect={() => setCurrentChapter(chapter.id)}
                      onToggleRead={() => toggleChapterReadStatus(chapter.id)}
                      onToggleFavorite={() => toggleFavorite(chapter.id)}
                      onToggleBookmark={() => toggleBookmark(chapter.id)}
                      showVolume={true}
                    />
                  ))}
                </div>
              ) : (
                // Volume-grouped view
                <div className="volume-chapters">
                  {bookData.volumes.map(volume => (
                    <VolumeSection
                      key={volume.id}
                      volume={volume}
                      isExpanded={expandedVolumes.has(volume.id)}
                      onToggleExpansion={() => toggleVolumeExpansion(volume.id)}
                      currentChapter={currentChapter}
                      readChapters={readChapters}
                      favorites={favorites}
                      bookmarks={bookmarks}
                      onChapterSelect={setCurrentChapter}
                      onToggleRead={toggleChapterReadStatus}
                      onToggleFavorite={toggleFavorite}
                      onToggleBookmark={toggleBookmark}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Volume Section Component
const VolumeSection = ({
  volume,
  isExpanded,
  onToggleExpansion,
  currentChapter,
  readChapters,
  favorites,
  bookmarks,
  onChapterSelect,
  onToggleRead,
  onToggleFavorite,
  onToggleBookmark,
}) => {
  const readCount = volume.chapters.filter(ch => readChapters instanceof Set ? readChapters.has(ch.id) : false).length;
  const totalCount = volume.chapters.length;

  return (
    <div className="volume-section">
      <motion.button
        className="volume-header"
        onClick={onToggleExpansion}
        whileHover={{ backgroundColor: 'var(--hover-bg)' }}
      >
        <div className="volume-info">
          <h3 className="volume-title">{volume.title}</h3>
          <span className="chapter-count">{readCount}/{totalCount} chapters</span>
        </div>
        {isExpanded ? <ChevronUp /> : <ChevronDown />}
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="volume-chapters"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {volume.chapters.map(chapter => (
              <ChapterItem
                key={chapter.id}
                chapter={chapter}
                isActive={currentChapter === chapter.id}
                isRead={readChapters instanceof Set ? readChapters.has(chapter.id) : false}
                isFavorite={favorites instanceof Set ? favorites.has(chapter.id) : false}
                isBookmarked={bookmarks instanceof Set ? bookmarks.has(chapter.id) : false}
                onSelect={() => onChapterSelect(chapter.id)}
                onToggleRead={() => onToggleRead(chapter.id)}
                onToggleFavorite={() => onToggleFavorite(chapter.id)}
                onToggleBookmark={() => onToggleBookmark(chapter.id)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Chapter Item Component
const ChapterItem = React.memo(({
  chapter,
  isActive,
  isRead,
  isFavorite,
  isBookmarked,
  onSelect,
  onToggleRead,
  onToggleFavorite,
  onToggleBookmark,
  showVolume = false,
}) => {
  return (
    <motion.div
      className={`chapter-item ${isActive ? 'active' : ''} ${isRead ? 'read' : ''}`}
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="chapter-main" onClick={onSelect}>
        <div className="chapter-info">
          <h4 className="chapter-title">{chapter.title}</h4>
          {showVolume && (
            <span className="volume-label">{chapter.volumeTitle}</span>
          )}
          <div className="chapter-meta">
            <span className="read-time">{chapter.estimatedReadTime} min read</span>
            <span className="word-count">{chapter.wordCount} words</span>
          </div>
        </div>
      </div>

      <div className="chapter-actions">
        <button
          className={`action-btn ${isRead ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleRead();
          }}
          title={isRead ? 'Mark as unread' : 'Mark as read'}
        >
          <Check />
        </button>
        <button
          className={`action-btn ${isFavorite ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star />
        </button>
        <button
          className={`action-btn ${isBookmarked ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark();
          }}
          title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
          <Bookmark />
        </button>
      </div>
    </motion.div>
  );
});

export default Sidebar;
