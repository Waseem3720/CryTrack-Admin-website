 
// ============================================
// adminBackend/src/controllers/tutorialController.js
// ============================================
const Tutorial = require('../models/Tutorial');

// @desc    Get all tutorials
// @route   GET /api/tutorials
// @access  Private (Admin only)
exports.getAllTutorials = async (req, res) => {
  try {
    const tutorials = await Tutorial.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tutorials.length,
      tutorials
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new tutorial
// @route   POST /api/tutorials
// @access  Private (Admin only)
exports.createTutorial = async (req, res) => {
  try {
    const { title, category, video_link, description } = req.body;

    // Validate input
    if (!category || !video_link) {
      return res.status(400).json({
        success: false,
        message: 'Please provide category and video link'
      });
    }

    // Create title from category if not provided
    const tutorialTitle = title || category;

    const tutorial = await Tutorial.create({
      title: tutorialTitle,
      category,
      video_link,
      description: description || ''
    });

    res.status(201).json({
      success: true,
      tutorial
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete tutorial
// @route   DELETE /api/tutorials/:id
// @access  Private (Admin only)
exports.deleteTutorial = async (req, res) => {
  try {
    const tutorial = await Tutorial.findById(req.params.id);

    if (!tutorial) {
      return res.status(404).json({
        success: false,
        message: 'Tutorial not found'
      });
    }

    await Tutorial.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Tutorial deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
