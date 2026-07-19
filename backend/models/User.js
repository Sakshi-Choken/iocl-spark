const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    empId: {
      type: String,
      required: true,
      unique: true,
    },
    department: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['employee', 'admin'],
      default: 'employee',
    },
    coins: {
      type: Number,
      default: 0,
    },
    xp: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
    badges: {
      type: [String],
      default: [],
    },
    profilePhoto: {
      type: String,
      default: '',
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    loginHistory: {
      type: [
        {
          loginAt: { type: Date, default: Date.now },
          ipAddress: { type: String, default: '' },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);