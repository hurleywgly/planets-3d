# Interactive 3D Solar System

An immersive, educational WebGL-powered visualization of our solar system built with Three.js.

## Features

- **Realistic Planetary Visualization**: High-quality textures and scaled representations of the Sun, planets, and Earth's Moon
- **Focused exploration**: Select a body in the rail or directly in the scene to focus the camera and inspect it
- **NASA-informed facts**: Each card separates compressed display scale from physical data and cites its primary source
- **Exploration commands**: Reset, pause/resume, and orbit-rate controls remain available at every viewport size
- **Sharper rendering**: sRGB output, ACES filmic tone mapping, anisotropic texture filtering, and a high-performance renderer preference
- **Responsive composition**: The body rail, information card, and controls reflow so mobile UI regions do not collide
- **Fallback Textures**: Graceful degradation with color-based fallbacks if textures aren't available

## Getting Started

### Prerequisites

- A modern web browser with WebGL support (Chrome, Firefox, Safari, Edge)
- For the Node.js server option: Node.js installed on your system

### Running the Project

There are multiple ways to run this project:

#### Option 1: Using the included Node.js server

1. Clone this repository or download the files
2. Make sure you have Node.js installed
3. Run the server:
   ```
   node server.js
   ```
4. Open your browser to `http://localhost:8080`

#### Option 2: Using Python's built-in HTTP server

1. Clone this repository or download the files
2. Make sure you have Python installed
3. Run the server:
   ```
   python -m http.server
   ```
4. Open your browser to `http://localhost:8000`

#### Option 3: Using any web server

You can use any web server of your choice (Apache, Nginx, etc.) by configuring it to serve the project directory.

## Project Structure

```
/
├── index.html          # Main HTML file
├── main.js             # JavaScript code for the solar system
├── server.js           # Simple Node.js server
├── 404.html            # Custom 404 page
├── README.md           # This documentation
└── assets/
    └── textures/       # Directory for texture images
```

## Texture Files

For the best experience, place the following texture files in the `assets/textures/` directory:

- `sun.jpg` - Texture for the Sun
- `mercury.jpg` - Texture for Mercury
- `venus.jpg` - Texture for Venus
- `earth.jpg` - Texture for Earth
- `mars.jpg` - Texture for Mars
- `jupiter.jpg` - Texture for Jupiter
- `saturn.jpg` - Texture for Saturn
- `saturn_rings.jpg` - Texture for Saturn's rings
- `uranus.jpg` - Texture for Uranus
- `neptune.jpg` - Texture for Neptune
- `moon.jpg` - Texture for Earth's Moon
- `stars.jpg` - Background starfield texture

If any texture files are missing, the application will use colored fallbacks.

## Exploration

- Select the Sun, a planet, or the Moon from the body rail or directly in the scene.
- Drag to orbit, scroll or pinch to zoom, and pan with the secondary pointer action.
- Use `Reset` to return to the system view, `Pause` to stop motion, and the motion slider to set orbital rate.
- Physical values and their source treatment are recorded in [SOURCE_NOTES.md](SOURCE_NOTES.md).

## Technical Details

This project uses:

- **Three.js**: For 3D rendering and WebGL integration
- **OrbitControls**: For camera manipulation
- **HTML/CSS/JavaScript**: For structure, styling, and logic
- **Raycasting**: For object selection
- **Dynamic loading**: With progress tracking and fallbacks

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Planet data based on real astronomical measurements (scaled for visualization)
- Three.js community for the excellent 3D library
