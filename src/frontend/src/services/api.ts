import axios from 'axios';
import { Song } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const fetchMusicLibrary = async (): Promise<Song[]> => {
  const response = await axios.get(`${API_BASE_URL}/api/library`);
  return response.data;
};

export const scanMusicLibrary = async (): Promise<void> => {
  await axios.post(`${API_BASE_URL}/api/library/scan`);
};