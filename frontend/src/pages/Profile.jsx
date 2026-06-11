import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { 
  User, 
  Mail, 
  Briefcase, 
  GraduationCap, 
  Target, 
  Save, 
  Edit3,
  Code,
  Calendar,
  Award,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Phone,
  MapPin,
  Upload,
  CheckCircle,
  XCircle
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    skills: '',
    experience: '',
    education: '',
    dreamJob: '',
    bio: '',
    github: '',
    linkedin: '',
    twitter: ''
  });
  
  const [originalProfile, setOriginalProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const user = response.data.user;
      const profileData = {
        name: user.name || '',
        email: user.email || '',
        phone: user.profile?.phone || '',
        location: user.profile?.location || '',
        skills: user.profile?.skills?.join(', ') || '',
        experience: user.profile?.experience || '',
        education: user.profile?.education || '',
        dreamJob: user.profile?.dreamJob || '',
        bio: user.profile?.bio || '',
        github: user.profile?.github || '',
        linkedin: user.profile?.linkedin || '',
        twitter: user.profile?.twitter || ''
      };
      setProfile(profileData);
      setOriginalProfile(profileData);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/auth/profile`, {
        name: profile.name,
        phone: profile.phone,
        location: profile.location,
        skills: profile.skills.split(',').map(s => s.trim()).filter(s => s),
        experience: parseInt(profile.experience) || 0,
        education: profile.education,
        dreamJob: profile.dreamJob,
        bio: profile.bio,
        github: profile.github,
        linkedin: profile.linkedin,
        twitter: profile.twitter
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const hasChanges = () => {
    return JSON.stringify(profile) !== JSON.stringify(originalProfile);
  };

  const skillSuggestions = [
    "JavaScript", "Python", "Java", "React", "Node.js", "MongoDB", 
    "Express", "Django", "Flask", "Spring Boot", "AWS", "Docker",
    "Kubernetes", "TypeScript", "Next.js", "GraphQL", "Tailwind CSS",
    "TensorFlow", "PyTorch", "Data Science", "Machine Learning"
  ];

  const addSkill = (skill) => {
    const currentSkills = profile.skills.split(',').map(s => s.trim()).filter(s => s);
    if (!currentSkills.includes(skill)) {
      currentSkills.push(skill);
      setProfile({...profile, skills: currentSkills.join(', ')});
    }
  };

  const removeSkill = (skillToRemove) => {
    const currentSkills = profile.skills.split(',').map(s => s.trim()).filter(s => s);
    const updatedSkills = currentSkills.filter(s => s !== skillToRemove);
    setProfile({...profile, skills: updatedSkills.join(', ')});
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
                <p className="text-gray-300">Manage your personal information and career preferences</p>
              </div>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} variant="primary">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-3">
                  <Button onClick={() => {
                    setProfile(originalProfile);
                    setIsEditing(false);
                  }} variant="secondary">
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} isLoading={loading} variant="primary">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Avatar & Stats */}
            <div className="space-y-6">
              {/* Avatar Card */}
              <Card className="text-center">
                <div className="relative inline-block">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-4xl font-bold text-white">
                    {profile.name?.charAt(0) || 'U'}
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-20 p-2 bg-indigo-500 rounded-full hover:bg-indigo-600 transition">
                      <Upload className="w-4 h-4 text-white" />
                    </button>
                  )}
                </div>
                <h2 className="text-xl font-bold text-white mt-4">{profile.name || 'Not set'}</h2>
                <p className="text-indigo-400">{profile.dreamJob || 'Dream Job not set'}</p>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex justify-around">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">{profile.skills.split(',').filter(s => s.trim()).length || 0}</p>
                      <p className="text-gray-400 text-sm">Skills</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">{profile.experience || 0}</p>
                      <p className="text-gray-400 text-sm">Years Exp</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Profile Completion Card */}
              <Card>
                <h3 className="text-white font-semibold mb-4">Profile Completion</h3>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-gray-400">Completion Score</span>
                  <span className="text-indigo-400">
                    {Math.min(100, Object.values(profile).filter(v => v && v !== '').length * 10)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Object.values(profile).filter(v => v && v !== '').length * 10)}%` }}
                  />
                </div>
                <p className="text-gray-500 text-xs mt-3">
                  Complete your profile to get better job matches
                </p>
              </Card>
            </div>

            {/* Right Column - Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-400" />
                  Basic Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white disabled:opacity-50 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-1">Email *</label>
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-1">Phone</label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      disabled={!isEditing}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white disabled:opacity-50 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-1">Location</label>
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => setProfile({...profile, location: e.target.value})}
                      disabled={!isEditing}
                      placeholder="City, Country"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white disabled:opacity-50 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </Card>

              {/* Professional Information */}
              <Card>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-purple-400" />
                  Professional Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-1">Dream Job / Target Role</label>
                    <input
                      type="text"
                      value={profile.dreamJob}
                      onChange={(e) => setProfile({...profile, dreamJob: e.target.value})}
                      disabled={!isEditing}
                      placeholder="e.g., Full Stack Developer"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white disabled:opacity-50 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-1">Years of Experience</label>
                    <input
                      type="number"
                      value={profile.experience}
                      onChange={(e) => setProfile({...profile, experience: e.target.value})}
                      disabled={!isEditing}
                      placeholder="0"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white disabled:opacity-50 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-300 text-sm mb-1">Education</label>
                    <input
                      type="text"
                      value={profile.education}
                      onChange={(e) => setProfile({...profile, education: e.target.value})}
                      disabled={!isEditing}
                      placeholder="B.Tech Computer Science, IIT Delhi, 2020"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white disabled:opacity-50 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-300 text-sm mb-1">Short Bio</label>
                    <textarea
                      value={profile.bio}
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      disabled={!isEditing}
                      placeholder="Tell us about yourself, your passion, and career goals..."
                      rows="3"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white disabled:opacity-50 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </Card>

              {/* Skills Section */}
              <Card>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Code className="w-5 h-5 text-cyan-400" />
                  Skills & Technologies
                </h3>
                
                {isEditing && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {skillSuggestions.slice(0, 12).map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => addSkill(skill)}
                          className="px-3 py-1 bg-white/10 hover:bg-indigo-500/30 rounded-full text-xs text-gray-300 transition"
                        >
                          + {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Your Skills (comma-separated)</label>
                  <textarea
                    value={profile.skills}
                    onChange={(e) => setProfile({...profile, skills: e.target.value})}
                    disabled={!isEditing}
                    placeholder="JavaScript, React, Node.js, MongoDB, Python, AWS"
                    rows="3"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white disabled:opacity-50 focus:outline-none focus:border-indigo-500"
                  />
                  <p className="text-gray-500 text-xs mt-1">
                    Add your technical skills, frameworks, tools, and technologies
                  </p>
                </div>

                {/* Display skills as tags */}
                {profile.skills && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {profile.skills.split(',').map((skill, idx) => skill.trim() && (
                      <span key={idx} className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm flex items-center gap-2">
                        {skill.trim()}
                        {isEditing && (
                          <button onClick={() => removeSkill(skill.trim())} className="hover:text-red-400">
                            <XCircle className="w-3 h-3" />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                )}
              </Card>

              {/* Social Links */}
              <Card>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-green-400" />
                  Social Profiles
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-gray-300 text-sm mb-1 flex items-center gap-2">
                      <Github className="w-4 h-4" /> GitHub
                    </label>
                    <input
                      type="url"
                      value={profile.github}
                      onChange={(e) => setProfile({...profile, github: e.target.value})}
                      disabled={!isEditing}
                      placeholder="https://github.com/username"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white disabled:opacity-50 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-1 flex items-center gap-2">
                      <Linkedin className="w-4 h-4" /> LinkedIn
                    </label>
                    <input
                      type="url"
                      value={profile.linkedin}
                      onChange={(e) => setProfile({...profile, linkedin: e.target.value})}
                      disabled={!isEditing}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white disabled:opacity-50 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-1 flex items-center gap-2">
                      <Twitter className="w-4 h-4" /> Twitter/X
                    </label>
                    <input
                      type="url"
                      value={profile.twitter}
                      onChange={(e) => setProfile({...profile, twitter: e.target.value})}
                      disabled={!isEditing}
                      placeholder="https://twitter.com/username"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white disabled:opacity-50 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </Card>

              {/* Save Button (Bottom) */}
              {isEditing && hasChanges() && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-end gap-3"
                >
                  <Button onClick={() => {
                    setProfile(originalProfile);
                    setIsEditing(false);
                  }} variant="secondary">
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} isLoading={loading} variant="primary">
                    <Save className="w-4 h-4 mr-2" />
                    Save All Changes
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;