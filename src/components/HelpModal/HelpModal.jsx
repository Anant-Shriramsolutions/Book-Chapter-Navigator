import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Keyboard, Mouse, Smartphone } from 'lucide-react';
import './HelpModal.scss';

const HelpModal = ({ isOpen, onClose }) => {
  const keyboardShortcuts = [
    { key: '← / h', description: 'Previous chapter' },
    { key: '→ / l', description: 'Next chapter' },
    { key: 's', description: 'Toggle sidebar' },
    { key: 'm', description: 'Mark chapter as read/unread' },
    { key: 'f', description: 'Toggle favorite' },
    { key: 'b', description: 'Toggle bookmark' },
    { key: 'Home', description: 'Scroll to top' },
    { key: 'End', description: 'Scroll to bottom' },
    { key: 'Esc', description: 'Close modals' },
  ];

  const mouseActions = [
    { action: 'Click chapter', description: 'Open chapter for reading' },
    { action: 'Hover chapter', description: 'Show chapter preview' },
    { action: 'Right-click chapter', description: 'Quick actions menu' },
    { action: 'Scroll in reading area', description: 'Auto-mark as read at 90%' },
  ];

  const touchGestures = [
    { gesture: 'Swipe left/right', description: 'Navigate between chapters' },
    { gesture: 'Tap menu button', description: 'Toggle sidebar' },
    { gesture: 'Long press chapter', description: 'Show quick actions' },
    { gesture: 'Pull to refresh', description: 'Refresh content' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="help-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="help-modal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Help & Shortcuts</h2>
              <button className="close-btn" onClick={onClose}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-content">
              <div className="help-section">
                <h3>
                  <Keyboard size={18} />
                  Keyboard Shortcuts
                </h3>
                <div className="shortcuts-grid">
                  {keyboardShortcuts.map((shortcut, index) => (
                    <div key={index} className="shortcut-item">
                      <kbd className="shortcut-key">{shortcut.key}</kbd>
                      <span className="shortcut-description">{shortcut.description}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="help-section">
                <h3>
                  <Mouse size={18} />
                  Mouse Actions
                </h3>
                <div className="actions-list">
                  {mouseActions.map((action, index) => (
                    <div key={index} className="action-item">
                      <strong>{action.action}</strong>
                      <span>{action.description}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="help-section">
                <h3>
                  <Smartphone size={18} />
                  Touch Gestures (Mobile)
                </h3>
                <div className="actions-list">
                  {touchGestures.map((gesture, index) => (
                    <div key={index} className="action-item">
                      <strong>{gesture.gesture}</strong>
                      <span>{gesture.description}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="help-section">
                <h3>Features</h3>
                <div className="features-list">
                  <div className="feature-item">
                    <h4>Reading Progress</h4>
                    <p>Track your reading progress with automatic chapter completion detection and reading statistics.</p>
                  </div>
                  <div className="feature-item">
                    <h4>Notes & Annotations</h4>
                    <p>Add personal notes and annotations to chapters. Access them anytime from the notes panel.</p>
                  </div>
                  <div className="feature-item">
                    <h4>Bookmarks & Favorites</h4>
                    <p>Mark important chapters as favorites or bookmark them for quick access later.</p>
                  </div>
                  <div className="feature-item">
                    <h4>Customizable Reading Experience</h4>
                    <p>Adjust font size, font family, line spacing, and switch between light and dark themes.</p>
                  </div>
                  <div className="feature-item">
                    <h4>Search & Filter</h4>
                    <p>Quickly find chapters by title or filter by reading status and favorites.</p>
                  </div>
                  <div className="feature-item">
                    <h4>Responsive Design</h4>
                    <p>Optimized for desktop, tablet, and mobile devices with touch-friendly controls.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <p>Press <kbd>?</kbd> anytime to open this help dialog</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HelpModal;
