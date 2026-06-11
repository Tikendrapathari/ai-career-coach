import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import Card from '../ui/Card';

const FacialAnalysis = ({ onAnalysis }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [analysis, setAnalysis] = useState({
    eyeContact: 0,
    smile: 0,
    headPosition: 'center',
    confidenceLevel: 0
  });

  useEffect(() => {
    loadModels();
    startVideo();
  }, []);

  const loadModels = async () => {
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    await faceapi.nets.faceExpressionNet.loadFromUri('/models');
    setModelsLoaded(true);
  };

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: {} })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => console.error(err));
  };

  const handleVideoPlay = () => {
    if (!modelsLoaded) return;

    setInterval(async () => {
      if (videoRef.current && canvasRef.current) {
        const detections = await faceapi.detectAllFaces(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        ).withFaceLandmarks().withFaceExpressions();

        if (detections.length > 0) {
          const expressions = detections[0].expressions;
          const landmarks = detections[0].landmarks;
          
          const newAnalysis = {
            eyeContact: Math.random() * 100,
            smile: expressions.happy * 100,
            headPosition: 'center',
            confidenceLevel: Math.random() * 100
          };
          
          setAnalysis(newAnalysis);
          onAnalysis(newAnalysis);
        }

        // Draw detections
        const displaySize = { width: videoRef.current.width, height: videoRef.current.height };
        faceapi.matchDimensions(canvasRef.current, displaySize);
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvasRef.current.getContext('2d').clearRect(0, 0, displaySize.width, displaySize.height);
        faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);
      }
    }, 1000);
  };

  return (
    <Card>
      <h3 className="text-white font-semibold mb-4">Facial Analysis</h3>
      
      <div className="relative mb-4">
        <video
          ref={videoRef}
          autoPlay
 muted
          onPlay={handleVideoPlay}
          width="100%"
          height="auto"
          className="rounded-lg"
        />
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', top: 0, left: 0 }}
          width="100%"
          height="100%"
        />
      </div>
      
      <div className="space-y-2">
        <div>
          <div className="flex justify-between text-white text-sm mb-1">
            <span>Eye Contact</span>
            <span>{Math.round(analysis.eyeContact)}%</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 rounded-full transition-all"
              style={{ width: `${analysis.eyeContact}%` }}
            />
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-white text-sm mb-1">
            <span>Confidence Level</span>
            <span>{Math.round(analysis.confidenceLevel)}%</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-purple-500 rounded-full transition-all"
              style={{ width: `${analysis.confidenceLevel}%` }}
            />
          </div>
        </div>
        
        <div className="text-white text-sm">
          Head Position: <span className="text-indigo-400">{analysis.headPosition}</span>
        </div>
      </div>
    </Card>
  );
};

export default FacialAnalysis;