#!/bin/bash

# Exit on any error
set -e

# Configuration
APP_NAME="rpi-music-player"
VERSION="1.0.0"
DESCRIPTION="Raspberry Pi Music Player"
MAINTAINER="Your Name <your.email@example.com>"
ARCHITECTURE="armhf"

# Build directories
BUILD_DIR="build"
PACKAGE_DIR="$BUILD_DIR/package"
INSTALL_DIR="/opt/$APP_NAME"
SERVICE_DIR="/etc/systemd/system"

# Clean and create build directories
rm -rf "$BUILD_DIR"
mkdir -p "$PACKAGE_DIR$INSTALL_DIR"
mkdir -p "$PACKAGE_DIR$SERVICE_DIR"

# Install production dependencies and build the application
npm run install:all
npm run build

# Copy backend files
cp -r src/backend/dist/* "$PACKAGE_DIR$INSTALL_DIR/"
cp src/backend/package.json "$PACKAGE_DIR$INSTALL_DIR/"
cd "$PACKAGE_DIR$INSTALL_DIR"
npm install --production
cd -

# Copy frontend files
cp -r src/frontend/build "$PACKAGE_DIR$INSTALL_DIR/public"

# Create systemd service file
cat > "$PACKAGE_DIR$SERVICE_DIR/$APP_NAME.service" << EOL
[Unit]
Description=$DESCRIPTION
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=$INSTALL_DIR
ExecStart=/usr/bin/node $INSTALL_DIR/index.js
Restart=always
Environment=NODE_ENV=production
Environment=PORT=3001
Environment=MUSIC_DIR=/media/music

[Install]
WantedBy=multi-user.target
EOL

# Create postinst script
mkdir -p "$PACKAGE_DIR/DEBIAN"
cat > "$PACKAGE_DIR/DEBIAN/postinst" << EOL
#!/bin/bash
systemctl daemon-reload
systemctl enable $APP_NAME
systemctl start $APP_NAME
EOL
chmod +x "$PACKAGE_DIR/DEBIAN/postinst"

# Create prerm script
cat > "$PACKAGE_DIR/DEBIAN/prerm" << EOL
#!/bin/bash
systemctl stop $APP_NAME
systemctl disable $APP_NAME
EOL
chmod +x "$PACKAGE_DIR/DEBIAN/prerm"

# Create control file
cat > "$PACKAGE_DIR/DEBIAN/control" << EOL
Package: $APP_NAME
Version: $VERSION
Section: misc
Priority: optional
Architecture: $ARCHITECTURE
Depends: nodejs (>= 14.0.0)
Maintainer: $MAINTAINER
Description: $DESCRIPTION
 A music player application for Raspberry Pi that plays MP3 files
 from an SD card with a web-based interface.
EOL

# Build the package
dpkg-deb --build "$PACKAGE_DIR" "$BUILD_DIR/${APP_NAME}_${VERSION}_${ARCHITECTURE}.deb"

echo "Package created at $BUILD_DIR/${APP_NAME}_${VERSION}_${ARCHITECTURE}.deb"