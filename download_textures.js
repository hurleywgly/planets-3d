const https = require('https');
const fs = require('fs');
const path = require('path');

// Create textures directory if it doesn't exist
const texturesDir = path.join(__dirname, 'assets', 'textures');
if (!fs.existsSync(texturesDir)) {
  fs.mkdirSync(texturesDir, { recursive: true });
}

// List of textures to download
const textures = [
  {
    name: 'sun.jpg',
    url: 'https://www.solarsystemscope.com/textures/download/2k_sun.jpg'
  },
  {
    name: 'mercury.jpg',
    url: 'https://www.solarsystemscope.com/textures/download/2k_mercury.jpg'
  },
  {
    name: 'venus.jpg',
    url: 'https://www.solarsystemscope.com/textures/download/2k_venus_atmosphere.jpg'
  },
  {
    name: 'earth.jpg',
    url: 'https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg'
  },
  {
    name: 'mars.jpg',
    url: 'https://www.solarsystemscope.com/textures/download/2k_mars.jpg'
  },
  {
    name: 'jupiter.jpg',
    url: 'https://www.solarsystemscope.com/textures/download/2k_jupiter.jpg'
  },
  {
    name: 'saturn.jpg',
    url: 'https://www.solarsystemscope.com/textures/download/2k_saturn.jpg'
  },
  {
    name: 'saturn_rings.jpg',
    url: 'https://www.solarsystemscope.com/textures/download/2k_saturn_ring_alpha.png'
  },
  {
    name: 'uranus.jpg',
    url: 'https://www.solarsystemscope.com/textures/download/2k_uranus.jpg'
  },
  {
    name: 'neptune.jpg',
    url: 'https://www.solarsystemscope.com/textures/download/2k_neptune.jpg'
  },
  {
    name: 'moon.jpg',
    url: 'https://www.solarsystemscope.com/textures/download/2k_moon.jpg'
  },
  {
    name: 'stars.jpg',
    url: 'https://www.solarsystemscope.com/textures/download/2k_stars_milky_way.jpg'
  }
];

// Function to download a file
function downloadFile(url, filePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    
    https.get(url, response => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', err => {
      fs.unlink(filePath, () => {}); // Delete the file if there's an error
      reject(err);
    });
  });
}

// Download all textures
async function downloadTextures() {
  console.log('Starting texture downloads...');
  
  for (const texture of textures) {
    const filePath = path.join(texturesDir, texture.name);
    console.log(`Downloading ${texture.name}...`);
    
    try {
      await downloadFile(texture.url, filePath);
      console.log(`✓ Downloaded ${texture.name}`);
    } catch (error) {
      console.error(`✗ Error downloading ${texture.name}: ${error.message}`);
    }
  }
  
  console.log('All downloads completed!');
}

// Run the download
downloadTextures(); 