import { Express } from 'express';
import { musicLibraryRouter } from './routes/musicLibrary';
import { streamRouter } from './routes/stream';

export const setupRoutes = (app: Express) => {
  app.use('/api/library', musicLibraryRouter);
  app.use('/api/stream', streamRouter);
};