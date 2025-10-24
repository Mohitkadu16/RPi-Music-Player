export interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number;
  filePath: string;
  coverArt?: string;
}

class AudioService {
  private audio: HTMLAudioElement | null = null;
  private currentSong: Song | null = null;

  constructor() {
    this.audio = new Audio();
  }

  async loadSong(song: Song): Promise<void> {
    if (this.audio) {
      this.audio.src = song.filePath;
      this.currentSong = song;
      await this.audio.load();
    }
  }

  play(): void {
    this.audio?.play();
  }

  pause(): void {
    this.audio?.pause();
  }

  setVolume(volume: number): void {
    if (this.audio) {
      this.audio.volume = volume / 100;
    }
  }

  seek(time: number): void {
    if (this.audio) {
      this.audio.currentTime = time;
    }
  }

  getCurrentTime(): number {
    return this.audio?.currentTime || 0;
  }

  getDuration(): number {
    return this.audio?.duration || 0;
  }

  async importLocalFiles(): Promise<Song[]> {
    try {
      // Create a file input element
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      input.accept = 'audio/*';

      // Wrap the file selection in a promise
      const files = await new Promise<FileList | null>((resolve) => {
        input.onchange = (e) => resolve((e.target as HTMLInputElement).files);
        input.click();
      });

      if (!files) return [];

      // Convert FileList to Song array
      const songs: Song[] = Array.from(files).map((file, index) => ({
        id: `local-${index}`,
        title: file.name.replace(/\.[^/.]+$/, ""),
        artist: 'Unknown Artist',
        duration: 0,
        filePath: URL.createObjectURL(file)
      }));

      return songs;
    } catch (error) {
      console.error('Error importing files:', error);
      return [];
    }
  }
}

export const audioService = new AudioService();