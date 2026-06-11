import pdf from 'pdf-parse';
import fs from 'fs';

export const parseResume = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return {
      text: data.text,
      pages: data.numpages,
      info: data.info,
      metadata: data.metadata
    };
  } catch (error) {
    console.error('Error parsing resume:', error);
    throw error;
  }
};

export const extractKeywords = (text) => {
  const keywords = [];
  const skillKeywords = [
    'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'MongoDB', 'SQL',
    'AWS', 'Docker', 'Kubernetes', 'Machine Learning', 'AI', 'Data Science',
    'Full Stack', 'Frontend', 'Backend', 'DevOps', 'Agile', 'Scrum',
    'Leadership', 'Communication', 'Problem Solving', 'Teamwork'
  ];
  
  skillKeywords.forEach(keyword => {
    if (text.toLowerCase().includes(keyword.toLowerCase())) {
      keywords.push(keyword);
    }
  });
  
  return keywords;
};

export const calculateATSScore = (text, keywords) => {
  let score = 0;
  
  // Check for keywords presence
  const foundKeywords = keywords.filter(kw => text.toLowerCase().includes(kw.toLowerCase()));
  score += (foundKeywords.length / keywords.length) * 40;
  
  // Check for proper formatting
  if (text.includes('@') && text.includes('linkedin')) score += 10;
  if (text.match(/\d{10}/) || text.match(/\d{3}-\d{3}-\d{4}/)) score += 10;
  
  // Check for action verbs
  const actionVerbs = ['developed', 'created', 'managed', 'led', 'designed', 'implemented'];
  const foundVerbs = actionVerbs.filter(verb => text.toLowerCase().includes(verb));
  score += (foundVerbs.length / actionVerbs.length) * 20;
  
  // Check for metrics and achievements
  if (text.match(/\d+%/)) score += 10;
  if (text.match(/\$\d+/)) score += 10;
  
  return Math.min(Math.round(score), 100);
};