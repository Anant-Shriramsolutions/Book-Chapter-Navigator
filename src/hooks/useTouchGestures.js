import { useEffect, useRef } from 'react';
import useBookStore from '../store/useBookStore';
import { getNextChapter, getPreviousChapter } from '../data/mockData';

const useTouchGestures = () => {
  const {
    currentChapter,
    sidebarCollapsed,
    setCurrentChapter,
    toggleSidebar,
  } = useBookStore();

  const touchStartRef = useRef(null);
  const touchEndRef = useRef(null);

  useEffect(() => {
    const handleTouchStart = (e) => {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now(),
      };
    };

    const handleTouchMove = (e) => {
      if (!touchStartRef.current) return;
      
      touchEndRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };

    const handleTouchEnd = (e) => {
      if (!touchStartRef.current || !touchEndRef.current) return;

      const deltaX = touchEndRef.current.x - touchStartRef.current.x;
      const deltaY = touchEndRef.current.y - touchStartRef.current.y;
      const deltaTime = Date.now() - touchStartRef.current.time;

      // Only process swipes that are:
      // - Fast enough (< 500ms)
      // - Long enough (> 50px)
      // - More horizontal than vertical
      if (deltaTime < 500 && Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
        const startX = touchStartRef.current.x;
        const screenWidth = window.innerWidth;

        // Left edge swipe (first 50px of screen) - toggle sidebar
        if (startX < 50) {
          if (deltaX > 0) {
            // Swipe right from left edge - open sidebar
            if (sidebarCollapsed) {
              // Set user toggle flag to prevent auto-collapse when opening
              if (window.setUserToggledSidebar) {
                window.setUserToggledSidebar(true);
              }
              toggleSidebar();
            }
          }
        }
        // Sidebar area swipe - close sidebar
        else if (startX < 320 && !sidebarCollapsed) {
          if (deltaX < 0) {
            // Swipe left in sidebar area - close sidebar
            // Reset flag when closing to allow auto-collapse behavior
            if (window.setUserToggledSidebar) {
              window.setUserToggledSidebar(false);
            }
            toggleSidebar();
          }
        }
        // Main content area swipes - navigate chapters
        else if (startX > (sidebarCollapsed ? 0 : 320)) {
          if (currentChapter) {
            if (deltaX > 0) {
              // Swipe right - previous chapter
              const prevChapter = getPreviousChapter(currentChapter);
              if (prevChapter) {
                setCurrentChapter(prevChapter.id);
              }
            } else {
              // Swipe left - next chapter
              const nextChapter = getNextChapter(currentChapter);
              if (nextChapter) {
                setCurrentChapter(nextChapter.id);
              }
            }
          }
        }
      }

      // Reset touch tracking
      touchStartRef.current = null;
      touchEndRef.current = null;
    };

    // Only add touch listeners on mobile devices
    if ('ontouchstart' in window) {
      document.addEventListener('touchstart', handleTouchStart, { passive: true });
      document.addEventListener('touchmove', handleTouchMove, { passive: true });
      document.addEventListener('touchend', handleTouchEnd, { passive: true });

      return () => {
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [currentChapter, sidebarCollapsed, setCurrentChapter, toggleSidebar]);
};

export default useTouchGestures;
