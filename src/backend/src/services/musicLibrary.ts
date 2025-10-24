import fs from 'fs';
import path from 'path';
import { parseFile } from 'music-metadata';
import { logger } from '../utils/logger';

interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  filePath: string;
  albumArt?: Buffer;
}

let musicLibrary: Song[] = [];
const MUSIC_DIR = process.env.MUSIC_DIR || '/media/music';

export const setupMusicLibrary = async () => {
  await scanMusicFiles();
};

export const scanMusicFiles = async () => {
  try {
    logger.info('Scanning music files...');
    const files = walkSync(MUSIC_DIR);
    const mp3Files = files.filter(file => file.toLowerCase().endsWith('.mp3'));
    
    musicLibrary = [];
    
    for (const file of mp3Files) {
      try {
        const metadata = await parseFile(file);
        const song: Song = {
          id: Buffer.from(file).toString('base64'),
          title: metadata.common.title || path.basename(file, '.mp3'),
          artist: metadata.common.artist || 'Unknown Artist',
          album: metadata.common.album || 'Unknown Album',
          duration: metadata.format.duration || 0,
          filePath: file,
          albumArt: metadata.common.picture?.[0]?.data
        };
        musicLibrary.push(song);
      } catch (error) {
        logger.error(`Error processing file ${file}:`, error);
      }
    }
    
    logger.info(`Scanned ${musicLibrary.length} music files`);
  } catch (error) {
    logger.error('Error scanning music directory:', error);
    throw error;
  }
};

export const getMusicLibrary = () => {
  return musicLibrary;
};

function walkSync(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const files: string[] = [];
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      files.push(...walkSync(filePath));
    } else {
      files.push(filePath);
    }
  });
  
  return files;
}