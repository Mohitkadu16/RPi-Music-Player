export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  filePath: string;
  albumArt?: string;
}