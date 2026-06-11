import Roadmap from '../models/Roadmap.js';
import { generateWithGroq } from '../services/groqService.js';

export const generateRoadmap = async (req, res) => {
  try {
    const { dreamJob, currentSkills, timeline } = req.body;
    
    console.log('📋 Generating roadmap for:', { dreamJob, timeline });
    
    // Calculate weeks based on timeline
    let totalWeeks = 12;
    let totalMonths = 3;
    if (timeline === '6 months') {
      totalWeeks = 24;
      totalMonths = 6;
    } else if (timeline === '1 year') {
      totalWeeks = 48;
      totalMonths = 12;
    }
    
    // Role-specific technology detection
    const roleTechStack = getTechStackForRole(dreamJob);
    
    const prompt = `You are a senior career roadmap expert. Create a VERY DETAILED ${timeline} learning roadmap to become a ${dreamJob}.

Current skills: ${Array.isArray(currentSkills) ? currentSkills.join(', ') : 'Beginner'}

REQUIRED TECHNOLOGIES TO COVER FOR ${dreamJob.toUpperCase()}:
${roleTechStack}

INSTRUCTIONS:
- Create ${totalWeeks} weeks of weekly plans (each week has 4-6 specific topics)
- Create ${totalMonths} months of monthly goals
- Include SPECIFIC resource URLs (freeCodeCamp, YouTube, official docs)
- Suggest REAL-WORLD portfolio projects
- Each week should build upon previous weeks

Return ONLY this JSON structure (no other text):
{
  "weekly": [
    {
      "week": 1,
      "title": "Week Title",
      "topics": ["Specific topic 1", "Specific topic 2", "Specific topic 3"],
      "resources": ["https://resource1.com", "https://resource2.com"],
      "projects": ["Project to build this week"],
      "milestones": ["Achievement by end of week"]
    }
  ],
  "monthly": [
    {
      "month": 1,
      "title": "Month Title",
      "focus": "Main focus area",
      "goals": ["Goal 1", "Goal 2"],
      "projects": ["Portfolio project"],
      "certifications": ["Certification name"]
    }
  ],
  "summary": {
    "technologies": ["Tech1", "Tech2", "Tech3"],
    "projects": ["Project1", "Project2"],
    "estimatedHours": "15-20 hours/week",
    "difficulty": "Beginner to Intermediate"
  }
}

Make it PRACTICAL and ACTIONABLE for ${dreamJob}. Return ONLY valid JSON.`;

    const aiResponse = await generateWithGroq(prompt, { maxTokens: 4000 });
    console.log('✅ AI Response received, length:', aiResponse.length);
    
    // Parse JSON from response
    let roadmapData;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        roadmapData = JSON.parse(jsonMatch[0]);
      } else {
        roadmapData = JSON.parse(aiResponse);
      }
    } catch (parseError) {
      console.error('❌ JSON Parse Error, using fallback');
      roadmapData = createFallbackRoadmap(dreamJob, timeline, totalWeeks, totalMonths);
    }
    
    // Ensure data structure is valid
    const safeRoadmapData = {
      weekly: ensureValidWeekly(roadmapData?.weekly, totalWeeks, dreamJob),
      monthly: ensureValidMonthly(roadmapData?.monthly, totalMonths, dreamJob),
      summary: roadmapData?.summary || createFallbackSummary(dreamJob)
    };
    
    const roadmap = new Roadmap({
      userId: req.userId,
      dreamJob,
      currentSkills: Array.isArray(currentSkills) ? currentSkills : [],
      timeline,
      roadmap: safeRoadmapData,
      progress: {
        completedWeeks: [],
        completedProjects: [],
        overallProgress: 0
      }
    });
    
    await roadmap.save();
    console.log('✅ Roadmap saved successfully!');
    
    res.status(201).json(roadmap);
  } catch (error) {
    console.error('❌ Generate roadmap error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getRoadmap = async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({ userId: req.userId }).sort({ createdAt: -1 });
    if (!roadmap) {
      return res.status(404).json({ message: 'No roadmap found. Please generate one first.' });
    }
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProgress = async (req, res) => {
  try {
    const { roadmapId, weekCompleted, projectCompleted } = req.body;
    const roadmap = await Roadmap.findById(roadmapId);
    
    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }
    
    if (weekCompleted && !roadmap.progress.completedWeeks.includes(weekCompleted)) {
      roadmap.progress.completedWeeks.push(weekCompleted);
    }
    
    if (projectCompleted && !roadmap.progress.completedProjects.includes(projectCompleted)) {
      roadmap.progress.completedProjects.push(projectCompleted);
    }
    
    const totalWeeks = roadmap.roadmap.weekly?.length || 1;
    roadmap.progress.overallProgress = (roadmap.progress.completedWeeks.length / totalWeeks) * 100;
    
    await roadmap.save();
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============ HELPER FUNCTIONS ============

function getTechStackForRole(role) {
  const roleLower = role.toLowerCase();
  
  if (roleLower.includes('full stack') || roleLower.includes('web developer')) {
    return `- Frontend: HTML5, CSS3, JavaScript (ES6+), React.js, Next.js, Tailwind CSS, TypeScript
- Backend: Node.js, Express.js, REST APIs, GraphQL
- Database: MongoDB, PostgreSQL, Prisma
- Tools: Git, GitHub, Docker, Vercel, Render
- Testing: Jest, React Testing Library`;
  }
  
  if (roleLower.includes('data scientist') || roleLower.includes('data science')) {
    return `- Python, Pandas, NumPy, Matplotlib, Seaborn
- Scikit-learn, TensorFlow, PyTorch
- SQL, Tableau, Power BI
- Statistics, A/B Testing, MLflow
- Big Data: Spark, Hadoop`;
  }
  
  if (roleLower.includes('devops') || roleLower.includes('cloud')) {
    return `- Linux, Bash scripting
- Git, Jenkins, GitHub Actions
- Docker, Kubernetes
- Terraform, Ansible
- AWS (EC2, S3, Lambda, RDS) or Azure/GCP
- Prometheus, Grafana, ELK Stack`;
  }
  
  if (roleLower.includes('ui/ux') || roleLower.includes('designer')) {
    return `- Figma, Adobe XD, Sketch
- User Research, Wireframing, Prototyping
- Usability Testing, Design Systems
- HTML/CSS basics, Accessibility
- Color Theory, Typography`;
  }
  
  if (roleLower.includes('mobile') || roleLower.includes('android')) {
    return `- Kotlin/Java, Android Studio
- Jetpack Compose, XML
- Firebase, REST APIs
- MVVM, Coroutines, Room Database`;
  }
  
  if (roleLower.includes('ios') || roleLower.includes('swift')) {
    return `- Swift, SwiftUI, UIKit
- Xcode, Core Data, Combine
- Firebase, REST APIs, MVVM
- App Store Connect, TestFlight`;
  }
  
  if (roleLower.includes('ai') || roleLower.includes('machine learning')) {
    return `- Python, TensorFlow, PyTorch
- Scikit-learn, Pandas, NumPy
- Computer Vision, NLP, LLMs
- MLOps, FastAPI, Docker`;
  }
  
  if (roleLower.includes('cyber') || roleLower.includes('security')) {
    return `- Network Security, Kali Linux
- Wireshark, Metasploit, Nmap
- Burp Suite, SIEM, Firewalls
- Encryption, Risk Assessment
- Python scripting`;
  }
  
  // Default for any other role
  return `- Core fundamentals of ${role}
- Essential tools and technologies for ${role}
- Industry best practices and standards
- Portfolio projects relevant to ${role}
- Certifications for ${role}`;
}

function createFallbackRoadmap(dreamJob, timeline, totalWeeks, totalMonths) {
  return {
    weekly: createFallbackWeekly(totalWeeks, dreamJob),
    monthly: createFallbackMonthly(totalMonths, dreamJob),
    summary: createFallbackSummary(dreamJob)
  };
}

function createFallbackWeekly(totalWeeks, dreamJob) {
  const weeks = [];
  const weekTitles = [
    "Fundamentals & Setup",
    "Core Concepts Deep Dive",
    "Practice & Mini Projects",
    "Advanced Topics",
    "Portfolio Project Part 1",
    "Portfolio Project Part 2",
    "Testing & Debugging",
    "Deployment & DevOps",
    "Interview Preparation",
    "Final Review & Polish"
  ];
  
  for (let i = 1; i <= Math.min(totalWeeks, 24); i++) {
    const titleIndex = (i - 1) % weekTitles.length;
    weeks.push({
      week: i,
      title: `Week ${i}: ${weekTitles[titleIndex]}`,
      topics: [
        `${dreamJob} - Topic ${(i * 3) - 2}`,
        `${dreamJob} - Topic ${(i * 3) - 1}`,
        `${dreamJob} - Topic ${i * 3}`
      ],
      resources: [
        "https://www.freecodecamp.org",
        "https://www.youtube.com/@freecodecamp",
        "https://github.com"
      ],
      projects: [`${dreamJob} Week ${i} Project`],
      milestones: [`Complete week ${i} learning objectives`]
    });
  }
  return weeks;
}

function createFallbackMonthly(totalMonths, dreamJob) {
  const months = [];
  const monthlyFocus = [
    "Foundations Mastery",
    "Core Skills Development",
    "Advanced Concepts",
    "Portfolio Building",
    "Industry Preparation",
    "Job Ready"
  ];
  
  for (let i = 1; i <= totalMonths; i++) {
    const focusIndex = (i - 1) % monthlyFocus.length;
    months.push({
      month: i,
      title: `Month ${i}: ${monthlyFocus[focusIndex]}`,
      focus: `Master ${monthlyFocus[focusIndex].toLowerCase()} for ${dreamJob}`,
      goals: [
        `Complete ${i} months of structured learning`,
        `Build ${i} portfolio-quality projects`,
        `Learn essential ${dreamJob} tools`
      ],
      projects: [`${dreamJob} Project ${i}`],
      certifications: [`${dreamJob} Fundamentals`, `Professional ${dreamJob}`]
    });
  }
  return months;
}

function createFallbackSummary(dreamJob) {
  return {
    technologies: [`${dreamJob} core technologies`, "Industry standard tools", "Development frameworks", "Testing & deployment"],
    projects: [`Beginner ${dreamJob} project`, `Intermediate ${dreamJob} project`, `Advanced ${dreamJob} portfolio`],
    estimatedHours: "15-20 hours per week",
    difficulty: "Beginner to Job Ready"
  };
}

function ensureValidWeekly(weeklyData, totalWeeks, dreamJob) {
  if (Array.isArray(weeklyData) && weeklyData.length >= 8) {
    return weeklyData;
  }
  return createFallbackWeekly(totalWeeks, dreamJob);
}

function ensureValidMonthly(monthlyData, totalMonths, dreamJob) {
  if (Array.isArray(monthlyData) && monthlyData.length >= 2) {
    return monthlyData;
  }
  return createFallbackMonthly(totalMonths, dreamJob);
}