import React from 'react';
import { motion } from 'framer-motion';
import './LoadingSpinner.scss';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  };

  return (
    <div className={`loading-spinner ${sizeClasses[size]}`}>
      <motion.div
        className="spinner"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className="spinner-circle"></div>
      </motion.div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

// Skeleton loader for chapter content
export const ChapterSkeleton = () => {
  return (
    <div className="chapter-skeleton">
      <div className="skeleton-header">
        <div className="skeleton-title"></div>
        <div className="skeleton-meta">
          <div className="skeleton-meta-item"></div>
          <div className="skeleton-meta-item"></div>
        </div>
      </div>
      <div className="skeleton-content">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="skeleton-line" style={{ width: `${Math.random() * 30 + 70}%` }}></div>
        ))}
      </div>
    </div>
  );
};

// Skeleton loader for sidebar
export const SidebarSkeleton = () => {
  return (
    <div className="sidebar-skeleton">
      <div className="skeleton-header">
        <div className="skeleton-book-title"></div>
        <div className="skeleton-progress"></div>
      </div>
      <div className="skeleton-search"></div>
      <div className="skeleton-chapters">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="skeleton-chapter">
            <div className="skeleton-chapter-title"></div>
            <div className="skeleton-chapter-meta"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSpinner;
