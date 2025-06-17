import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import './GestureHint.scss';

const GestureHint = () => {
  const [showHint, setShowHint] = useState(false);
  const [hintType, setHintType] = useState('swipe'); // 'swipe', 'sidebar'

  useEffect(() => {
    // Show hint on first mobile visit
    const hasSeenHint = localStorage.getItem('gesture-hint-seen');
    const isMobile = window.innerWidth <= 767;
    
    if (!hasSeenHint && isMobile) {
      setTimeout(() => {
        setShowHint(true);
        setHintType('sidebar');
      }, 2000);
    }
  }, []);

  const hideHint = () => {
    setShowHint(false);
    localStorage.setItem('gesture-hint-seen', 'true');
  };

  const showSwipeHint = () => {
    if (window.innerWidth <= 767) {
      setHintType('swipe');
      setShowHint(true);
      setTimeout(hideHint, 3000);
    }
  };

  // Expose function globally for other components to trigger
  useEffect(() => {
    window.showGestureHint = showSwipeHint;
    return () => {
      delete window.showGestureHint;
    };
  }, []);

  return (
    <AnimatePresence>
      {showHint && (
        <motion.div
          className="gesture-hint-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={hideHint}
        >
          <motion.div
            className={`gesture-hint ${hintType}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={(e) => e.stopPropagation()}
          >
            {hintType === 'sidebar' && (
              <div className="hint-content">
                <div className="hint-icon">
                  <Menu size={32} />
                </div>
                <h3>Touch Gestures</h3>
                <div className="gesture-list">
                  <div className="gesture-item">
                    <ChevronRight size={20} />
                    <span>Swipe right from left edge to open sidebar</span>
                  </div>
                  <div className="gesture-item">
                    <ChevronLeft size={20} />
                    <span>Swipe left in sidebar to close</span>
                  </div>
                  <div className="gesture-item">
                    <div className="swipe-arrows">
                      <ChevronLeft size={16} />
                      <ChevronRight size={16} />
                    </div>
                    <span>Swipe left/right in content to navigate chapters</span>
                  </div>
                </div>
                <button className="got-it-btn" onClick={hideHint}>
                  Got it!
                </button>
              </div>
            )}

            {hintType === 'swipe' && (
              <div className="hint-content swipe-hint">
                <div className="swipe-animation">
                  <motion.div
                    className="swipe-indicator"
                    initial={{ x: -20, opacity: 0.5 }}
                    animate={{ x: 20, opacity: 1 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    <ChevronRight size={24} />
                  </motion.div>
                </div>
                <p>Swipe to navigate chapters</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GestureHint;
