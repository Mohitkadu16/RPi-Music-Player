import express from 'express';
import cors from 'cors';
import path from 'path';
import { setupRoutes } from './routes';
import { setupMusicLibrary } from './services/musicLibrary';
import { logger } from './utils/logger';

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../frontend/build')));

// Initialize music library
setupMusicLibrary();

// Setup routes
setupRoutes(app);

// Start server
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});