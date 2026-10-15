import bcrypt from 'bcryptjs';
import { User, Profile, DSALog } from '../config/db.js';
import { generateToken } from '../middleware/auth.js';
import { initialDSAProblems } from '../data/seedData.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, rollNo, college, branch, targetTier, targetRole } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Please provide name, email, and password.' });
    }

    const existingUser = User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = User.create({
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'student'
    });

    const newProfile = Profile.create({
      userId: newUser.id,
      name,
      email: newUser.email,
      rollNo: rollNo || '23IT17',
      college: college || 'Govt. Engineering College, Ajmer',
      branch: branch || 'Computer Science & Engineering',
      semester: 7,
      cgpa: 8.0,
      targetTier: targetTier || 'tier1',
      targetRole: targetRole || 'Full Stack SDE / Software Engineer',
      skills: ['JavaScript', 'React.js', 'Node.js', 'Data Structures', 'SQL']
    });

    // Seed default starter DSA problems for user
    initialDSAProblems.forEach(p => {
      DSALog.create({
        ...p,
        userId: newUser.id,
        completed: false,
        timeSpentMin: 0
      });
    });

    const token = generateToken(newUser.id);

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      },
      profile: newProfile
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Server error during registration', error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter both email and password.' });
    }

    const user = User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials. Password incorrect.' });
    }

    let profile = Profile.findOne({ userId: user.id });
    if (!profile) {
      profile = Profile.create({
        userId: user.id,
        name: user.name,
        email: user.email,
        rollNo: '23IT17',
        college: 'Govt. Engineering College, Ajmer',
        branch: 'Computer Science & Engineering',
        targetTier: 'tier1'
      });
    }

    const token = generateToken(user.id);

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      profile
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error during login', error: err.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const profile = Profile.findOne({ userId: user.id });

    return res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      profile
    });
  } catch (err) {
    console.error('getMe error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};
