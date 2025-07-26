"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function VirtualTryOnPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tryOnResult, setTryOnResult] = useState<string | null>(null);
  const [extractedSkinTone, setExtractedSkinTone] = useState('');
  const [extractedBodyType, setExtractedBodyType] = useState('');
  const [extractedHeight, setExtractedHeight] = useState('');
  const [extractedWeight, setExtractedWeight] = useState(''); // Still manual for now
  const [extractedBust, setExtractedBust] = useState('');
  const [extractedWaist, setExtractedWaist] = useState('');
  const [extractedHip, setExtractedHip] = useState('');
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [manualInputMode, setManualInputMode] = useState<boolean>(false);
  const [showBodyDetectionAlert, setShowBodyDetectionAlert] = useState<boolean>(false);
  const [bodyDetectionStatus, setBodyDetectionStatus] = useState<'detecting' | 'partial' | 'complete' | 'none'>('none');
  const [lastDetectionTime, setLastDetectionTime] = useState<number>(0);
  const [detectedGender, setDetectedGender] = useState<string>('');
  const [manualGender, setManualGender] = useState<string>('');
  const [genderDetectionMode, setGenderDetectionMode] = useState<'ai' | 'manual'>('ai');
  const [finalGender, setFinalGender] = useState<string>('');

  // Refs for dynamically imported MediaPipe and TF.js modules
  const tfRef = useRef<typeof import('@tensorflow/tfjs-core') | null>(null);
  const poseInstanceRef = useRef<any>(null);
  const poseClassRef = useRef<any>(null);
  const faceMeshInstanceRef = useRef<any>(null);
  const faceMeshClassRef = useRef<any>(null);
  const cameraUtilsRef = useRef<typeof import('@mediapipe/camera_utils') | null>(null);

  // Callback for Pose results
  const onPoseResults = useCallback((results: any) => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvasCtx = canvasRef.current.getContext('2d');
    if (!canvasCtx) return;

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

    // Draw pose landmarks (for visualization)
    if (results.poseLandmarks && poseClassRef.current?.POSE_CONNECTIONS) {
      // Example: Draw connections
      for (const connection of poseClassRef.current.POSE_CONNECTIONS) {
        const start = results.poseLandmarks[connection[0]];
        const end = results.poseLandmarks[connection[1]];
        if (start && end) {
          canvasCtx.beginPath();
          canvasCtx.moveTo(start.x * canvasRef.current.width, start.y * canvasRef.current.height);
          canvasCtx.lineTo(end.x * canvasRef.current.width, end.y * canvasRef.current.height);
          canvasCtx.lineWidth = 2;
          canvasCtx.strokeStyle = 'lime';
          canvasCtx.stroke();
        }
      }
      // Example: Draw points
      for (const landmark of results.poseLandmarks) {
        canvasCtx.beginPath();
        canvasCtx.arc(landmark.x * canvasRef.current.width, landmark.y * canvasRef.current.height, 5, 0, 2 * Math.PI);
        canvasCtx.fillStyle = 'red';
        canvasCtx.fill();
      }

      // --- EXPERIMENTAL: Approximate Body Type, Height, and Measurements ---
      // These are very rough approximations and will not be accurate.
      // For production, use dedicated computer vision models and reference objects.
      const landmarks = results.poseLandmarks;
      if (landmarks[11] && landmarks[12] && landmarks[23] && landmarks[24] && landmarks[13] && landmarks[14] && landmarks[25] && landmarks[26]) {
        const leftShoulder = landmarks[11];
        const rightShoulder = landmarks[12];
        const leftHip = landmarks[23];
        const rightHip = landmarks[24];

        const shoulderWidth = Math.abs(rightShoulder.x - leftShoulder.x);
        const hipWidth = Math.abs(rightHip.x - leftHip.x);

        // Very rough body type inference
        if (shoulderWidth > hipWidth * 1.2) {
          setExtractedBodyType('inverted triangle');
        } else if (hipWidth > shoulderWidth * 1.2) {
          setExtractedBodyType('pear');
        } else if (Math.abs(shoulderWidth - hipWidth) < 0.1 && Math.abs(leftShoulder.y - leftHip.y) < 0.1) { // Very rough rectangle
          setExtractedBodyType('rectangle');
        } else {
          setExtractedBodyType('athletic'); // Default or other
        }

        // Extremely rough height estimation (relative to video frame)
        const headTop = landmarks[0]; // Nose
        const footBottom = landmarks[29] || landmarks[30]; // Left/Right heel
        if (headTop && footBottom) {
          const relativeHeight = Math.abs(headTop.y - footBottom.y);
          // This is just a placeholder. Real height estimation is complex.
          setExtractedHeight((relativeHeight * 180).toFixed(0)); // Scale to a plausible height range
        }

        // Very rough bust, waist, hip measurements (pixel distances scaled)
        // These are highly speculative and for demonstration only.
        const bustEstimate = Math.abs(landmarks[11].x - landmarks[12].x) * 100; // Shoulder width as proxy
        const waistEstimate = Math.abs(landmarks[23].x - landmarks[24].x) * 0.8 * 100; // Hip width * factor
        const hipEstimate = Math.abs(landmarks[23].x - landmarks[24].x) * 100; // Hip width

        setExtractedBust(bustEstimate.toFixed(0));
        setExtractedWaist(waistEstimate.toFixed(0));
        setExtractedHip(hipEstimate.toFixed(0));

        // Check for complete body detection
        const requiredLandmarks = [0, 11, 12, 23, 24, 27, 28]; // nose, shoulders, hips, ankles
        const visibleLandmarks = requiredLandmarks.filter(index =>
          landmarks[index] && landmarks[index].visibility > 0.5
        );

        const currentTime = Date.now();
        if (visibleLandmarks.length >= 6) {
          setBodyDetectionStatus('complete');
          setLastDetectionTime(currentTime);
          setShowBodyDetectionAlert(false);
        } else if (visibleLandmarks.length >= 3) {
          setBodyDetectionStatus('partial');
          if (currentTime - lastDetectionTime > 3000) { // Show alert after 3 seconds
            setShowBodyDetectionAlert(true);
          }
        } else {
          setBodyDetectionStatus('detecting');
          if (currentTime - lastDetectionTime > 2000) {
            setShowBodyDetectionAlert(true);
          }
        }
      } else {
        setBodyDetectionStatus('none');
        if (Date.now() - lastDetectionTime > 2000) {
          setShowBodyDetectionAlert(true);
        }
      }
    }
    canvasCtx.restore();
  }, []);

  // Callback for FaceMesh results
  const onFaceMeshResults = useCallback((results: any) => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvasCtx = canvasRef.current.getContext('2d');
    if (!canvasCtx) return;

    // Draw face mesh landmarks (for visualization)
    if (results.multiFaceLandmarks && faceMeshClassRef.current?.FACEMESH_TESSELATION) {
      for (const landmarks of results.multiFaceLandmarks) {
        // Example: Draw face mesh connections
        for (const connection of faceMeshClassRef.current.FACEMESH_TESSELATION) {
          const start = landmarks[connection[0]];
          const end = landmarks[connection[1]];
          if (start && end) {
            canvasCtx.beginPath();
            canvasCtx.moveTo(start.x * canvasRef.current.width, start.y * canvasRef.current.height);
            canvasCtx.lineTo(end.x * canvasRef.current.width, end.y * canvasRef.current.height);
            canvasCtx.lineWidth = 0.5;
            canvasCtx.strokeStyle = 'cyan';
            canvasCtx.stroke();
          }
        }

        // --- EXPERIMENTAL: Approximate Skin Tone ---
        // This is a very rough approximation by sampling a pixel.
        // For production, use dedicated skin tone detection algorithms.
        if (landmarks[152]) { // A landmark near the chin/lower face
          const pixelX = Math.floor(landmarks[152].x * canvasRef.current.width);
          const pixelY = Math.floor(landmarks[152].y * canvasRef.current.height);
          const imageData = canvasCtx.getImageData(pixelX, pixelY, 1, 1).data;
          const r = imageData[0];
          const g = imageData[1];
          const b = imageData[2];

          // Very basic heuristic for warm/cool/neutral/fair/dark
          if (r > b && g > b) {
            setExtractedSkinTone('warm');
          } else if (b > r && b > g) {
            setExtractedSkinTone('cool');
          } else if (r > 200 && g > 200 && b > 200) {
            setExtractedSkinTone('fair');
          } else if (r < 100 && g < 100 && b < 100) {
            setExtractedSkinTone('dark');
          } else {
            setExtractedSkinTone('neutral');
          }
        }

        // --- EXPERIMENTAL: Basic Gender Detection ---
        // This is a very simplified approach and not scientifically accurate
        if (genderDetectionMode === 'ai' && landmarks.length > 400) {
          try {
            // Use key facial landmarks for basic gender estimation
            const faceWidth = Math.abs(landmarks[454]?.x - landmarks[234]?.x) || 0; // Face width
            const faceHeight = Math.abs(landmarks[10]?.y - landmarks[152]?.y) || 0; // Face height
            const jawWidth = Math.abs(landmarks[172]?.x - landmarks[397]?.x) || 0; // Jaw width

            // Simple heuristic-based gender estimation
            let genderScore = 0;

            // Face shape analysis (broader faces often associated with masculine features)
            if (faceWidth > 0 && faceHeight > 0) {
              const faceRatio = faceWidth / faceHeight;
              if (faceRatio > 0.75) genderScore += 1;
              else genderScore -= 1;
            }

            // Jaw analysis (broader jaw often associated with masculine features)
            if (faceWidth > 0 && jawWidth > 0) {
              const jawRatio = jawWidth / faceWidth;
              if (jawRatio > 0.85) genderScore += 1;
              else genderScore -= 1;
            }

            // Set detected gender based on score
            if (genderScore > 0) {
              setDetectedGender('Male');
            } else if (genderScore < 0) {
              setDetectedGender('Female');
            } else {
              setDetectedGender('Non-binary');
            }
          } catch (error) {
            // If detection fails, set to detecting
            setDetectedGender('Detecting...');
          }
        }
      }
    }
  }, [genderDetectionMode]);

  // Update final gender based on detection mode
  useEffect(() => {
    if (genderDetectionMode === 'ai') {
      setFinalGender(detectedGender);
    } else {
      setFinalGender(manualGender);
    }
  }, [genderDetectionMode, detectedGender, manualGender]);

  useEffect(() => {
    async function setupCamera() {
      if (videoRef.current) {
        try {
          // Dynamically import TF.js and MediaPipe modules
          tfRef.current = await import('@tensorflow/tfjs-core');
          await import('@tensorflow/tfjs-backend-webgl');
          poseClassRef.current = await import('@mediapipe/pose');
          faceMeshClassRef.current = await import('@mediapipe/face_mesh');
          cameraUtilsRef.current = await import('@mediapipe/camera_utils');

          await tfRef.current.setBackend('webgl'); // Use WebGL backend for performance
          await tfRef.current.ready();

          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            setIsCameraReady(true);
          };

          // Initialize Pose
          const Pose = poseClassRef.current!.Pose;
          const Camera = cameraUtilsRef.current!.Camera;
          const FaceMesh = faceMeshClassRef.current!.FaceMesh;

          const newPose = new Pose({
            locateFile: (file: string) => {
              return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
            },
          });
          newPose.setOptions({
            modelComplexity: 1,
            smoothLandmarks: true,
            enableSegmentation: false,
            smoothSegmentation: false,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
          });
          newPose.onResults(onPoseResults);
          poseInstanceRef.current = newPose; // Assign to ref

          // Initialize FaceMesh
          const newFaceMesh = new FaceMesh({
            locateFile: (file: string) => {
              return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
            },
          });
          newFaceMesh.setOptions({
            maxNumFaces: 1,
            refineLandmarks: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
          });
          newFaceMesh.onResults(onFaceMeshResults);
          faceMeshInstanceRef.current = newFaceMesh; // Assign to ref

          // Start processing video frames
          const camera = new Camera(videoRef.current, {
            onFrame: async () => {
              if (videoRef.current) {
                await poseInstanceRef.current?.send({ image: videoRef.current });
                await faceMeshInstanceRef.current?.send({ image: videoRef.current });
              }
            },
            width: 640,
            height: 480,
          });
          camera.start();

        } catch (error) {
          console.error("Error accessing camera or setting up MediaPipe:", error);
          alert("Could not access camera. Please ensure you have a webcam and grant permissions.");
          setIsCameraReady(false);
        }
      }
    }

    setupCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
      poseInstanceRef.current?.close();
      faceMeshInstanceRef.current?.close();
    };
  }, [onPoseResults, onFaceMeshResults]);

  const startCamera = async () => {
    try {
      if (videoRef.current) {
        // Dynamically import TF.js and MediaPipe modules
        tfRef.current = await import('@tensorflow/tfjs-core');
        await import('@tensorflow/tfjs-backend-webgl');
        poseClassRef.current = await import('@mediapipe/pose');
        faceMeshClassRef.current = await import('@mediapipe/face_mesh');
        cameraUtilsRef.current = await import('@mediapipe/camera_utils');

        await tfRef.current.setBackend('webgl');
        await tfRef.current.ready();

        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setIsCameraReady(true);
        };

        // Initialize MediaPipe components
        const Pose = poseClassRef.current!.Pose;
        const Camera = cameraUtilsRef.current!.Camera;
        const FaceMesh = faceMeshClassRef.current!.FaceMesh;

        const newPose = new Pose({
          locateFile: (file: string) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/${file}`;
          },
        });
        newPose.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          enableSegmentation: false,
          smoothSegmentation: false,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        newPose.onResults(onPoseResults);
        poseInstanceRef.current = newPose;

        const newFaceMesh = new FaceMesh({
          locateFile: (file: string) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/${file}`;
          },
        });
        newFaceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        newFaceMesh.onResults(onFaceMeshResults);
        faceMeshInstanceRef.current = newFaceMesh;

        const camera = new Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current) {
              await poseInstanceRef.current?.send({ image: videoRef.current });
              await faceMeshInstanceRef.current?.send({ image: videoRef.current });
            }
          },
          width: 640,
          height: 480,
        });
        camera.start();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Could not access camera. Please ensure you have granted camera permissions.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraReady(false);
    }
  };

  const handleGetRecommendation = async () => {
    setProcessing(true);
    try {
      const response = await fetch('/api/rag/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_profile: {
            skin_tone: extractedSkinTone,
            body_type: extractedBodyType,
            height: extractedHeight,
            weight: extractedWeight, // This will be from manual input for now
            bust: extractedBust,
            waist: extractedWaist,
            hip: extractedHip,
            gender: finalGender || 'Not specified',
          },
          clothing_item: {}, // No specific clothing item for try-on advice
        }),
      });

      const data = await response.json();
      setTryOnResult(data.recommendation);
    } catch (error) {
      console.error("Error fetching recommendation:", error);
      setTryOnResult("Error getting recommendation. Please ensure the RAG API is running.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          AI-Powered Fashion Analysis
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Virtual Style Assistant
        </h1>

        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
          Get personalized fashion recommendations using advanced computer vision and AI analysis.
          Our technology analyzes your body measurements and provides tailored style advice.
        </p>

        <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Real-time Analysis
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Body Measurements
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            Style Recommendations
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            Privacy Protected
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">AI Body Analysis</h2>
            <p className="text-slate-600 dark:text-slate-400">Advanced computer vision for personalized fashion recommendations</p>
          </div>

          <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-2xl overflow-hidden aspect-video border border-slate-200 dark:border-slate-700 shadow-xl">
            <video
              ref={videoRef}
              className="w-full h-full object-cover rounded-2xl"
              autoPlay
              playsInline
              style={{ transform: 'scaleX(-1)' }}
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full rounded-2xl"
              style={{ transform: 'scaleX(-1)' }}
            />

            {!isCameraReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-sm">
                <div className="text-center p-8 bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl border border-white/20">
                  <div className="relative mb-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary mx-auto"></div>
                    <div className="absolute inset-0 rounded-full bg-primary/5"></div>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    Initializing AI Vision
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Setting up advanced body analysis...
                  </p>
                </div>
              </div>
            )}

            {/* Status Indicator */}
            <div className="absolute top-4 right-4">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm ${
                isCameraReady
                  ? 'bg-green-500/20 text-green-700 dark:text-green-300 border border-green-500/30'
                  : 'bg-slate-500/20 text-slate-700 dark:text-slate-300 border border-slate-500/30'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  isCameraReady ? 'bg-green-500 animate-pulse' : 'bg-slate-400'
                }`}></div>
                {isCameraReady ? 'AI Active' : 'Standby'}
              </div>
            </div>

            {/* Analysis Overlay */}
            {isCameraReady && (
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black/50 backdrop-blur-sm rounded-xl p-3 text-white text-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="font-medium">Real-time Analysis Active</span>
                  </div>
                  <div className="text-xs text-white/80">
                    Stand in good lighting with full body visible for best results
                  </div>
                </div>
              </div>
            )}
          </div>


          <div className="flex gap-3">
            <Button
              onClick={startCamera}
              disabled={isCameraReady}
              className="flex-1 h-12 text-base font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
            >
              {isCameraReady ? (
                <>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                  AI Vision Active
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Start AI Analysis
                </>
              )}
            </Button>
            <Button
              onClick={stopCamera}
              disabled={!isCameraReady}
              variant="outline"
              className="flex-1 h-12 text-base font-medium border-2 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
              Stop Analysis
            </Button>
          </div>
        </div>

        {/* Analysis Results Panel */}
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Body Analysis</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">AI-powered measurements and recommendations</p>
          </div>

          <div className="space-y-4">
            {/* Skin Tone Card */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a4 4 0 004-4V5z" />
                    </svg>
                  </div>
                  <span className="font-medium text-slate-900 dark:text-slate-100">Skin Tone</span>
                </div>
                {extractedSkinTone && extractedSkinTone !== 'Detecting...' && (
                  <div className="w-6 h-6 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: extractedSkinTone }}></div>
                )}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {extractedSkinTone ? (
                  extractedSkinTone === 'Detecting...' ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-3 w-3 border-2 border-primary/20 border-t-primary"></div>
                      Analyzing skin tone...
                    </div>
                  ) : (
                    <span className="font-medium text-slate-900 dark:text-slate-100">{extractedSkinTone}</span>
                  )
                ) : (
                  <span className="text-slate-400">Start camera to detect</span>
                )}
              </div>
            </div>

            {/* Body Type Card */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="font-medium text-slate-900 dark:text-slate-100">Body Type</span>
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {extractedBodyType ? (
                  extractedBodyType === 'Detecting...' ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-3 w-3 border-2 border-primary/20 border-t-primary"></div>
                      Analyzing body shape...
                    </div>
                  ) : (
                    <span className="font-medium text-slate-900 dark:text-slate-100">{extractedBodyType}</span>
                  )
                ) : (
                  <span className="text-slate-400">Start camera to detect</span>
                )}
              </div>
            </div>

            {/* Gender Detection Card */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <span className="font-medium text-slate-900 dark:text-slate-100">Gender</span>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={genderDetectionMode === 'manual'}
                    onCheckedChange={(checked) => setGenderDetectionMode(checked ? 'manual' : 'ai')}
                  />
                  <span className="text-xs text-slate-500">Manual</span>
                </div>
              </div>

              {genderDetectionMode === 'ai' ? (
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {detectedGender ? (
                    detectedGender === 'Detecting...' ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-3 w-3 border-2 border-primary/20 border-t-primary"></div>
                        Analyzing facial features...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900 dark:text-slate-100">{detectedGender}</span>
                        <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">AI Detected</span>
                      </div>
                    )
                  ) : (
                    <span className="text-slate-400">Start camera to detect</span>
                  )}
                </div>
              ) : (
                <Select value={manualGender} onValueChange={setManualGender}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Non-binary">Non-binary</SelectItem>
                    <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Measurements Grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Height', value: extractedHeight, icon: '📏', unit: 'cm' },
                { label: 'Bust', value: extractedBust, icon: '👕', unit: 'cm' },
                { label: 'Waist', value: extractedWaist, icon: '⚖️', unit: 'cm' },
                { label: 'Hip', value: extractedHip, icon: '👖', unit: 'cm' }
              ].map((measurement, index) => (
                <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="text-center">
                    <div className="text-lg mb-1">{measurement.icon}</div>
                    <div className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">{measurement.label}</div>
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {measurement.value ? (
                        measurement.value === 'Detecting...' ? (
                          <div className="flex items-center justify-center gap-1">
                            <div className="animate-spin rounded-full h-2 w-2 border border-primary/20 border-t-primary"></div>
                            <span className="text-xs">...</span>
                          </div>
                        ) : (
                          `${measurement.value} ${measurement.unit}`
                        )
                      ) : (
                        <span className="text-slate-400 text-xs">--</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Weight Input */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <span className="font-medium text-slate-900 dark:text-slate-100">Weight (Manual)</span>
              </div>
              <Input
                type="number"
                value={extractedWeight}
                onChange={(e) => setExtractedWeight(e.target.value)}
                placeholder="Enter your weight in kg"
                className="text-center font-medium"
              />
            </div>
          </div>

          <Button
            onClick={handleGetRecommendation}
            className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
            disabled={!isCameraReady || processing}
          >
            {processing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white mr-2"></div>
                Analyzing & Generating Recommendations...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Get AI Fashion Recommendations
              </>
            )}
          </Button>
        </div>

      </div>

      {/* Recommendations Section */}
      {(tryOnResult || processing) && (
        <div className="mt-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              AI Fashion Recommendations
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Personalized style advice based on your unique measurements and preferences
            </p>
          </div>

          <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-xl">
            {processing ? (
              <div className="text-center py-12">
                <div className="relative mb-6">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary mx-auto"></div>
                  <div className="absolute inset-0 rounded-full bg-primary/5"></div>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  AI is analyzing your profile...
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Creating personalized fashion recommendations
                </p>
                <div className="flex justify-center gap-2">
                  {['Analyzing body measurements', 'Matching style preferences', 'Generating recommendations'].map((step, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-slate-500">
                      <div className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-primary animate-pulse' : 'bg-slate-300'}`}></div>
                      <span className={index === 0 ? 'text-primary font-medium' : ''}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : tryOnResult ? (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Analysis Complete
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Here are your personalized recommendations
                    </p>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed">
                      {tryOnResult}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => setTryOnResult('')}
                    variant="outline"
                    className="flex-1"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    New Analysis
                  </Button>
                  <Button
                    onClick={handleGetRecommendation}
                    className="flex-1"
                    disabled={processing}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh Recommendations
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
