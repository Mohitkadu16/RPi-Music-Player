import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Paper,
} from '@mui/material';
import { PlayArrow } from '@mui/icons-material';
import { Song } from '../types';

interface MusicLibraryProps {
  songs: Song[];
  currentSong: Song | null;
  onSongSelect: (song: Song) => void;
}

const MusicLibrary: React.FC<MusicLibraryProps> = ({
  songs,
  currentSong,
  onSongSelect,
}) => {
  return (
    <Paper sx={{ mb: 8, maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
      <List>
        {songs.map((song) => (
          <ListItem
            key={song.id}
            selected={currentSong?.id === song.id}
            sx={{
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <ListItemText
              primary={song.title}
              secondary={
                <Typography variant="body2" color="textSecondary">
                  {song.artist} • {song.album}
                </Typography>
              }
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => onSongSelect(song)}>
                <PlayArrow />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default MusicLibrary;