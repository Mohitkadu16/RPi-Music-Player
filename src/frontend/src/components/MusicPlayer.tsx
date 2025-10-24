import React, { useRef, useEffect } from 'react';
import { Box, IconButton, Slider, Typography, Card, CardContent } from '@mui/material';
import {
  PlayArrow,
  Pause,
  SkipNext,
  SkipPrevious,
  VolumeUp
} from '@mui/icons-material';
import { Song } from '../types';

interface MusicPlayerProps {
  song: Song;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  song,
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [volume, setVolume] = React.useState(1);
  const [currentTime, setCurrentTime] = React.useState(0);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, song]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleVolumeChange = (_: Event, newValue: number | number[]) => {
    const vol = Array.isArray(newValue) ? newValue[0] : newValue;
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const handleSeek = (_: Event, newValue: number | number[]) => {
    const time = Array.isArray(newValue) ? newValue[0] : newValue;
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  return (
    <Card sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}>
      <CardContent>
        <audio
          ref={audioRef}
          src={`/api/stream/${song.id}`}
          onTimeUpdate={handleTimeUpdate}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
            {song.title}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            {song.artist}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={onPrevious}>
            <SkipPrevious />
          </IconButton>
          <IconButton onClick={onPlayPause}>
            {isPlaying ? <Pause /> : <PlayArrow />}
          </IconButton>
          <IconButton onClick={onNext}>
            <SkipNext />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, mx: 2 }}>
            <Slider
              value={currentTime}
              max={song.duration}
              onChange={handleSeek}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', width: 200 }}>
            <VolumeUp />
            <Slider
              value={volume}
              onChange={handleVolumeChange}
              min={0}
              max={1}
              step={0.01}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MusicPlayer;