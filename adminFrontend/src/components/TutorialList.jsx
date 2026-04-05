
// ============================================
// adminFrontend/src/components/TutorialList.jsx
// ============================================
import React, { useState, useEffect } from 'react';
import { getAllTutorials, deleteTutorial } from '../services/api';
import './TutorialList.css';

const TutorialList = () => {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedDescriptions, setExpandedDescriptions] = useState(new Set());
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    fetchTutorials();
  }, []);

  const fetchTutorials = async () => {
    try {
      setLoading(true);
      const response = await getAllTutorials();
      setTutorials(response.tutorials);
      setError('');
    } catch (err) {
      setError('Failed to load tutorials. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (tutorialId, tutorialTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${tutorialTitle}" tutorial?`)) {
      return;
    }

    try {
      setDeleting(tutorialId);
      await deleteTutorial(tutorialId);
      setTutorials(tutorials.filter(tutorial => tutorial._id !== tutorialId));
    } catch (err) {
      alert('Failed to delete tutorial. Please try again.');
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  const toggleDescription = (tutorialId) => {
    const newExpanded = new Set(expandedDescriptions);
    if (newExpanded.has(tutorialId)) {
      newExpanded.delete(tutorialId);
    } else {
      newExpanded.add(tutorialId);
    }
    setExpandedDescriptions(newExpanded);
  };

  const getCategories = () => {
    const categories = [...new Set(tutorials.map(t => t.category))];
    return categories.sort();
  };

  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesSearch = 
      tutorial.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tutorial.description?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = filterCategory === 'all' || tutorial.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/ ;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading tutorials...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <svg className="error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p>{error}</p>
        <button className="retry-btn" onClick={fetchTutorials}>Retry</button>
      </div>
    );
  }

  const categories = getCategories();

  return (
    <div className="tutorial-list-container">
      <div className="header-section">
        <div className="title-wrapper">
          <h2 className="section-title">Tutorial Management</h2>
          <p className="section-subtitle">Manage and organize educational content for parents</p>
        </div>
        
        <div className="stats-cards">
          <div className="stat-card stat-primary">
            <div className="stat-icon">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{tutorials.length}</div>
              <div className="stat-label">Total Tutorials</div>
            </div>
          </div>
          <div className="stat-card stat-secondary">
            <div className="stat-icon">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{categories.length}</div>
              <div className="stat-label">Categories</div>
            </div>
          </div>
          <div className="stat-card stat-tertiary">
            <div className="stat-icon">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{filteredTutorials.length}</div>
              <div className="stat-label">Filtered Results</div>
            </div>
          </div>
        </div>
      </div>

      <div className="filter-section">
        <div className="search-wrapper">
          <svg className="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search tutorials by category or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="category-filter">
          <button
            className={`filter-btn ${filterCategory === 'all' ? 'active' : ''}`}
            onClick={() => setFilterCategory('all')}
          >
            All Categories
          </button>
          {categories.map(category => (
            <button
              key={category}
              className={`filter-btn ${filterCategory === category ? 'active' : ''}`}
              onClick={() => setFilterCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {filteredTutorials.length === 0 ? (
        <div className="empty-state">
          <svg className="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="empty-title">No tutorials found</p>
          <p className="empty-text">
            {searchTerm || filterCategory !== 'all' 
              ? 'Try adjusting your filters or search terms' 
              : 'No tutorials are available yet'}
          </p>
        </div>
      ) : (
        <div className="tutorials-grid">
          {filteredTutorials.map((tutorial) => {
            const isExpanded = expandedDescriptions.has(tutorial._id);
            const videoId = getVideoId(tutorial.video_link);
            const hasDescription = tutorial.description && tutorial.description.trim().length > 0;
            
            return (
              <div key={tutorial._id} className="tutorial-card">
                <div className="tutorial-header">
                  <div className="category-badge">
                    <svg className="badge-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span>{tutorial.category}</span>
                  </div>
                </div>

                {videoId && (
                  <div className="video-preview">
                    <img 
                      src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                      alt={tutorial.category}
                      onError={(e) => {
                        e.target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                      }}
                    />
                    <div className="play-overlay">
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                  </div>
                )}

                <div className="tutorial-content">
                  <a 
                    href={tutorial.video_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="tutorial-link"
                  >
                    <svg className="link-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span>View Tutorial</span>
                  </a>

                  {hasDescription && (
                    <div className="description-section">
                      <div className={`tutorial-description ${isExpanded ? 'expanded' : 'collapsed'}`}>
                        {tutorial.description}
                      </div>
                      {tutorial.description.length > 150 && (
                        <button 
                          className="read-more-btn"
                          onClick={() => toggleDescription(tutorial._id)}
                        >
                          {isExpanded ? 'Show Less' : 'Read More'}
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="card-footer">
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(tutorial._id, tutorial.category)}
                    disabled={deleting === tutorial._id}
                  >
                    {deleting === tutorial._id ? (
                      <>
                        <span className="btn-spinner"></span>
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <svg className="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Delete Tutorial</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TutorialList;
