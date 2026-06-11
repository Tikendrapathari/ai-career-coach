import JobRecommendation from '../models/JobRecommendation.js';
import User from '../models/User.js';
import Resume from '../models/Resume.js';
import { generateJSONResponse } from '../services/groqService.js';

export const getJobRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const resume = await Resume.findOne({ userId: req.userId }).sort({ createdAt: -1 });
    
    // Check if user has skills
    if (!user.profile?.skills || user.profile.skills.length === 0) {
      return res.json({
        recommendedJobs: [
          {
            title: "Software Developer",
            company: "Various Tech Companies",
            description: "Please update your profile with your skills to get personalized job recommendations",
            requirements: ["Add your skills in profile settings"],
            salary: "Not available",
            matchScore: 0,
            missingSkills: ["Please update profile"]
          }
        ],
        skillGap: [
          {
            skill: "Profile Incomplete",
            importance: "High",
            resources: ["Please update your skills in the dashboard"]
          }
        ],
        message: "Please update your profile with your skills first"
      });
    }
    
    const skills = user.profile.skills.join(', ');
    const experience = user.profile.experience || 0;
    const education = user.profile.education || 'Not specified';
    const dreamJob = user.profile.dreamJob || 'Software Developer';
    const resumeStrengths = resume?.analysis?.strengths?.join(', ') || 'Not available';
    
    const prompt = `You are a job matching expert. Based on the following candidate profile, recommend 5 suitable job roles.

Candidate Profile:
- Skills: ${skills}
- Experience: ${experience} years
- Education: ${education}
- Dream Job: ${dreamJob}
- Resume Strengths: ${resumeStrengths}

Return ONLY a JSON object with this exact structure (no extra text, no explanations):
{
  "recommendedJobs": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "description": "Brief 1-sentence job description",
      "requirements": ["requirement 1", "requirement 2", "requirement 3"],
      "salary": "$70,000 - $90,000",
      "matchScore": 85,
      "missingSkills": ["skill1", "skill2"]
    }
  ],
  "skillGap": [
    {
      "skill": "Skill name",
      "importance": "High/Medium/Low",
      "resources": ["https://resource1.com", "https://resource2.com"]
    }
  ]
}

Make matchScore realistic (0-100) based on skills match. Return ONLY valid JSON.`;

    const fallbackData = {
      recommendedJobs: [
        {
          title: dreamJob,
          company: "Tech Company",
          description: "Exciting opportunity for a skilled professional",
          requirements: skills.split(',').slice(0, 3),
          salary: "$70,000 - $90,000",
          matchScore: 75,
          missingSkills: ["System Design", "Cloud Computing"]
        },
        {
          title: "Senior Developer",
          company: "IT Solutions",
          description: "Lead development team and build scalable applications",
          requirements: ["Team leadership", "Architecture design", "Code review"],
          salary: "$90,000 - $120,000",
          matchScore: 65,
          missingSkills: ["Leadership", "System Design"]
        },
        {
          title: "Frontend Developer",
          company: "Web Studio",
          description: "Build responsive and interactive web applications",
          requirements: ["React", "JavaScript", "CSS"],
          salary: "$65,000 - $85,000",
          matchScore: 70,
          missingSkills: ["TypeScript", "Next.js"]
        }
      ],
      skillGap: [
        {
          skill: "System Design",
          importance: "High",
          resources: ["https://github.com/donnemartin/system-design-primer", "https://www.youtube.com/c/SystemDesignInterview"]
        },
        {
          skill: "Cloud Computing",
          importance: "High",
          resources: ["https://aws.amazon.com/training", "https://cloud.google.com/learn"]
        }
      ]
    };
    
    const recommendations = await generateJSONResponse(prompt, fallbackData);
    
    // Ensure data structure is valid
    const safeRecommendations = {
      recommendedJobs: Array.isArray(recommendations?.recommendedJobs) && recommendations.recommendedJobs.length > 0 
        ? recommendations.recommendedJobs.slice(0, 5) 
        : fallbackData.recommendedJobs,
      skillGap: Array.isArray(recommendations?.skillGap) && recommendations.skillGap.length > 0 
        ? recommendations.skillGap 
        : fallbackData.skillGap
    };
    
    // Save or update in database
    let jobRecommendation = await JobRecommendation.findOne({ userId: req.userId });
    if (!jobRecommendation) {
      jobRecommendation = new JobRecommendation({
        userId: req.userId,
        recommendedJobs: safeRecommendations.recommendedJobs,
        skillGap: safeRecommendations.skillGap
      });
    } else {
      jobRecommendation.recommendedJobs = safeRecommendations.recommendedJobs;
      jobRecommendation.skillGap = safeRecommendations.skillGap;
      jobRecommendation.generatedAt = new Date();
    }
    
    await jobRecommendation.save();
    
    res.json(jobRecommendation);
  } catch (error) {
    console.error('Job recommendations error:', error);
    // Return fallback data instead of error
    res.json({
      recommendedJobs: [
        {
          title: "Software Developer",
          company: "Various Tech Companies",
          description: "Based on your profile, consider applying for developer roles",
          requirements: ["Problem solving", "Team collaboration", "Technical skills"],
          salary: "$60,000 - $100,000",
          matchScore: 70,
          missingSkills: ["System Design", "Cloud Technologies"]
        },
        {
          title: "Web Developer",
          company: "Digital Agency",
          description: "Build modern web applications",
          requirements: ["HTML/CSS", "JavaScript", "React"],
          salary: "$55,000 - $80,000",
          matchScore: 75,
          missingSkills: ["Backend skills"]
        }
      ],
      skillGap: [
        {
          skill: "System Design",
          importance: "High",
          resources: ["https://github.com/donnemartin/system-design-primer"]
        },
        {
          skill: "Data Structures & Algorithms",
          importance: "High",
          resources: ["https://leetcode.com", "https://www.youtube.com/c/NeetCode"]
        }
      ]
    });
  }
};

export const getSkillGap = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const targetRole = req.query.role || user.profile?.dreamJob || 'Software Developer';
    
    const skills = user.profile?.skills || [];
    
    if (skills.length === 0) {
      return res.json({
        currentSkills: [],
        missingSkills: ["Please add your skills in profile settings"],
        recommendations: ["Update your profile with your current skills to get accurate skill gap analysis"]
      });
    }
    
    const prompt = `Compare current skills: ${skills.join(', ')} with required skills for ${targetRole} position.

Return ONLY a JSON object:
{
  "currentSkills": ${JSON.stringify(skills)},
  "missingSkills": ["skill1", "skill2", "skill3", "skill4"],
  "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"]
}

Return ONLY valid JSON.`;

    const fallbackData = {
      currentSkills: skills,
      missingSkills: ["System Design", "Cloud Computing", "Advanced Algorithms", "Database Optimization"],
      recommendations: [
        "Take online courses on System Design (freeCodeCamp, YouTube)",
        "Practice LeetCode problems daily to improve algorithms",
        "Build portfolio projects using cloud services (AWS free tier)",
        "Learn database optimization techniques"
      ]
    };
    
    const skillGap = await generateJSONResponse(prompt, fallbackData);
    
    res.json(skillGap);
  } catch (error) {
    console.error('Skill gap error:', error);
    res.json({
      currentSkills: [],
      missingSkills: ["System Design", "Cloud Technologies", "Data Structures"],
      recommendations: ["Update your profile with current skills", "Take online courses", "Build portfolio projects"]
    });
  }
};