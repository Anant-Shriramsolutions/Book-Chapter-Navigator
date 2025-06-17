import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Menu, X, HelpCircle, Sun, Moon, ArrowUp } from 'lucide-react';
import Sidebar from './components/Sidebar/Sidebar';
import ChapterContent from './components/ChapterContent/ChapterContent';
import ProgressTracker from './components/ProgressTracker/ProgressTracker';
import GestureHint from './components/GestureHint/GestureHint';
import useBookStore from './store/useBookStore';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';
import useTouchGestures from './hooks/useTouchGestures';
import './App.scss';

function App() {
  const { theme, sidebarCollapsed, setSidebarCollapsed, setTheme } = useBookStore();
  const [showProgressTracker, setShowProgressTracker] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [userToggledSidebar, setUserToggledSidebar] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Enable keyboard shortcuts and touch gestures
  // useKeyboardShortcuts(() => setShowHelp(true));
  useTouchGestures();

  // Expose setUserToggledSidebar globally for touch gestures
  useEffect(() => {
    window.setUserToggledSidebar = setUserToggledSidebar;
    return () => {
      delete window.setUserToggledSidebar;
    };
  }, []);

  // Handle scroll events for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      const contentContainer = document.querySelector('.content-container');
      if (contentContainer) {
        const scrollTop = contentContainer.scrollTop;
        setShowScrollTop(scrollTop > 300);
      }
    };

    const contentContainer = document.querySelector('.content-container');
    if (contentContainer) {
      contentContainer.addEventListener('scroll', handleScroll);
      return () => contentContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToTop = () => {
    const contentContainer = document.querySelector('.content-container');
    if (contentContainer) {
      contentContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };



  // Handle responsive design
  useEffect(() => {
    const checkResponsive = () => {
      const width = window.innerWidth;
      const mobile = width <= 767;
      const tablet = width >= 768 && width <= 1023;
      const laptop = width >= 1024 && width <= 1439;
      const desktop = width >= 1440;

      setIsMobile(mobile);

      // Only auto-collapse sidebar on mobile if user hasn't manually toggled it
      if (mobile && !sidebarCollapsed && !userToggledSidebar) {
        setSidebarCollapsed(true);
        localStorage.setItem('sidebar-auto-collapsed', 'true');
      }

      // Auto-expand sidebar on larger screens if it was collapsed due to mobile
      if (!mobile && sidebarCollapsed && localStorage.getItem('sidebar-auto-collapsed') === 'true') {
        setSidebarCollapsed(false);
        localStorage.removeItem('sidebar-auto-collapsed');
        setUserToggledSidebar(false);
      }
    };

    checkResponsive();
    window.addEventListener('resize', checkResponsive);
    return () => window.removeEventListener('resize', checkResponsive);
  }, [sidebarCollapsed, setSidebarCollapsed, userToggledSidebar]);

  // Apply theme to document
  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', theme);
    } catch (error) {
      console.error('Error setting theme:', error);
    }
  }, [theme]);

  const toggleMobileSidebar = () => {
    const newCollapsedState = !sidebarCollapsed;

    // Set user toggle flag when opening, reset when closing
    if (newCollapsedState) {
      // Closing sidebar - reset flag to allow auto-collapse behavior
      setUserToggledSidebar(false);
    } else {
      // Opening sidebar - set flag to prevent auto-collapse
      setUserToggledSidebar(true);
    }

    setSidebarCollapsed(newCollapsedState);
  };

  return (
    <div className={`app ${theme}`} data-theme={theme}>
      {/* Mobile Header */}
      {isMobile && (
        <div className="mobile-header">
          <button
            className="mobile-menu-btn"
            onClick={toggleMobileSidebar}
          >
            {sidebarCollapsed ? <Menu size={24} /> : <X size={24} />}
          </button>

          <h1 className="mobile-title">Book Reader</h1>

          <div className="mobile-actions">
            <button
              className="mobile-theme-btn"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            >
              {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
            </button>
            <button
              className="mobile-progress-btn"
              onClick={() => setShowProgressTracker(true)}
            >
              <BarChart3 size={24} />
            </button>
          </div>
        </div>
      )}

      {/* Desktop Action Buttons */}
      {!isMobile && (
        <>
          <motion.button
            className="floating-theme-btn"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </motion.button>

          <motion.button
            className="floating-progress-btn"
            onClick={() => setShowProgressTracker(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            title="View reading progress"
          >
            <BarChart3 size={20} />
          </motion.button>

          {/* Scroll to Top Button */}
          <AnimatePresence>
            {showScrollTop && (
              <motion.button
                className="floating-scroll-top-btn"
                onClick={scrollToTop}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: 0.2 }}
                title="Scroll to top"
              >
                <ArrowUp size={20} />
              </motion.button>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Main Layout */}
      <div className="app-layout">
        <Sidebar />
        <ChapterContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobile && !sidebarCollapsed && (
        <div
          className="mobile-sidebar-overlay"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Progress Tracker Modal */}
      <ProgressTracker
        isOpen={showProgressTracker}
        onClose={() => setShowProgressTracker(false)}
      />

      {/* Gesture Hint for Mobile */}
      <GestureHint />
    </div>
  );
}

export default App;
