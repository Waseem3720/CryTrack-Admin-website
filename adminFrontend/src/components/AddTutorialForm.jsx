
// ============================================
// adminFrontend/src/components/AddTutorialForm.jsx
// ============================================
import React, { useState } from 'react';
import { createTutorial } from '../services/api';
import './AddTutorialForm.css';

const AddTutorialForm = () => {
  const [formData, setFormData] = useState({
    category: '',
    video_link: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError('');
    setSuccess('');
    // Clear field-specific error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: '' });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.category.trim()) {
      errors.category = 'Category is required';
    } else if (formData.category.length < 3) {
      errors.category = 'Category must be at least 3 characters';
    }

    if (!formData.video_link.trim()) {
      errors.video_link = 'Video link is required';
    } else if (!isValidUrl(formData.video_link)) {
      errors.video_link = 'Please enter a valid URL';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await createTutorial(formData);
      setSuccess('Tutorial added successfully!');
      setFormData({
        category: '',
        video_link: '',
        description: ''
      });
      setFieldErrors({});
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add tutorial. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getVideoId(formData.video_link);

  return (
    <div className="add-tutorial-container">
      <div className="header-section">
        <div className="title-wrapper">
          <h2 className="section-title">Add New Tutorial</h2>
          <p className="section-subtitle">Create educational content for parents</p>
        </div>
      </div>

      <div className="form-layout">
        <div className="form-card">
          <form onSubmit={handleSubmit} className="tutorial-form">
            <div className="form-group">
              <label htmlFor="category">
                Category
                <span className="required">*</span>
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g., Hunger, Pain, Sleep Issues"
                className={fieldErrors.category ? 'error' : ''}
              />
              {fieldErrors.category && (
                <span className="field-error">{fieldErrors.category}</span>
              )}
              <div className="char-count">
                {formData.category.length} / 50
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="video_link">
                Video Link
                <span className="required">*</span>
              </label>
              <input
                type="url"
                id="video_link"
                name="video_link"
                value={formData.video_link}
                onChange={handleChange}
                placeholder="https://www.youtube.com/watch?v=..."
                className={fieldErrors.video_link ? 'error' : ''}
              />
              {fieldErrors.video_link && (
                <span className="field-error">{fieldErrors.video_link}</span>
              )}
              {formData.video_link && !fieldErrors.video_link && isValidUrl(formData.video_link) && (
                <div className="url-valid">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Valid URL
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="description">
                Description
                <span className="optional">Optional</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide additional information about this tutorial"
                rows="5"
                maxLength="500"
              />
              <div className="char-count">
                {formData.description.length} / 500
              </div>
            </div>

            {error && (
              <div className="error-message">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}
            {success && (
              <div className="success-message">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {success}
              </div>
            )}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="btn-spinner"></span>
                  <span>Adding Tutorial...</span>
                </>
              ) : (
                <>
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add Tutorial</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Preview Section */}
        <div className="preview-card">
          <h3 className="preview-title">Preview</h3>
          <div className="preview-content">
            {formData.category || formData.video_link || formData.description ? (
              <>
                {formData.category && (
                  <div className="preview-category">
                    <span className="preview-label">Category:</span>
                    <span className="preview-value">{formData.category}</span>
                  </div>
                )}
                
                {videoId && (
                  <div className="preview-video">
                    <img 
                      src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                      alt="Video preview"
                    />
                    <div className="play-icon">
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                  </div>
                )}
                
                {formData.description && (
                  <div className="preview-description">
                    <span className="preview-label">Description:</span>
                    <p>{formData.description}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="preview-empty">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <p>Fill in the form to see a preview</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTutorialForm;

