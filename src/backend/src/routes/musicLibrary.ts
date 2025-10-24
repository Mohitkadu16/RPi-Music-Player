import express from 'express';
import { scanMusicFiles, getMusicLibrary } from '../services/musicLibrary';

export const musicLibraryRouter = express.Router();

// Get all music files
musicLibraryRouter.get('/', async (req, res) => {
  try {
    const library = getMusicLibrary();
    res.json(library);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch music library' });
  }
});

// Rescan music files
musicLibraryRouter.post('/scan', async (req, res) => {
  try {
    await scanMusicFiles();
    res.json({ message: 'Music library scan completed' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to scan music library' });
  }
});