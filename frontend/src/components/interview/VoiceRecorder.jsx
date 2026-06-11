import React, { useState, useRef } from 'react';
import { Mic, Square, Play, Pause, Download } from 'lucide-react';
import Button from '../ui/Button';

const VoiceRecorder = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        onRecordingComplete(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const playRecording = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        {!isRecording ? (
          <Button onClick={startRecording} variant="primary">
            <Mic className="w-4 h-4 mr-2" />
            Start Recording
          </Button>
        ) : (
          <Button onClick={stopRecording} variant="danger">
            <Square className="w-4 h-4 mr-2" />
            Stop Recording
          </Button>
        )}
        
        {audioURL && (
          <>
            {!isPlaying ? (
              <Button onClick={playRecording} variant="secondary">
                <Play className="w-4 h-4 mr-2" />
                Play
              </Button>
            ) : (
              <Button onClick={pauseRecording} variant="secondary">
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
            )}
            <Button variant="secondary">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </>
        )}
      </div>
      
      {audioURL && (
        <audio ref={audioRef} src={audioURL} onEnded={() => setIsPlaying(false)} className="hidden" />
      )}
      
      {isRecording && (
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <span className="text-red-400 text-sm">Recording in progress...</span>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;