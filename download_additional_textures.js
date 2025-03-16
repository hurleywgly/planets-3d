const https = require('https');
const fs = require('fs');
const path = require('path');

// Create textures directory if it doesn't exist
const texturesDir = path.join(__dirname, 'assets', 'textures');
if (!fs.existsSync(texturesDir)) {
  fs.mkdirSync(texturesDir, { recursive: true });
}

// List of additional textures to download
const textures = [
  {
    name: 'earth_clouds.jpg',
    url: 'https://www.solarsystemscope.com/textures/download/2k_earth_clouds.jpg'
  },
  {
    name: 'earth_normal.jpg',
    url: 'https://www.solarsystemscope.com/textures/download/2k_earth_normal_map.jpg'
  },
  {
    name: 'earth_specular.jpg',
    url: 'https://www.solarsystemscope.com/textures/download/2k_earth_specular_map.jpg'
  },
  {
    name: 'jupiter_clouds.jpg',
    url: 'https://www.solarsystemscope.com/textures/download/2k_jupiter.jpg'
  },
  {
    name: 'venus_atmosphere.jpg',
    url: 'https://www.solarsystemscope.com/textures/download/2k_venus_atmosphere.jpg'
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
  console.log('Starting additional texture downloads...');
  
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
  
  console.log('All additional downloads completed!');
}

// Run the download
downloadTextures(); 