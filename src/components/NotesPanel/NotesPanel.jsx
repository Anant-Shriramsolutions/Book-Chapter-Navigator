import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  X,
  StickyNote,
  Quote
} from 'lucide-react';
import useBookStore from '../../store/useBookStore';
import './NotesPanel.scss';

const NotesPanel = ({ chapterId, isOpen, onClose }) => {
  const {
    getChapterNote,
    getChapterAnnotations,
    addNote,
    removeNote,
    addAnnotation,
    removeAnnotation,
  } = useBookStore();

  const [noteText, setNoteText] = useState('');
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [newAnnotation, setNewAnnotation] = useState('');
  const [isAddingAnnotation, setIsAddingAnnotation] = useState(false);

  const note = getChapterNote(chapterId);
  const annotations = getChapterAnnotations(chapterId);

  React.useEffect(() => {
    if (note) {
      setNoteText(note.text);
    } else {
      setNoteText('');
    }
  }, [note, chapterId]);

  const handleSaveNote = () => {
    if (noteText.trim()) {
      addNote(chapterId, noteText.trim());
    } else if (note) {
      removeNote(chapterId);
    }
    setIsEditingNote(false);
  };

  const handleCancelNote = () => {
    setNoteText(note ? note.text : '');
    setIsEditingNote(false);
  };

  const handleAddAnnotation = () => {
    if (newAnnotation.trim()) {
      addAnnotation(chapterId, newAnnotation.trim(), null);
      setNewAnnotation('');
      setIsAddingAnnotation(false);
    }
  };

  const handleDeleteAnnotation = (annotationId) => {
    removeAnnotation(chapterId, annotationId);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="notes-panel-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="notes-panel"
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="panel-header">
              <h2>
                <MessageSquare size={20} />
                Notes & Annotations
              </h2>
              <button className="close-btn" onClick={onClose}>
                <X size={20} />
              </button>
            </div>

            <div className="panel-content">
              {/* Chapter Note Section */}
              <div className="note-section">
                <div className="section-header">
                  <h3>
                    <StickyNote size={16} />
                    Chapter Note
                  </h3>
                  {!isEditingNote && (
                    <button
                      className="edit-btn"
                      onClick={() => setIsEditingNote(true)}
                    >
                      {note ? <Edit3 size={14} /> : <Plus size={14} />}
                    </button>
                  )}
                </div>

                {isEditingNote ? (
                  <div className="note-editor">
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Write your note about this chapter..."
                      className="note-textarea"
                      rows={4}
                      autoFocus
                    />
                    <div className="editor-actions">
                      <button
                        className="save-btn"
                        onClick={handleSaveNote}
                      >
                        <Save size={14} />
                        Save
                      </button>
                      <button
                        className="cancel-btn"
                        onClick={handleCancelNote}
                      >
                        <X size={14} />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="note-display">
                    {note ? (
                      <div className="note-content">
                        <p>{note.text}</p>
                        <span className="note-date">
                          {formatDate(note.timestamp)}
                        </span>
                      </div>
                    ) : (
                      <div className="no-note">
                        <p>No note for this chapter yet.</p>
                        <button
                          className="add-note-btn"
                          onClick={() => setIsEditingNote(true)}
                        >
                          <Plus size={16} />
                          Add Note
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Annotations Section */}
              <div className="annotations-section">
                <div className="section-header">
                  <h3>
                    <Quote size={16} />
                    Annotations ({annotations.length})
                  </h3>
                  {!isAddingAnnotation && (
                    <button
                      className="add-btn"
                      onClick={() => setIsAddingAnnotation(true)}
                    >
                      <Plus size={14} />
                    </button>
                  )}
                </div>

                {isAddingAnnotation && (
                  <div className="annotation-editor">
                    <textarea
                      value={newAnnotation}
                      onChange={(e) => setNewAnnotation(e.target.value)}
                      placeholder="Add an annotation or highlight..."
                      className="annotation-textarea"
                      rows={3}
                      autoFocus
                    />
                    <div className="editor-actions">
                      <button
                        className="save-btn"
                        onClick={handleAddAnnotation}
                      >
                        <Save size={14} />
                        Add
                      </button>
                      <button
                        className="cancel-btn"
                        onClick={() => {
                          setNewAnnotation('');
                          setIsAddingAnnotation(false);
                        }}
                      >
                        <X size={14} />
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="annotations-list">
                  {annotations.length > 0 ? (
                    annotations.map((annotation) => (
                      <motion.div
                        key={annotation.id}
                        className="annotation-item"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <div className="annotation-content">
                          <p>"{annotation.text}"</p>
                          <span className="annotation-date">
                            {formatDate(annotation.timestamp)}
                          </span>
                        </div>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteAnnotation(annotation.id)}
                          title="Delete annotation"
                        >
                          <Trash2 size={14} />
                        </button>
                      </motion.div>
                    ))
                  ) : (
                    <div className="no-annotations">
                      <p>No annotations yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotesPanel;
