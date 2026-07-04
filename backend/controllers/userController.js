const User = require('../models/User');

// @desc    Get leaderboard (top users by coins)
// @route   GET /api/users/leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find()
      .select('name empId department coins xp level')
      .sort({ coins: -1 })
      .limit(20);

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getLeaderboard };