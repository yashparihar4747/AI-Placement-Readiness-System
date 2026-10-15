import { Profile } from '../config/db.js';

export const getProfile = async (req, res) => {
  try {
    let profile = Profile.findOne({ userId: req.user.id });
    if (!profile) {
      profile = Profile.create({
        userId: req.user.id,
        name: req.user.name,
        email: req.user.email,
        rollNo: '23IT17',
        college: 'Govt. Engineering College, Ajmer',
        branch: 'Computer Science & Engineering',
        targetTier: 'tier1',
        skills: ['JavaScript', 'React', 'Node.js', 'DSA']
      });
    }
    return res.json({ success: true, profile });
  } catch (err) {
    console.error('getProfile error:', err);
    return res.status(500).json({ message: 'Error retrieving profile', error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, rollNo, college, branch, semester, cgpa, targetTier, targetRole, skills } = req.body;
    let profile = Profile.findOne({ userId: req.user.id });

    if (!profile) {
      profile = Profile.create({
        userId: req.user.id,
        name: name || req.user.name,
        email: req.user.email,
        rollNo,
        college,
        branch,
        semester,
        cgpa,
        targetTier,
        targetRole,
        skills
      });
    } else {
      profile = Profile.findByIdAndUpdate(profile.id, {
        name: name || profile.name,
        rollNo: rollNo || profile.rollNo,
        college: college || profile.college,
        branch: branch || profile.branch,
        semester: semester !== undefined ? Number(semester) : profile.semester,
        cgpa: cgpa !== undefined ? Number(cgpa) : profile.cgpa,
        targetTier: targetTier || profile.targetTier,
        targetRole: targetRole || profile.targetRole,
        skills: Array.isArray(skills) ? skills : profile.skills
      });
    }

    return res.json({ success: true, profile, message: 'Profile updated successfully.' });
  } catch (err) {
    console.error('updateProfile error:', err);
    return res.status(500).json({ message: 'Error updating profile', error: err.message });
  }
};
