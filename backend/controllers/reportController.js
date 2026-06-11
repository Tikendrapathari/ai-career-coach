import Report from '../models/Report.js';
import User from '../models/User.js';
import Resume from '../models/Resume.js';
import Interview from '../models/Interview.js';
import CodingSession from '../models/CodingSession.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateReport = async (req, res) => {
  try {
    console.log("=== GENERATE REPORT STARTED ===");
    const userId = req.userId;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const resume = await Resume.findOne({ userId }).sort({ createdAt: -1 });
    const interviews = await Interview.find({ userId });
    const codingSessions = await CodingSession.find({ userId });
    
    console.log(`Interviews: ${interviews.length}, Coding: ${codingSessions.length}, Resume: ${resume ? 'Yes' : 'No'}`);
    
    const resumeScore = resume?.atsScore || 0;
    
    let communicationScore = 0;
    let technicalScore = 0;
    let confidenceScore = 0;
    
    if (interviews.length > 0) {
      communicationScore = Math.round(interviews.reduce((acc, i) => acc + (i.scores?.communication || 0), 0) / interviews.length);
      technicalScore = Math.round(interviews.reduce((acc, i) => acc + (i.scores?.technical || 0), 0) / interviews.length);
      confidenceScore = Math.round(interviews.reduce((acc, i) => acc + (i.scores?.confidence || 0), 0) / interviews.length);
    }
    
    let codingScore = 0;
    if (codingSessions.length > 0) {
      codingScore = Math.round(codingSessions.reduce((acc, s) => acc + (s.score || 0), 0) / codingSessions.length);
    }
    
    const overallTechnicalScore = (technicalScore + codingScore) / 2;
    const careerReadinessScore = Math.round(
      (resumeScore + communicationScore + overallTechnicalScore + confidenceScore) / 4
    );
    
    let level = 'beginner';
    if (careerReadinessScore >= 80) level = 'expert';
    else if (careerReadinessScore >= 60) level = 'advanced';
    else if (careerReadinessScore >= 40) level = 'intermediate';
    
    let recommendations = [];
    let nextSteps = [];
    
    if (resumeScore < 70) {
      recommendations.push("Improve your resume ATS score by adding relevant keywords");
      nextSteps.push("Upload an updated resume for analysis");
    }
    if (communicationScore < 70) {
      recommendations.push("Practice communication skills with more mock interviews");
      nextSteps.push("Complete 3 more mock interviews");
    }
    if (technicalScore < 70) {
      recommendations.push("Strengthen technical knowledge through coding practice");
      nextSteps.push("Solve 5 coding problems this week");
    }
    if (confidenceScore < 70) {
      recommendations.push("Build confidence by recording yourself and reviewing");
      nextSteps.push("Record and review your interview answers");
    }
    
    if (recommendations.length === 0) {
      recommendations = [
        "Keep maintaining your excellent preparation level",
        "Stay updated with latest industry trends",
        "Continue practicing with advanced problems"
      ];
      nextSteps = [
        "Apply to your dream companies",
        "Prepare for final round interviews",
        "Network with industry professionals"
      ];
    }
    
    let overallAssessment = "";
    if (careerReadinessScore >= 80) {
      overallAssessment = `Excellent! Your career readiness score is ${careerReadinessScore}%. You are well prepared for job interviews. Keep up the great work!`;
    } else if (careerReadinessScore >= 60) {
      overallAssessment = `Good progress! Your career readiness score is ${careerReadinessScore}%. You're on the right track.`;
    } else if (careerReadinessScore >= 40) {
      overallAssessment = `You're making progress with a score of ${careerReadinessScore}%. Continue practicing regularly.`;
    } else {
      overallAssessment = `Your career readiness score is ${careerReadinessScore}%. Start taking mock interviews and upload your resume.`;
    }
    
    const strengths = [
      "Good foundation in core concepts",
      "Regular practice demonstrated",
      "Active learning approach"
    ];
    
    const reportData = {
      userId,
      resumeScore: { score: resumeScore, strengths: strengths, weaknesses: ["Add more practice"], suggestions: ["Add quantifiable achievements"] },
      communicationScore: { score: communicationScore, fillerWords: 5, grammarErrors: 3, speechClarity: communicationScore, suggestions: ["Practice speaking"] },
      technicalScore: { score: overallTechnicalScore, codingSkills: codingScore, problemSolving: technicalScore, systemDesign: 50, suggestions: ["Practice more"] },
      confidenceScore: { score: confidenceScore, eyeContact: confidenceScore, bodyLanguage: confidenceScore, voiceClarity: confidenceScore, suggestions: ["Be confident"] },
      careerReadiness: { score: careerReadinessScore, level: level, recommendations: recommendations, nextSteps: nextSteps },
      overallAssessment: overallAssessment,
      generatedAt: new Date()
    };
    
    await Report.findOneAndDelete({ userId });
    const report = new Report(reportData);
    await report.save();
    
    console.log("✅ Report saved successfully!");
    res.status(200).json(report);
    
  } catch (error) {
    console.error("❌ Generate report error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getReport = async (req, res) => {
  try {
    const report = await Report.findOne({ userId: req.userId }).sort({ generatedAt: -1 });
    if (!report) {
      return res.status(404).json({ message: 'No report found' });
    }
    res.json(report);
  } catch (error) {
    console.error("Get report error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const exportReportPDF = async (req, res) => {
  try {
    const report = await Report.findOne({ userId: req.userId }).sort({ generatedAt: -1 });
    const user = await User.findById(req.userId);
    
    if (!report) {
      return res.status(404).json({ message: 'No report found to export' });
    }
    
    // Create PDF document
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="career-report-${Date.now()}.pdf"`);
    
    // Pipe PDF to response
    doc.pipe(res);
    
    // Colors
    const primaryColor = '#6366f1';
    const secondaryColor = '#8b5cf6';
    const textColor = '#333333';
    const lightGray = '#f5f5f5';
    
    // Header with Gradient
    doc.rect(0, 0, doc.page.width, 120).fill(primaryColor);
    doc.fillColor('white');
    doc.fontSize(28).font('Helvetica-Bold').text('AI Career Coach', 50, 40);
    doc.fontSize(14).font('Helvetica').text('Career Readiness Report', 50, 80);
    doc.fontSize(10).text(`Generated for: ${user.name}`, 50, 105);
    doc.fontSize(10).text(`Date: ${new Date().toLocaleDateString()}`, 50, 120);
    
    let y = 160;
    
    // Overall Score Circle
    const score = Math.round(report.careerReadiness?.score || 0);
    const centerX = doc.page.width / 2;
    const radius = 60;
    
    // Draw circle background
    doc.circle(centerX, y + radius, radius).fill(lightGray);
    
    // Draw score text
    doc.fillColor(primaryColor);
    doc.fontSize(36).font('Helvetica-Bold').text(`${score}%`, centerX - 35, y + radius - 15);
    doc.fontSize(12).font('Helvetica').text(report.careerReadiness?.level?.toUpperCase() || 'BEGINNER', centerX - 40, y + radius + 10);
    
    y += 150;
    
    // Overall Assessment Box
    doc.fillColor(primaryColor);
    doc.rect(50, y, doc.page.width - 100, 60).fill(lightGray);
    doc.fillColor(textColor);
    doc.fontSize(10).font('Helvetica').text(report.overallAssessment || '', 60, y + 15, {
      width: doc.page.width - 120,
      align: 'center'
    });
    
    y += 80;
    
    // Skills Section Title
    doc.fillColor(primaryColor);
    doc.fontSize(16).font('Helvetica-Bold').text('Skills Assessment', 50, y);
    y += 30;
    
    // Skills Grid
    const skills = [
      { label: 'Resume Score', value: Math.round(report.resumeScore?.score || 0), icon: '📄' },
      { label: 'Communication', value: Math.round(report.communicationScore?.score || 0), icon: '🎙️' },
      { label: 'Technical Skills', value: Math.round(report.technicalScore?.score || 0), icon: '💻' },
      { label: 'Confidence', value: Math.round(report.confidenceScore?.score || 0), icon: '💪' }
    ];
    
    skills.forEach((skill, index) => {
      const x = 50 + (index % 2) * 250;
      const rowY = y + Math.floor(index / 2) * 60;
      
      doc.fillColor(textColor);
      doc.fontSize(10).font('Helvetica').text(`${skill.icon} ${skill.label}`, x, rowY);
      doc.fillColor(primaryColor);
      doc.fontSize(20).font('Helvetica-Bold').text(`${skill.value}%`, x, rowY + 15);
      
      // Progress bar
      doc.fillColor('#e0e0e0');
      doc.rect(x + 80, rowY + 20, 100, 8).fill();
      doc.fillColor(primaryColor);
      doc.rect(x + 80, rowY + 20, (skill.value / 100) * 100, 8).fill();
    });
    
    y += 130;
    
    // Recommendations Section
    doc.fillColor(primaryColor);
    doc.fontSize(16).font('Helvetica-Bold').text('📌 Recommendations', 50, y);
    y += 30;
    
    const recommendations = report.careerReadiness?.recommendations || [];
    recommendations.forEach((rec, index) => {
      doc.fillColor(textColor);
      doc.fontSize(10).font('Helvetica').text(`${index + 1}. ${rec}`, 60, y);
      y += 20;
      if (y > 700) {
        doc.addPage();
        y = 50;
      }
    });
    
    y += 20;
    
    // Next Steps Section
    doc.fillColor(primaryColor);
    doc.fontSize(16).font('Helvetica-Bold').text('🎯 Next Steps', 50, y);
    y += 30;
    
    const nextSteps = report.careerReadiness?.nextSteps || [];
    nextSteps.forEach((step, index) => {
      doc.fillColor(textColor);
      doc.fontSize(10).font('Helvetica').text(`${index + 1}. ${step}`, 60, y);
      y += 20;
      if (y > 700) {
        doc.addPage();
        y = 50;
      }
    });
    
    // Footer
    doc.fillColor('#999999');
    doc.fontSize(8).font('Helvetica').text('AI Career Coach - Your Journey to Success', 50, doc.page.height - 50, {
      align: 'center',
      width: doc.page.width - 100
    });
    
    // Finalize PDF
    doc.end();
    
  } catch (error) {
    console.error("Export PDF error:", error);
    res.status(500).json({ message: error.message });
  }
};