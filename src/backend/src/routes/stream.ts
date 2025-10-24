import express from 'express';
import fs from 'fs';
import { Request, Response } from 'express';
import { getMusicLibrary } from '../services/musicLibrary';

export const streamRouter = express.Router();

// Stream a specific music file
streamRouter.get('/:id', (req: Request, res: Response) => {
  try {
    const library = getMusicLibrary();
    const song = library.find(s => s.id === req.params.id);

    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }

    const stat = fs.statSync(song.filePath);
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
      const chunksize = (end - start) + 1;
      const stream = fs.createReadStream(song.filePath, { start, end });

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'audio/mpeg'
      });

      stream.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': stat.size,
        'Content-Type': 'audio/mpeg'
      });
      fs.createReadStream(song.filePath).pipe(res);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to stream audio file' });
  }
});