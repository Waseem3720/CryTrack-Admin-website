 
// ============================================
// adminBackend/src/controllers/userController.js
// ============================================
const User = require('../models/User');
const Baby = require('../models/Baby');

// @desc    Get all users with their babies
// @route   GET /api/users
// @access  Private (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    // Get all users
    const users = await User.find().select('-password');

    // Get all babies for each user
    const usersWithBabies = await Promise.all(
      users.map(async (user) => {
        const babies = await Baby.find({ user_id: user._id });
        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          babies: babies
        };
      })
    );

    res.status(200).json({
      success: true,
      count: usersWithBabies.length,
      users: usersWithBabies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete a user and their babies
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete all babies associated with this user
    await Baby.deleteMany({ user_id: user._id });

    // Delete user
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User and associated babies deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
