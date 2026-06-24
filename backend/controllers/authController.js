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
    
    console.log('📝 Registration attempt for:', email);
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('❌ User already exists:', email);
      return res.status(400).json({ 
        success: false,
        message: 'User already exists' 
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
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
    console.log('✅ User created successfully:', email);
    
    // Generate token
    const token = generateToken(user._id);
    console.log('🔑 Token generated for:', email);
    
    // Send welcome email (don't wait for it)
    try {
      await sendWelcomeEmail(email, name);
    } catch (emailError) {
      console.log('⚠️ Email sending failed but user created');
    }
    
    // Return response with token and user data
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
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
    console.error('❌ Registration error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Registration failed' 
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('🔐 Login attempt for:', email);
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log('❌ Invalid password for:', email);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }
    
    const token = generateToken(user._id);
    console.log('✅ Login successful for:', email);
    
    res.json({
      success: true,
      message: 'Login successful',
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
    console.error('❌ Login error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Login failed' 
    });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { name, email, googleId, avatar } = req.body;
    
    console.log('🔑 Google auth attempt for:', email);
    
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
      console.log('✅ Google user created:', email);
      
      try {
        await sendWelcomeEmail(email, name);
      } catch (emailError) {
        console.log('⚠️ Email sending failed but user created');
      }
    }
    
    const token = generateToken(user._id);
    console.log('✅ Google auth successful for:', email);
    
    res.json({
      success: true,
      message: 'Google login successful',
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
    console.error('❌ Google auth error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Google auth failed' 
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    res.json({ 
      success: true,
      user 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    
    await sendPasswordResetEmail(email, resetToken);
    
    res.json({ 
      success: true,
      message: 'Password reset email sent' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
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
      return res.status(400).json({ 
        success: false,
        message: 'Invalid or expired token' 
      });
    }
    
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    res.json({ 
      success: true,
      message: 'Password reset successful' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
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
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profile: user.profile,
        statistics: user.statistics
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};
