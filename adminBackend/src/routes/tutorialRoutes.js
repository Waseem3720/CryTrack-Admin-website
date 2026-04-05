 
// ============================================
// adminBackend/src/routes/tutorialRoutes.js
// ============================================
const express = require('express');
const router = express.Router();
const { 
  getAllTutorials, 
  createTutorial, 
  deleteTutorial 
} = require('../controllers/tutorialController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getAllTutorials);
router.post('/', protect, createTutorial);
router.delete('/:id', protect, deleteTutorial);

module.exports = router;
