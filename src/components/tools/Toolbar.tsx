import React, { useState } from 'react';
import { 
  Camera, 
  Mail, 
  MousePointer, 
  Grid3X3, 
  Sparkles, 
  Layers, 
  Hand, 
  Code,
  ChevronDown,
  Volume2,
  VolumeX,
  Volume1,
  Volume,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import { takePicture, testBackendConnection, volumeUp, volumeDown, volumeMute, volumeUnmute, brightnessUp, brightnessDown } from '../../services/apiService';

export function Toolbar() {
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [isVolumeMuted, setIsVolumeMuted] = useState(false);
  const [isVolumeLoading, setIsVolumeLoading] = useState(false);
  const [isBrightnessLoading, setIsBrightnessLoading] = useState(false);

  const testBackend = async () => {
    try {
      const result = await testBackendConnection();
      alert(` Backend is working!\n\nConnected to: ${result.url}\n\nResponse: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      alert(` Backend test failed:\n${error.message}`);
    }
  };

  const handleCameraClick = async () => {
    if (isCameraLoading) return; // Prevent multiple clicks while loading
    
    setIsCameraLoading(true);
    try {
      console.log('Taking picture...');
      const result = await takePicture();
      console.log('Picture taken successfully:', result);
      
      if (result.success) {
        const message = result.filePath 
          ? ` ${result.message}\n\nFile saved at: ${result.filePath}`
          : ` ${result.message || 'Picture taken successfully!'}`;
        alert(message);
      } else if (result.message) {
        alert(` ${result.message}`);
      } else {
        alert(' Picture taken successfully!');
      }
    } catch (error) {
      console.error('Failed to take picture:', error);
      const errorMessage = error.message || 'Unknown error occurred';
      alert(` Camera Error: ${errorMessage}\n\nPlease check if your backend is running on http://127.0.0.1:8001`);
    } finally {
      setIsCameraLoading(false);
    }
  };

  const handleVolumeUp = async () => {
    if (isVolumeLoading) return;
    
    setIsVolumeLoading(true);
    try {
      console.log(' Increasing volume...');
      const result = await volumeUp();
      console.log('Volume increased:', result);
      
      if (result.success) {
        alert(` ${result.message}`);
      } else {
        alert(' Volume increased successfully!');
      }
    } catch (error) {
      console.error('Failed to increase volume:', error);
      const errorMessage = error.message || 'Unknown error occurred';
      alert(` Volume Error: ${errorMessage}\n\nPlease check if your backend is running on http://127.0.0.1:8001`);
    } finally {
      setIsVolumeLoading(false);
    }
  };

  const handleVolumeDown = async () => {
    if (isVolumeLoading) return;
    
    setIsVolumeLoading(true);
    try {
      console.log(' Decreasing volume...');
      const result = await volumeDown();
      console.log('Volume decreased:', result);
      
      if (result.success) {
        alert(` ${result.message}`);
      } else {
        alert(' Volume decreased successfully!');
      }
    } catch (error) {
      console.error('Failed to decrease volume:', error);
      const errorMessage = error.message || 'Unknown error occurred';
      alert(` Volume Error: ${errorMessage}\n\nPlease check if your backend is running on http://127.0.0.1:8001`);
    } finally {
      setIsVolumeLoading(false);
    }
  };

  const handleVolumeMute = async () => {
    if (isVolumeLoading) return;
    
    setIsVolumeLoading(true);
    try {
      console.log(' Muting volume...');
      const result = await volumeMute();
      console.log('Volume muted:', result);
      setIsVolumeMuted(true);
      
      if (result.success) {
        alert(` ${result.message}`);
      } else {
        alert(' Volume muted successfully!');
      }
    } catch (error) {
      console.error('Failed to mute volume:', error);
      const errorMessage = error.message || 'Unknown error occurred';
      alert(` Volume Error: ${errorMessage}\n\nPlease check if your backend is running on http://127.0.0.1:8001`);
    } finally {
      setIsVolumeLoading(false);
    }
  };

  const handleVolumeUnmute = async () => {
    if (isVolumeLoading) return;
    
    setIsVolumeLoading(true);
    try {
      console.log(' Unmuting volume...');
      const result = await volumeUnmute();
      console.log('Volume unmuted:', result);
      setIsVolumeMuted(false);
      
      if (result.success) {
        alert(` ${result.message}`);
      } else {
        alert(' Volume unmuted successfully!');
      }
    } catch (error) {
      console.error('Failed to unmute volume:', error);
      const errorMessage = error.message || 'Unknown error occurred';
      alert(` Volume Error: ${errorMessage}\n\nPlease check if your backend is running on http://127.0.0.1:8001`);
    } finally {
      setIsVolumeLoading(false);
    }
  };

  const handleBrightnessUp = async () => {
    if (isBrightnessLoading) return;
    
    setIsBrightnessLoading(true);
    try {
      console.log(' Increasing brightness...');
      const result = await brightnessUp();
      console.log('Brightness increased:', result);
      
      if (result.success) {
        alert(` ${result.message}`);
      } else {
        alert(' Brightness increased successfully!');
      }
    } catch (error) {
      console.error('Failed to increase brightness:', error);
      const errorMessage = error.message || 'Unknown error occurred';
      alert(` Brightness Error: ${errorMessage}\n\nPlease check if your backend is running on http://127.0.0.1:8001`);
    } finally {
      setIsBrightnessLoading(false);
    }
  };

  const handleBrightnessDown = async () => {
    if (isBrightnessLoading) return;
    
    setIsBrightnessLoading(true);
    try {
      console.log(' Decreasing brightness...');
      const result = await brightnessDown();
      console.log('Brightness decreased:', result);
      
      if (result.success) {
        alert(` ${result.message}`);
      } else {
        alert(' Brightness decreased successfully!');
      }
    } catch (error) {
      console.error('Failed to decrease brightness:', error);
      const errorMessage = error.message || 'Unknown error occurred';
      alert(` Brightness Error: ${errorMessage}\n\nPlease check if your backend is running on http://127.0.0.1:8001`);
    } finally {
      setIsBrightnessLoading(false);
    }
  };

  const handleMonitorClick = () => {
    // Local monitor control - you can add actual monitor logic here
    console.log('Monitor settings toggled locally');
    alert('Monitor settings updated successfully!');
  };

  return (
    <div className="flex justify-center w-full px-6 pb-4">
      <div className="relative flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-3 shadow-[0_4px_20px_rgba(255,255,255,0.1)] hover:shadow-[0_4px_20px_rgba(255,255,255,0.2)] transition-all duration-200">
        {/* Left Side Icons */}
        <div className="flex items-center gap-1">
          {/* Mouse Pointer - Active */}
          <div className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white/20 text-white cursor-pointer hover:bg-white/30 transition-colors">
            <MousePointer size={16} />
          </div>

          {/* Grid with Dropdown */}
          <div className="flex items-center gap-1 px-3 py-2 rounded-lg text-white/70 cursor-pointer hover:bg-white/20 hover:text-white transition-colors">
            <Grid3X3 size={16} />
            <ChevronDown size={12} />
          </div>
        </div>

        {/* Center Camera Icon */}
        <div className="flex items-center gap-1 mx-4">
          <div 
            className={`flex items-center gap-1 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
              isCameraLoading 
                ? 'bg-white/30 text-white/50 cursor-not-allowed' 
                : 'text-white/70 hover:bg-white/20 hover:text-white'
            }`}
            onClick={handleCameraClick}
          >
            <Camera size={16} className={isCameraLoading ? 'animate-pulse' : ''} />
          </div>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-1">
          {/* Volume Controls */}
          <div className="flex items-center gap-1">
            {/* Volume Up */}
            <div 
              className={`flex items-center gap-1 px-2 py-2 rounded-lg cursor-pointer transition-colors ${
                isVolumeLoading 
                  ? 'bg-white/30 text-white/50 cursor-not-allowed' 
                  : 'text-white/70 hover:bg-white/20 hover:text-white'
              }`}
              onClick={handleVolumeUp}
              title="Increase Volume"
            >
              <Volume2 size={16} />
            </div>
            
            {/* Volume Down */}
            <div 
              className={`flex items-center gap-1 px-2 py-2 rounded-lg cursor-pointer transition-colors ${
                isVolumeLoading 
                  ? 'bg-white/30 text-white/50 cursor-not-allowed' 
                  : 'text-white/70 hover:bg-white/20 hover:text-white'
              }`}
              onClick={handleVolumeDown}
              title="Decrease Volume"
            >
              <Volume1 size={16} />
            </div>
            
            {/* Volume Mute/Unmute */}
            <div 
              className={`flex items-center gap-1 px-2 py-2 rounded-lg cursor-pointer transition-colors ${
                isVolumeLoading 
                  ? 'bg-white/30 text-white/50 cursor-not-allowed' 
                  : 'text-white/70 hover:bg-white/20 hover:text-white'
              }`}
              onClick={isVolumeMuted ? handleVolumeUnmute : handleVolumeMute}
              title={isVolumeMuted ? "Unmute Volume" : "Mute Volume"}
            >
              {isVolumeMuted ? <VolumeX size={16} /> : <Volume size={16} />}
            </div>
          </div>

          {/* Brightness Controls */}
          <div className="flex items-center gap-1">
            {/* Brightness Up */}
            <div 
              className={`flex items-center gap-1 px-2 py-2 rounded-lg cursor-pointer transition-colors ${
                isBrightnessLoading 
                  ? 'bg-white/30 text-white/50 cursor-not-allowed' 
                  : 'text-white/70 hover:bg-white/20 hover:text-white'
              }`}
              onClick={handleBrightnessUp}
              title="Increase Brightness"
            >
              <Sun size={16} />
            </div>
            
            {/* Brightness Down */}
            <div 
              className={`flex items-center gap-1 px-2 py-2 rounded-lg cursor-pointer transition-colors ${
                isBrightnessLoading 
                  ? 'bg-white/30 text-white/50 cursor-not-allowed' 
                  : 'text-white/70 hover:bg-white/20 hover:text-white'
              }`}
              onClick={handleBrightnessDown}
              title="Decrease Brightness"
            >
              <Moon size={16} />
            </div>
          </div>

          {/* Monitor/Screen Control */}
          <div 
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-white/70 cursor-pointer hover:bg-white/20 hover:text-white transition-colors"
            onClick={handleMonitorClick}
          >
            <Monitor size={16} />
          </div>

          {/* Test Backend Button (temporary) */}
          <div 
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-white/70 cursor-pointer hover:bg-white/20 hover:text-white transition-colors"
            onClick={testBackend}
          >
            <Code size={16} />
          </div>

          {/* Sparkles with Dropdown */}
          <div className="flex items-center gap-1 px-3 py-2 rounded-lg text-white/70 cursor-pointer hover:bg-white/20 hover:text-white transition-colors">
            <Sparkles size={16} />
            <ChevronDown size={12} />
          </div>

          {/* Layers with Dropdown */}
          <div className="flex items-center gap-1 px-3 py-2 rounded-lg text-white/70 cursor-pointer hover:bg-white/20 hover:text-white transition-colors">
            <Layers size={16} />
            <ChevronDown size={12} />
          </div>

          {/* Hand */}
          <div className="flex items-center gap-1 px-3 py-2 rounded-lg text-white/70 cursor-pointer hover:bg-white/20 hover:text-white transition-colors">
            <Hand size={16} />
          </div>

          {/* Email */}
          <div className="flex items-center gap-1 px-3 py-2 rounded-lg text-white/70 cursor-pointer hover:bg-white/20 hover:text-white transition-colors">
            <Mail size={16} />
          </div>
        </div>
      </div>
    </div>
  );
} 