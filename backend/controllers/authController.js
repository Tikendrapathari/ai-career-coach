import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendWelcomeEmail, sendPasswordResetEmail } from '../services/emailService.js';
import crypto from 'crypto';

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      name,
      email,
      password: hashedPassword,
      profile: {
        skills: [],
        experience: 0,
        education: '',
        dreamJob: ''
      },
      statistics: {
        totalInterviews: 0,
        averageScore: 0,
        completedRoadmaps: 0,
        codingSessions: 0
      }
    });
    
    await user.save();
    
    // Send welcome email
    await sendWelcomeEmail(email, name);
    
    const token = generateToken(user._id);
    
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profile: user.profile,
        statistics: user.statistics
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = generateToken(user._id);
    
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        profile: user.profile,
        statistics: user.statistics
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { name, email, googleId, avatar } = req.body;
    
    let user = await User.findOne({ email });
    
    if (!user) {
      user = new User({
        name,
        email,
        googleId,
        avatar,
        profile: {
          skills: [],
          experience: 0,
          education: '',
          dreamJob: ''
        },
        statistics: {
          totalInterviews: 0,
          averageScore: 0,
          completedRoadmaps: 0,
          codingSessions: 0
        }
      });
      await user.save();
      await sendWelcomeEmail(email, name);
    }
    
    const token = generateToken(user._id);
    
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        profile: user.profile,
        statistics: user.statistics
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    
    await sendPasswordResetEmail(email, resetToken);
    
    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, skills, experience, education, dreamJob } = req.body;
    
    const user = await User.findById(req.userId);
    
    if (name) user.name = name;
    if (skills) user.profile.skills = skills;
    if (experience) user.profile.experience = experience;
    if (education) user.profile.education = education;
    if (dreamJob) user.profile.dreamJob = dreamJob;
    
    await user.save();
    
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profile: user.profile,
        statistics: user.statistics
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};