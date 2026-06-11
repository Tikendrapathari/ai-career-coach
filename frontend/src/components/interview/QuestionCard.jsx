import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Square, Send } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';

const QuestionCard = ({ question, questionNumber, totalQuestions, onNext }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [answer, setAnswer] = useState('');
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        // Convert to text using Web Speech API
        const audioUrl = URL.createObjectURL(blob);
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setAnswer(transcript);
        };
        recognition.start();
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleSubmit = () => {
    if (answer.trim()) {
      onNext(answer);
      setAnswer('');
    }
  };

  return (
    <Card>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-indigo-400 font-semibold">
            Question {questionNumber} of {totalQuestions}
          </span>
          <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
        
        <h3 className="text-xl text-white mb-4">{question}</h3>
        
        <div className="space-y-4">
          <div className="flex gap-3">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              variant={isRecording ? 'danger' : 'secondary'}
            >
              {isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              {isRecording ? 'Stop Recording' : 'Record Answer'}
            </Button>
          </div>
          
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Or type your answer here..."
            className="w-full p-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 min-h-[150px]"
          />
          
          <Button onClick={handleSubmit} variant="primary" className="w-full">
            <Send className="w-4 h-4 mr-2" />
            Submit Answer
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default QuestionCard;