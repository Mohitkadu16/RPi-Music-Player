import { ThemeProvider } from '@mui/material/styles';
import { 
  CssBaseline,
  Box,
  Typography,
  Slider,
  IconButton,
  Stack,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Paper
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  SkipNext as SkipNextIcon,
  SkipPrevious as SkipPreviousIcon,
  VolumeUp as VolumeUpIcon,
  VolumeDown as VolumeDownIcon,
  Shuffle as ShuffleIcon,
  Repeat as RepeatIcon,
  Home as HomeIcon,
  Search as SearchIcon,
  LibraryMusic as LibraryMusicIcon,
  Add as AddIcon,
  MusicNote as MusicNoteIcon
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import theme from './theme';
import { audioService, type Song } from './services/audioService';

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);

  // Update duration when loading a new song
  useEffect(() => {
    if (currentSong) {
      const newDuration = audioService.getDuration();
      setDuration(newDuration);
    }
  }, [currentSong]);

  const handleImportSongs = async () => {
    const importedSongs = await audioService.importLocalFiles();
    setSongs([...songs, ...importedSongs]);
    if (importedSongs.length > 0 && !currentSong) {
      const firstSong = importedSongs[0];
      setCurrentSong(firstSong);
      await audioService.loadSong(firstSong);
      setDuration(audioService.getDuration());
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      audioService.pause();
    } else {
      audioService.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeChange = (_: Event, value: number | number[]) => {
    const newTime = value as number;
    setCurrentTime(newTime);
    audioService.seek(newTime);
  };

  const handleVolumeChange = (_: Event, value: number | number[]) => {
    const newVolume = value as number;
    setVolume(newVolume);
    audioService.setVolume(newVolume);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>
        {/* Sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            width: 240,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 240,
              boxSizing: 'border-box',
              bgcolor: 'background.paper',
            },
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              RPi Music Player
            </Typography>
            <List>
              <ListItem button>
                <ListItemIcon><HomeIcon /></ListItemIcon>
                <ListItemText primary="Home" />
              </ListItem>
              <ListItem button>
                <ListItemIcon><SearchIcon /></ListItemIcon>
                <ListItemText primary="Search" />
              </ListItem>
              <ListItem button>
                <ListItemIcon><LibraryMusicIcon /></ListItemIcon>
                <ListItemText primary="Your Library" />
              </ListItem>
            </List>
            <Box sx={{ mt: 2 }}>
              <Button
                startIcon={<AddIcon />}
                onClick={handleImportSongs}
                fullWidth
                variant="contained"
                sx={{ mb: 2 }}
              >
                Import Songs
              </Button>
            </Box>
          </Box>
        </Drawer>

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
          <Typography variant="h5" gutterBottom>
            Your Music
          </Typography>
          
          <List>
            {songs.map((song, index) => (
              <ListItem
                key={song.id}
                button
                selected={currentSong?.id === song.id}
                onClick={async () => {
                  setCurrentSong(song);
                  await audioService.loadSong(song);
                  audioService.play();
                  setIsPlaying(true);
                }}
              >
                <ListItemIcon>
                  <MusicNoteIcon />
                </ListItemIcon>
                <ListItemText
                  primary={song.title}
                  secondary={song.artist}
                />
                <Typography variant="body2" color="text.secondary">
                  {formatTime(song.duration)}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Box>

            {/* Progress Bar */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ mr: 1 }}>{formatTime(currentTime)}</Typography>
              <Slider
                value={currentTime}
                min={0}
                max={duration}
                onChange={handleTimeChange}
                sx={{ mx: 2 }}
              />
              <Typography sx={{ ml: 1 }}>{formatTime(duration)}</Typography>
            </Box>

            {/* Playback Controls */}
            <Stack 
              direction="row" 
              spacing={2} 
              justifyContent="center" 
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <IconButton 
                onClick={() => setShuffle(!shuffle)}
                color={shuffle ? "primary" : "default"}
              >
                <ShuffleIcon />
              </IconButton>
              <IconButton>
                <SkipPreviousIcon />
              </IconButton>
              <IconButton 
                onClick={handlePlayPause}
                sx={{ 
                  backgroundColor: 'primary.main',
                  '&:hover': { backgroundColor: 'primary.dark' },
                }}
              >
                {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
              </IconButton>
              <IconButton>
                <SkipNextIcon />
              </IconButton>
              <IconButton 
                onClick={() => setRepeat(!repeat)}
                color={repeat ? "primary" : "default"}
              >
                <RepeatIcon />
              </IconButton>
            </Stack>

            {/* Volume Control */}
            <Stack 
              direction="row" 
              spacing={2} 
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <VolumeDownIcon />
              <Slider
                value={volume}
                onChange={handleVolumeChange}
                aria-label="Volume"
                sx={{ maxWidth: 200 }}
              />
              <VolumeUpIcon />
            </Stack>

          {/* Playlist */}
          <Paper 
            elevation={3} 
            sx={{ 
              mt: 3, 
              backgroundColor: 'background.paper',
              borderRadius: 2
            }}
          >
            <List>
              {songs.map((song: Song) => (
                <ListItem 
                  key={song.id}
                  button
                  sx={{
                    '&:hover': { backgroundColor: 'action.hover' }
                  }}
                >
                  <ListItemText 
                    primary={song.title}
                    secondary={song.artist}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {song.duration}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>

        {/* Player Controls (Fixed at bottom) */}
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: 'background.paper',
            borderTop: 1,
            borderColor: 'divider',
            p: 2,
            zIndex: 1000
          }}
        >
          {/* Song Info */}
          <Box sx={{ display: 'flex', mb: 1 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1">
                {currentSong?.title || 'No song selected'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {currentSong?.artist || 'Import songs to begin'}
              </Typography>
            </Box>
          </Box>

          {/* Playback Controls */}
          <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 1 }}>
            <IconButton 
              onClick={() => setShuffle(!shuffle)}
              color={shuffle ? "primary" : "default"}
              size="small"
            >
              <ShuffleIcon />
            </IconButton>
            <IconButton size="small">
              <SkipPreviousIcon />
            </IconButton>
            <IconButton 
              onClick={() => {
                if (isPlaying) {
                  audioService.pause();
                } else {
                  audioService.play();
                }
                setIsPlaying(!isPlaying);
              }}
              sx={{ 
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': { bgcolor: 'primary.dark' },
              }}
            >
              {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
            <IconButton size="small">
              <SkipNextIcon />
            </IconButton>
            <IconButton 
              onClick={() => setRepeat(!repeat)}
              color={repeat ? "primary" : "default"}
              size="small"
            >
              <RepeatIcon />
            </IconButton>
          </Stack>

          {/* Progress Bar */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="caption">{formatTime(currentTime)}</Typography>
            <Slider
              size="small"
              value={currentTime}
              max={duration}
              onChange={(_, value) => {
                const newTime = value as number;
                setCurrentTime(newTime);
                audioService.seek(newTime);
              }}
              sx={{ mx: 2 }}
            />
            <Typography variant="caption">{formatTime(duration)}</Typography>
          </Box>

          {/* Volume Control */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 1 }}>
            <VolumeDownIcon sx={{ mr: 1 }} />
            <Slider
              size="small"
              value={volume}
              onChange={(_, value) => {
                const newVolume = value as number;
                setVolume(newVolume);
                audioService.setVolume(newVolume);
              }}
              sx={{ width: 100 }}
            />
            <VolumeUpIcon sx={{ ml: 1 }} />
          </Box>
        </Box>
      </ThemeProvider>
    );
}

export default App;