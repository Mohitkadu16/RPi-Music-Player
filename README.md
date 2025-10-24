# RPi Music Player

A music player application for Raspberry Pi with TypeScript backend and React frontend. The application runs a web server that allows you to stream your music library from an SD card through a web interface.

## Features

- Scan and organize MP3 files from your SD card
- Extract and display music metadata (title, artist, album)
- Web-based responsive interface
- Basic playback controls (play, pause, next, previous)
- Volume control
- Album art display (when available)
- Easy installation via Debian package

## Requirements

- Raspberry Pi (any model)
- Node.js 14 or higher
- SD card with MP3 files
- Web browser (for the interface)

## Installation

### Using the Debian Package

1. Download the latest `.deb` package from the releases page
2. Install the package:
   ```bash
   sudo dpkg -i rpi-music-player_1.0.0_armhf.deb
   ```
3. The service will start automatically

### Manual Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/rpi-music-player.git
   cd rpi-music-player
   ```

2. Install dependencies and build the application:
   ```bash
   npm run install:all
   npm run build
   ```

3. Start the application:
   ```bash
   npm start
   ```

## Development

1. Install dependencies:
   ```bash
   npm run install:all
   ```

2. Start development servers:
   ```bash
   npm run start:dev
   ```

The backend will run on port 3001 and the frontend on port 3000.

## Configuration

The application can be configured using environment variables:

- `PORT`: Backend server port (default: 3001)
- `MUSIC_DIR`: Directory containing MP3 files (default: /media/music)
- `REACT_APP_API_URL`: Backend API URL for frontend (default: http://localhost:3001)

## Building the Debian Package

To build a Debian package for Raspberry Pi:

1. Ensure you have the required build tools:
   ```bash
   sudo apt-get install build-essential
   ```

2. Run the build script:
   ```bash
   npm run package
   ```

The package will be created in the `build` directory.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details