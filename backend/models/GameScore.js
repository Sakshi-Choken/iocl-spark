const mongoose = require('mongoose');

const gameScoreSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    gameName: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    coinsEarned: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('GameScore', gameScoreSchema);