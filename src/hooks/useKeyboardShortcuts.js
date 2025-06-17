import { useEffect } from 'react';
import useBookStore from '../store/useBookStore';
import { getNextChapter, getPreviousChapter } from '../data/mockData';

const useKeyboardShortcuts = (onShowHelp) => {
  const {
    currentChapter,
    sidebarCollapsed,
    setCurrentChapter,
    toggleSidebar,
    toggleChapterReadStatus,
    toggleFavorite,
    toggleBookmark,
  } = useBookStore();

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Don't trigger shortcuts when typing in inputs
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
      }

      // Don't trigger shortcuts when modifier keys are pressed (except for specific combinations)
      if (event.altKey || event.metaKey) {
        return;
      }

      switch (event.key) {
        case 'ArrowLeft':
        case 'h':
          // Previous chapter
          if (currentChapter) {
            const prevChapter = getPreviousChapter(currentChapter);
            if (prevChapter) {
              setCurrentChapter(prevChapter.id);
              event.preventDefault();
            }
          }
          break;

        case 'ArrowRight':
        case 'l':
          // Next chapter
          if (currentChapter) {
            const nextChapter = getNextChapter(currentChapter);
            if (nextChapter) {
              setCurrentChapter(nextChapter.id);
              event.preventDefault();
            }
          }
          break;

        case 's':
          // Toggle sidebar
          if (event.ctrlKey || event.metaKey) {
            return; // Let browser handle Ctrl+S
          }
          toggleSidebar();
          event.preventDefault();
          break;

        case 'm':
          // Mark as read/unread
          if (currentChapter) {
            toggleChapterReadStatus(currentChapter);
            event.preventDefault();
          }
          break;

        case 'f':
          // Toggle favorite
          if (currentChapter) {
            toggleFavorite(currentChapter);
            event.preventDefault();
          }
          break;

        case 'b':
          // Toggle bookmark
          if (currentChapter) {
            toggleBookmark(currentChapter);
            event.preventDefault();
          }
          break;

        case 'Home':
          // Scroll to top
          window.scrollTo({ top: 0, behavior: 'smooth' });
          event.preventDefault();
          break;

        case 'End':
          // Scroll to bottom
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
          event.preventDefault();
          break;

        case '?':
          // Show help
          if (onShowHelp) {
            onShowHelp();
          }
          event.preventDefault();
          break;

        case 'Escape':
          // Close any open modals/panels
          // This would need to be implemented with a global state
          event.preventDefault();
          break;

        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    currentChapter,
    sidebarCollapsed,
    setCurrentChapter,
    toggleSidebar,
    toggleChapterReadStatus,
    toggleFavorite,
    toggleBookmark,
    onShowHelp,
  ]);
};

export default useKeyboardShortcuts;
