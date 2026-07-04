const GameScore = require('../models/GameScore');
const User = require('../models/User');
const badgeList = require('../utils/badgeList');

// @desc    Submit a game score and earn coins
// @route   POST /api/games/submit-score
const submitScore = async (req, res) => {
  try {
    const { gameName, score } = req.body;

    if (!gameName || score === undefined) {
      return res.status(400).json({ message: 'Please provide gameName and score' });
    }

    // Simple coin logic: 1 coin per 10 points, minimum 5 coins for playing
    const coinsEarned = Math.max(5, Math.floor(score / 10));

    // Save the score record
    const gameScore = await GameScore.create({
      user: req.user._id,
      gameName,
      score,
      coinsEarned,
    });

    // Update user's total coins and XP
    const user = await User.findById(req.user._id);
    user.coins += coinsEarned;
    user.xp += coinsEarned;

    // Simple level-up logic: every 100 XP = 1 level
    // Simple level-up logic: every 100 XP = 1 level
    user.level = Math.floor(user.xp / 100) + 1;

    // Check and award new badges
    const totalGamesPlayed = await GameScore.countDocuments({ user: user._id });
    const newBadges = [];

    badgeList.forEach((badge) => {
      const alreadyHas = user.badges.includes(badge.name);
      const qualifies = badge.condition(user, totalGamesPlayed);

      if (!alreadyHas && qualifies) {
        user.badges.push(badge.name);
        newBadges.push(badge.name);
      }
    });

    await user.save();

   res.status(201).json({
      message: 'Score submitted successfully',
      gameScore,
      updatedCoins: user.coins,
      updatedXp: user.xp,
      updatedLevel: user.level,
      updatedBadges: user.badges,
      newBadges,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitScore };