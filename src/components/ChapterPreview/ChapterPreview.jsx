import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, BookOpen, Eye, Star, Bookmark } from 'lucide-react';
import useBookStore from '../../store/useBookStore';
import './ChapterPreview.scss';

const ChapterPreview = ({ chapter, children, disabled = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef(null);
  const triggerRef = useRef(null);

  const {
    readChapters,
    favorites,
    bookmarks,
    getChapterNote,
    getChapterAnnotations,
  } = useBookStore();

  const isRead = readChapters.has(chapter.id);
  const isFavorite = favorites.has(chapter.id);
  const isBookmarked = bookmarks.has(chapter.id);
  const note = getChapterNote(chapter.id);
  const annotations = getChapterAnnotations(chapter.id);

  const handleMouseEnter = (e) => {
    if (disabled) return;
    
    clearTimeout(timeoutRef.current);
    
    // Calculate position
    const rect = e.currentTarget.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const previewWidth = 320;
    const previewHeight = 400;
    
    let x = rect.right + 10;
    let y = rect.top;
    
    // Adjust if preview would go off-screen
    if (x + previewWidth > viewportWidth) {
      x = rect.left - previewWidth - 10;
    }
    
    if (y + previewHeight > viewportHeight) {
      y = viewportHeight - previewHeight - 10;
    }
    
    if (y < 10) {
      y = 10;
    }
    
    setPosition({ x, y });
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, 500); // 500ms delay before showing
  };

  const handleMouseLeave = () => {
    clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  // Extract first paragraph for preview
  const getPreviewText = () => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = chapter.content;
    const paragraphs = tempDiv.querySelectorAll('p');
    
    if (paragraphs.length > 0) {
      let text = paragraphs[0].textContent;
      if (text.length > 200) {
        text = text.substring(0, 200) + '...';
      }
      return text;
    }
    
    return 'No preview available.';
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="chapter-preview-trigger"
      >
        {children}
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="chapter-preview-popup"
            style={{
              position: 'fixed',
              left: position.x,
              top: position.y,
              zIndex: 10000,
            }}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="preview-header">
              <h3 className="preview-title">{chapter.title}</h3>
              <div className="preview-badges">
                {isRead && (
                  <span className="badge read-badge">
                    <Eye size={12} />
                    Read
                  </span>
                )}
                {isFavorite && (
                  <span className="badge favorite-badge">
                    <Star size={12} />
                    Favorite
                  </span>
                )}
                {isBookmarked && (
                  <span className="badge bookmark-badge">
                    <Bookmark size={12} />
                    Bookmarked
                  </span>
                )}
              </div>
            </div>

            <div className="preview-meta">
              <div className="meta-item">
                <Clock size={14} />
                <span>{chapter.estimatedReadTime} min read</span>
              </div>
              <div className="meta-item">
                <BookOpen size={14} />
                <span>{chapter.wordCount} words</span>
              </div>
            </div>

            <div className="preview-content">
              <p className="preview-text">{getPreviewText()}</p>
            </div>

            {note && (
              <div className="preview-note">
                <h4>Your Note:</h4>
                <p>{note.text}</p>
              </div>
            )}

            {annotations.length > 0 && (
              <div className="preview-annotations">
                <h4>Annotations ({annotations.length}):</h4>
                <div className="annotation-list">
                  {annotations.slice(0, 2).map((annotation) => (
                    <div key={annotation.id} className="annotation-item">
                      <p>"{annotation.text}"</p>
                    </div>
                  ))}
                  {annotations.length > 2 && (
                    <p className="more-annotations">
                      +{annotations.length - 2} more annotations
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="preview-footer">
              <span className="preview-hint">Click to read chapter</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChapterPreview;
