import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  RotateCcw, 
  Trash2, 
  TrendingUp,
  Calendar,
  Clock,
  BookOpen,
  Award
} from 'lucide-react';
import useBookStore from '../../store/useBookStore';
import { getTotalChapters } from '../../data/mockData';
import './ProgressTracker.scss';

const ProgressTracker = ({ isOpen, onClose }) => {
  const {
    readChapters,
    chaptersReadToday,
    readingStreak,
    totalReadingTime,
    lastReadDate,
    markAllAsRead,
    clearAllProgress,
    getReadingProgress,
  } = useBookStore();

  const totalChapters = getTotalChapters();
  const readCount = readChapters instanceof Set ? readChapters.size : 0;
  const progress = getReadingProgress();

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleClearProgress = () => {
    clearAllProgress();
  };

  const formatReadingTime = (minutes) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const getProgressColor = () => {
    if (progress < 25) return '#ef4444'; // red
    if (progress < 50) return '#f97316'; // orange
    if (progress < 75) return '#eab308'; // yellow
    return '#22c55e'; // green
  };

  const getStreakBadge = () => {
    if (readingStreak >= 30) return { icon: '🏆', text: 'Master Reader', color: '#ffd700' };
    if (readingStreak >= 14) return { icon: '🔥', text: 'On Fire!', color: '#ff6b35' };
    if (readingStreak >= 7) return { icon: '⭐', text: 'Great Streak', color: '#4f46e5' };
    if (readingStreak >= 3) return { icon: '📚', text: 'Getting Started', color: '#059669' };
    return null;
  };

  const badge = getStreakBadge();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="progress-tracker-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="progress-tracker-panel"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="panel-header">
              <h2>Reading Progress</h2>
              <button className="close-btn" onClick={onClose}>×</button>
            </div>

            <div className="progress-overview">
              {/* Circular Progress */}
              <div className="circular-progress">
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="var(--progress-bg)"
                    strokeWidth="8"
                  />
                  <motion.circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke={getProgressColor()}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 50}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                    animate={{ 
                      strokeDashoffset: 2 * Math.PI * 50 * (1 - progress / 100) 
                    }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    style={{ transformOrigin: '60px 60px', transform: 'rotate(-90deg)' }}
                  />
                </svg>
                <div className="progress-text">
                  <span className="percentage">{Math.round(progress)}%</span>
                  <span className="label">Complete</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="stats-grid">
                <div className="stat-item">
                  <BookOpen className="stat-icon" />
                  <div className="stat-content">
                    <span className="stat-value">{readCount}/{totalChapters}</span>
                    <span className="stat-label">Chapters Read</span>
                  </div>
                </div>

                <div className="stat-item">
                  <Calendar className="stat-icon" />
                  <div className="stat-content">
                    <span className="stat-value">{chaptersReadToday}</span>
                    <span className="stat-label">Today</span>
                  </div>
                </div>

                <div className="stat-item">
                  <TrendingUp className="stat-icon" />
                  <div className="stat-content">
                    <span className="stat-value">{readingStreak}</span>
                    <span className="stat-label">Day Streak</span>
                  </div>
                </div>

                <div className="stat-item">
                  <Clock className="stat-icon" />
                  <div className="stat-content">
                    <span className="stat-value">{formatReadingTime(totalReadingTime)}</span>
                    <span className="stat-label">Total Time</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievement Badge */}
            {badge && (
              <motion.div
                className="achievement-badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                style={{ borderColor: badge.color }}
              >
                <span className="badge-icon">{badge.icon}</span>
                <span className="badge-text" style={{ color: badge.color }}>
                  {badge.text}
                </span>
              </motion.div>
            )}

            {/* Last Read Info */}
            {lastReadDate && (
              <div className="last-read-info">
                <span>Last read: {new Date(lastReadDate).toLocaleDateString()}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="action-buttons">
              <motion.button
                className="action-btn mark-all-btn"
                onClick={handleMarkAllAsRead}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={readCount === totalChapters}
              >
                <CheckCircle size={18} />
                Mark All as Read
              </motion.button>

              <motion.button
                className="action-btn clear-btn"
                onClick={handleClearProgress}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={readCount === 0}
              >
                <Trash2 size={18} />
                Clear Progress
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProgressTracker;
