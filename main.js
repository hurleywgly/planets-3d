// Loading manager to track loading progress
const loadingManager = new THREE.LoadingManager();
const loadingScreen = document.getElementById('loading-screen');
const loadingProgress = document.getElementById('loading-progress');

loadingManager.onProgress = function(url, itemsLoaded, itemsTotal) {
    const progress = (itemsLoaded / itemsTotal) * 100;
    loadingProgress.style.width = progress + '%';
};

loadingManager.onLoad = function() {
    // Hide loading screen with a fade effect
    loadingScreen.style.opacity = '0';
    loadingScreen.style.transition = 'opacity 1s ease';
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 1000);
};

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Camera position
camera.position.set(0, 50, 100);

// Lighting
const sunLight = new THREE.PointLight(0xffffff, 2, 300, 1);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

const ambientLight = new THREE.AmbientLight(0x404040, 0.2);
scene.add(ambientLight);

// Add starfield background
const textureLoader = new THREE.TextureLoader(loadingManager);
textureLoader.setPath('assets/textures/');

// Load starfield texture or create a procedural one if not available
let stars;
textureLoader.load(
    'stars.jpg',
    function(starTexture) {
        const starGeometry = new THREE.SphereGeometry(500, 64, 64);
        const starMaterial = new THREE.MeshBasicMaterial({ 
            map: starTexture, 
            side: THREE.BackSide 
        });
        stars = new THREE.Mesh(starGeometry, starMaterial);
        scene.add(stars);
    },
    undefined,
    function(err) {
        console.log('Starfield texture not found, creating procedural stars');
        // Create procedural stars as a fallback
        stars = createProceduralStars();
        scene.add(stars);
    }
);

// Function to create procedural stars
function createProceduralStars() {
    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 10000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount; i++) {
        const i3 = i * 3;
        // Position stars in a sphere
        const radius = 400 + Math.random() * 100;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);
        
        // Random star colors (mostly white with some blue/yellow tints)
        const brightness = 0.7 + Math.random() * 0.3;
        colors[i3] = brightness;
        colors[i3 + 1] = brightness;
        colors[i3 + 2] = brightness + (Math.random() > 0.8 ? -0.3 : 0.3) * Math.random();
    }
    
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const starsMaterial = new THREE.PointsMaterial({
        size: 1.5,
        sizeAttenuation: true,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
    });
    
    return new THREE.Points(starsGeometry, starsMaterial);
}

// Planet data (scaled sizes and distances for visualization)
const earthOrbitalPeriod = 10; // Earth's orbit in seconds (scaled)
const planets = [
    { 
        name: 'Mercury', 
        radius: 0.5, 
        distance: 10, 
        orbitalPeriod: 88 / 365, 
        texture: 'mercury.jpg', 
        color: 0xE5E5E5, 
        info: 'Smallest planet, closest to the Sun',
        detailedInfo: 'Mercury is the smallest planet and closest to the Sun, with a rocky, cratered surface similar to our Moon. It has extreme temperatures, scorching hot by day and freezing at night, since it barely has an atmosphere. Fun fact: A day on Mercury lasts longer than its year!'
    },
    { 
        name: 'Venus', 
        radius: 1, 
        distance: 15, 
        orbitalPeriod: 225 / 365, 
        texture: 'venus.jpg', 
        atmosphereTexture: 'venus_atmosphere.jpg', 
        color: 0xFFC649, 
        info: 'Similar in size to Earth, known for extreme temperatures',
        detailedInfo: 'Venus is Earth\'s super-hot twin, with thick clouds trapping heat, making it the hottest planet—hot enough to melt lead! Its surface is rocky, volcanic, and completely hidden by clouds of sulfuric acid. Fun fact: Venus rotates so slowly, its day is actually longer than its year.'
    },
    { 
        name: 'Earth', 
        radius: 1, 
        distance: 20, 
        orbitalPeriod: 1, 
        texture: 'earth.jpg', 
        cloudsTexture: 'earth_clouds.jpg', 
        color: 0x6B93D6, 
        info: 'Our home planet, the only known world with life',
        detailedInfo: 'Earth is our vibrant home planet, the only one we know that supports life. Covered mostly by oceans, it has a breathable atmosphere of nitrogen and oxygen and is just the right distance from the Sun to sustain life. Fun fact: About 70% of Earth\'s surface is water!'
    },
    { 
        name: 'Mars', 
        radius: 0.7, 
        distance: 25, 
        orbitalPeriod: 687 / 365, 
        texture: 'mars.jpg', 
        color: 0xE27B58, 
        info: 'The Red Planet, home to the largest volcano in the solar system',
        detailedInfo: 'Mars, the Red Planet, is rocky, dusty, and cold, with iron-rich soil giving it its reddish glow. It features massive volcanoes, canyons, and polar ice caps. Fun fact: Mars has the tallest volcano in the solar system, Olympus Mons—three times taller than Mount Everest!'
    },
    { 
        name: 'Jupiter', 
        radius: 3, 
        distance: 40, 
        orbitalPeriod: 4332 / 365, 
        texture: 'jupiter.jpg', 
        color: 0xC88B3A, 
        info: 'Largest planet, a gas giant with a Great Red Spot',
        detailedInfo: 'Jupiter is the largest planet, a swirling giant made mostly of hydrogen and helium gas. It\'s famous for its Great Red Spot—a gigantic storm wider than Earth! Fun fact: Jupiter has at least 95 moons, the most in our solar system!'
    },
    { 
        name: 'Saturn', 
        radius: 2.5, 
        distance: 60, 
        orbitalPeriod: 10759 / 365, 
        texture: 'saturn.jpg', 
        ringsTexture: 'saturn_rings.jpg', 
        color: 0xEAD6B8, 
        info: 'Famous for its spectacular ring system',
        detailedInfo: 'Saturn is an iconic gas giant known for its spectacular rings, made of countless icy particles and dust. It\'s mostly hydrogen and helium, incredibly windy, and extremely cold. Fun fact: Saturn is so light, it could float in water—if there were an ocean big enough!'
    },
    { 
        name: 'Uranus', 
        radius: 2, 
        distance: 80, 
        orbitalPeriod: 30687 / 365, 
        texture: 'uranus.jpg', 
        color: 0xB1E3E4, 
        info: 'Ice giant that rotates on its side',
        detailedInfo: 'Uranus is an ice giant with an atmosphere of hydrogen, helium, and methane—giving it a pale blue-green color. It rotates sideways, making it appear to roll along its orbit! Fun fact: Each season on Uranus lasts 21 years!'
    },
    { 
        name: 'Neptune', 
        radius: 2, 
        distance: 100, 
        orbitalPeriod: 60190 / 365, 
        texture: 'neptune.jpg', 
        color: 0x5B5DDF, 
        info: 'Windiest planet with the strongest storms',
        detailedInfo: 'Neptune, the farthest planet, is a cold, windy gas giant with deep-blue clouds and raging storms. Winds here are faster than anywhere else in our solar system, reaching over 1,200 mph! Fun fact: Neptune was discovered by mathematical prediction before it was observed with telescopes!'
    }
];

// Create Sun
const sunTexture = textureLoader.load('sun.jpg', undefined, undefined, function(err) {
    console.log('Sun texture not found, using fallback');
});

// Create a glow effect for the sun
const sunGlowGeometry = new THREE.SphereGeometry(5.5, 64, 64);
const sunGlowMaterial = new THREE.ShaderMaterial({
    uniforms: {
        "c": { type: "f", value: 0.2 },
        "p": { type: "f", value: 3.0 },
        glowColor: { type: "c", value: new THREE.Color(0xffff00) },
        viewVector: { type: "v3", value: camera.position }
    },
    vertexShader: `
        uniform vec3 viewVector;
        uniform float c;
        uniform float p;
        varying float intensity;
        void main() {
            vec3 vNormal = normalize(normal);
            vec3 vNormel = normalize(viewVector);
            intensity = pow(c - dot(vNormal, vNormel), p);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform vec3 glowColor;
        varying float intensity;
        void main() {
            vec3 glow = glowColor * intensity;
            gl_FragColor = vec4(glow, 1.0);
        }
    `,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true
});

const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
scene.add(sunGlow);

const sun = new THREE.Mesh(
    new THREE.SphereGeometry(5, 64, 64),
    new THREE.MeshBasicMaterial({ 
        map: sunTexture || null,
        color: sunTexture ? 0xffffff : 0xFDB813,
        emissive: 0xFDB813,
        emissiveIntensity: 0.6
    })
);
sun.name = 'Sun';
sun.userData = { 
    info: 'The star at the center of our Solar System',
    detailedInfo: 'The Sun is a gigantic ball of super-hot plasma, mainly hydrogen and helium, and it\'s the powerhouse of our solar system. Without its warmth and light, life on Earth couldn\'t exist. Fun fact: it contains 99.8% of all mass in the entire solar system!'
};
scene.add(sun);

// Create orbital paths
const orbitalPaths = [];
planets.forEach(planet => {
    const orbitGeometry = new THREE.RingGeometry(planet.distance - 0.1, planet.distance + 0.1, 128);
    const orbitMaterial = new THREE.MeshBasicMaterial({ 
        color: planet.color, 
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.3
    });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2;
    scene.add(orbit);
    orbitalPaths.push(orbit);
});

// Create planets
const planetMeshes = [];
planets.forEach(planet => {
    const texture = textureLoader.load(planet.texture, undefined, undefined, function(err) {
        console.log(`${planet.name} texture not found, using fallback`);
    });
    
    const geometry = new THREE.SphereGeometry(planet.radius, 64, 64);
    const material = new THREE.MeshPhongMaterial({ 
        map: texture || null,
        color: texture ? 0xffffff : planet.color,
        shininess: 5
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = planet.name;
    mesh.userData = { 
        info: planet.info,
        detailedInfo: planet.detailedInfo,
        distance: planet.distance,
        orbitalPeriod: planet.orbitalPeriod
    };
    
    scene.add(mesh);
    planetMeshes.push({
        mesh,
        distance: planet.distance,
        orbitalPeriod: earthOrbitalPeriod * planet.orbitalPeriod
    });

    // Add atmosphere/clouds for planets that have them
    if (planet.cloudsTexture) {
        const cloudsTexture = textureLoader.load(planet.cloudsTexture);
        const cloudsGeometry = new THREE.SphereGeometry(planet.radius + 0.03, 64, 64);
        const cloudsMaterial = new THREE.MeshPhongMaterial({
            map: cloudsTexture,
            transparent: true,
            opacity: 0.8
        });
        const clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
        mesh.add(clouds);
        
        // Store clouds for animation
        mesh.userData.clouds = clouds;
    }
    
    // Special case for Venus atmosphere
    if (planet.atmosphereTexture) {
        const atmosphereTexture = textureLoader.load(planet.atmosphereTexture);
        const atmosphereGeometry = new THREE.SphereGeometry(planet.radius + 0.05, 64, 64);
        const atmosphereMaterial = new THREE.MeshPhongMaterial({
            map: atmosphereTexture,
            transparent: true,
            opacity: 0.8
        });
        const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        mesh.add(atmosphere);
        
        // Store atmosphere for animation
        mesh.userData.atmosphere = atmosphere;
    }

    // Special case for Saturn's rings
    if (planet.name === 'Saturn') {
        const ringTexture = textureLoader.load(planet.ringsTexture, undefined, undefined, function(err) {
            console.log('Saturn rings texture not found, using fallback');
        });
        
        const ringGeometry = new THREE.RingGeometry(3.5, 5.5, 64);
        
        // Add UV mapping for the ring texture
        const pos = ringGeometry.attributes.position;
        const v3 = new THREE.Vector3();
        const uv = [];
        
        for (let i = 0; i < pos.count; i++) {
            v3.fromBufferAttribute(pos, i);
            uv.push(
                (v3.x / 5.5 + 1) / 2,
                (v3.y / 5.5 + 1) / 2
            );
        }
        
        ringGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
        
        const ringMaterial = new THREE.MeshBasicMaterial({ 
            map: ringTexture || null,
            color: ringTexture ? 0xffffff : 0xCDAA7D,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.9
        });
        
        const rings = new THREE.Mesh(ringGeometry, ringMaterial);
        rings.rotation.x = Math.PI / 2;
        mesh.add(rings);
    }
});

// Add Earth's Moon
const moonTexture = textureLoader.load('moon.jpg', undefined, undefined, function(err) {
    console.log('Moon texture not found, using fallback');
});
const moon = new THREE.Mesh(
    new THREE.SphereGeometry(0.27, 32, 32),
    new THREE.MeshPhongMaterial({ 
        map: moonTexture || null,
        color: moonTexture ? 0xffffff : 0xDDDDDD
    })
);
moon.name = 'Moon';
moon.userData = { 
    info: 'Earth\'s only natural satellite',
    detailedInfo: 'The Moon is Earth\'s only natural satellite, a rocky, cratered world with no atmosphere. Its gravitational pull causes Earth\'s tides, and it always shows the same face to Earth because it rotates at the same rate it orbits. Fun fact: The Moon is slowly moving away from Earth at about 3.8 cm per year!'
};
const earthMesh = planetMeshes.find(p => p.mesh.name === 'Earth').mesh;
earthMesh.add(moon);

// Create a simple info panel
const infoPanel = document.createElement('div');
infoPanel.style.position = 'absolute';
infoPanel.style.bottom = '20px';
infoPanel.style.left = '20px';
infoPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
infoPanel.style.color = 'white';
infoPanel.style.padding = '20px';
infoPanel.style.borderRadius = '10px';
infoPanel.style.fontFamily = 'Arial, sans-serif';
infoPanel.style.maxWidth = '350px';
infoPanel.style.maxHeight = '70vh';
infoPanel.style.overflowY = 'auto';
infoPanel.style.display = 'none';
infoPanel.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.5)';
infoPanel.style.lineHeight = '1.5';
infoPanel.style.fontSize = '14px';
infoPanel.style.zIndex = '100'; // Ensure it's above other elements
document.body.appendChild(infoPanel);

// Make info panel responsive for mobile
function updateInfoPanelForScreenSize() {
    if (window.innerWidth < 768) { // Mobile breakpoint
        infoPanel.style.left = '10px';
        infoPanel.style.right = '10px';
        infoPanel.style.bottom = '10px';
        infoPanel.style.maxWidth = 'calc(100% - 20px)';
        infoPanel.style.fontSize = '16px';
        infoPanel.style.padding = '20px';
        infoPanel.style.maxHeight = '80vh';
        infoPanel.style.lineHeight = '1.6';
    } else {
        infoPanel.style.left = '20px';
        infoPanel.style.right = 'auto';
        infoPanel.style.bottom = '20px';
        infoPanel.style.maxWidth = '350px';
        infoPanel.style.fontSize = '14px';
        infoPanel.style.padding = '20px';
        infoPanel.style.maxHeight = '70vh';
        infoPanel.style.lineHeight = '1.5';
    }
}

// Call initially and on window resize
updateInfoPanelForScreenSize();
window.addEventListener('resize', updateInfoPanelForScreenSize);

// Create a title panel
const titlePanel = document.createElement('div');
titlePanel.style.position = 'absolute';
titlePanel.style.top = '20px';
titlePanel.style.left = '20px';
titlePanel.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
titlePanel.style.color = 'white';
titlePanel.style.padding = '10px';
titlePanel.style.borderRadius = '5px';
titlePanel.style.fontFamily = 'Arial, sans-serif';
titlePanel.innerHTML = '<h2 style="margin: 0;">Interactive Solar System</h2>' +
                       '<p style="margin: 5px 0 0 0;">Click on planets for info. Scroll to zoom.</p>';
document.body.appendChild(titlePanel);

// Create a speed control slider
const speedControl = document.createElement('div');
speedControl.style.position = 'absolute';
speedControl.style.top = '20px';
speedControl.style.right = '20px';
speedControl.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
speedControl.style.color = 'white';
speedControl.style.padding = '10px';
speedControl.style.borderRadius = '5px';
speedControl.style.fontFamily = 'Arial, sans-serif';
speedControl.innerHTML = '<label for="speed-slider">Orbital Speed: </label>' +
                         '<input type="range" id="speed-slider" min="0.1" max="5" step="0.1" value="1" style="width: 100px;">';
document.body.appendChild(speedControl);

// Speed factor for animations
let speedFactor = 1;
document.getElementById('speed-slider').addEventListener('input', function(e) {
    speedFactor = parseFloat(e.target.value);
});

// OrbitControls for interactivity
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 10;
controls.maxDistance = 300;
controls.rotateSpeed = 0.8; // Adjust rotation speed
controls.zoomSpeed = 1.2;   // Adjust zoom speed
controls.panSpeed = 0.8;    // Adjust pan speed
controls.screenSpacePanning = true; // More intuitive panning
controls.enableTouch = true; // Ensure touch is enabled

// Adjust controls based on device
function updateControlsForDevice() {
    if (window.innerWidth < 768) { // Mobile
        controls.rotateSpeed = 0.6; // Slower rotation for more precision on small screens
        controls.zoomSpeed = 0.8;   // Slower zoom for more control
    } else {
        controls.rotateSpeed = 0.8;
        controls.zoomSpeed = 1.2;
    }
}

// Call initially and on resize
updateControlsForDevice();
window.addEventListener('resize', updateControlsForDevice);

// Raycaster for clicking
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Handle both mouse clicks and touch events
function handleInteraction(event) {
    // Prevent default behavior for touch events
    if (event.preventDefault) {
        event.preventDefault();
    }
    
    // Get the position from either mouse click or touch
    const position = event.touches ? event.touches[0] : event;
    
    // Calculate normalized device coordinates
    mouse.x = (position.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(position.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    
    if (intersects.length > 0) {
        const selectedObject = intersects[0].object;
        
        // Find the parent if it's a child object (like the moon)
        const targetObject = selectedObject.parent && selectedObject.parent.name ? 
                            selectedObject.parent : selectedObject;
        
        if (targetObject.name) {
            // Display info panel with detailed information
            infoPanel.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h2 style="margin: 0; color: #3498db; font-size: ${window.innerWidth < 768 ? '24px' : '20px'};">${targetObject.name}</h2>
                    <button id="closeInfoPanel" style="background: none; border: none; color: white; font-size: 28px; cursor: pointer; padding: 0 5px;">×</button>
                </div>
            `;
            
            // Use detailed info if available
            if (targetObject.userData && targetObject.userData.detailedInfo) {
                // Replace newlines with HTML line breaks
                const formattedInfo = targetObject.userData.detailedInfo.replace(/\n/g, '<br>');
                infoPanel.innerHTML += `<p style="margin-bottom: 15px;">${formattedInfo}</p>`;
            } else if (targetObject.userData && targetObject.userData.info) {
                infoPanel.innerHTML += `<p style="margin-bottom: 15px;">${targetObject.userData.info}</p>`;
            }
            
            // Add more detailed information for planets
            if (targetObject.name !== 'Sun' && targetObject.name !== 'Moon') {
                const planetData = planets.find(p => p.name === targetObject.name);
                if (planetData) {
                    infoPanel.innerHTML += `
                        <div style="background-color: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin-top: 15px;">
                            <p style="font-size: ${window.innerWidth < 768 ? '18px' : '14px'}; margin: 8px 0;"><strong>Distance from Sun:</strong> ${planetData.distance} AU</p>
                            <p style="font-size: ${window.innerWidth < 768 ? '18px' : '14px'}; margin: 8px 0 0 0;"><strong>Orbital Period:</strong> ${(planetData.orbitalPeriod * 365).toFixed(1)} Earth days</p>
                        </div>
                    `;
                }
            }
            
            infoPanel.style.display = 'block';
            
            // Animate camera to focus on the selected object
            const targetPosition = new THREE.Vector3();
            targetObject.getWorldPosition(targetPosition);
            
            // Calculate appropriate camera distance based on object size
            const objectSize = targetObject.name === 'Sun' ? 15 : 
                              (targetObject.geometry.parameters.radius * 10 + 10);
            
            // Set target for camera animation
            cameraTargetObject = targetObject;
            cameraTargetPosition = targetPosition;
            cameraTargetDistance = objectSize;
            isAnimatingCamera = true;

            // Add event listener to close button
            setTimeout(() => {
                const closeButton = document.getElementById('closeInfoPanel');
                if (closeButton) {
                    closeButton.addEventListener('click', function(e) {
                        e.stopPropagation();
                        infoPanel.style.display = 'none';
                    });
                }
            }, 0);
        }
    } else {
        // Hide info panel when clicking empty space
        infoPanel.style.display = 'none';
        
        // Reset camera animation
        isAnimatingCamera = false;
    }
}

// Add event listeners for both mouse and touch
window.addEventListener('click', handleInteraction);
window.addEventListener('touchstart', handleInteraction);

// Camera animation variables
let isAnimatingCamera = false;
let cameraTargetObject = null;
let cameraTargetPosition = new THREE.Vector3();
let cameraTargetDistance = 50;
const cameraAnimationDuration = 1.5; // seconds
let cameraAnimationProgress = 0;

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit to 2x for performance
});

// Animation loop
let startTime = Date.now();
function animate() {
    requestAnimationFrame(animate);
    const elapsed = (Date.now() - startTime) / 1000 * speedFactor; // seconds adjusted by speed factor

    // Update planet orbits
    planetMeshes.forEach(planet => {
        const angle = (elapsed / planet.orbitalPeriod) * 2 * Math.PI;
        planet.mesh.position.x = planet.distance * Math.cos(angle);
        planet.mesh.position.z = planet.distance * Math.sin(angle);
        planet.mesh.rotation.y += 0.01 * speedFactor; // Self-rotation adjusted by speed
        
        // Animate clouds if present
        if (planet.mesh.userData.clouds) {
            planet.mesh.userData.clouds.rotation.y += 0.015 * speedFactor; // Clouds rotate faster
        }
        
        // Animate atmosphere if present
        if (planet.mesh.userData.atmosphere) {
            planet.mesh.userData.atmosphere.rotation.y += 0.005 * speedFactor; // Atmosphere rotates slower
        }
    });

    // Update Moon's orbit around Earth
    const moonOrbitalPeriod = 2; // 2 seconds for Moon's orbit
    const moonAngle = (elapsed / moonOrbitalPeriod) * 2 * Math.PI;
    moon.position.set(2 * Math.cos(moonAngle), 0, 2 * Math.sin(moonAngle));
    moon.rotation.y += 0.005 * speedFactor; // Moon's self-rotation

    // Sun's self-rotation
    sun.rotation.y += 0.002 * speedFactor;
    
    // Update sun glow effect
    sunGlowMaterial.uniforms.viewVector.value = new THREE.Vector3().subVectors(
        camera.position,
        sun.position
    );

    // Handle camera animation
    if (isAnimatingCamera && cameraTargetObject) {
        cameraAnimationProgress += 1 / (60 * cameraAnimationDuration); // 60fps
        
        if (cameraAnimationProgress >= 1) {
            isAnimatingCamera = false;
            cameraAnimationProgress = 0;
        } else {
            // Update target position in case the object is moving
            cameraTargetObject.getWorldPosition(cameraTargetPosition);
            
            // Calculate new camera position
            const currentPosition = new THREE.Vector3();
            camera.getWorldPosition(currentPosition);
            
            // Direction from target to camera
            const direction = new THREE.Vector3().subVectors(currentPosition, cameraTargetPosition).normalize();
            
            // New position at the desired distance
            const newPosition = new THREE.Vector3().addVectors(
                cameraTargetPosition,
                direction.multiplyScalar(cameraTargetDistance)
            );
            
            // Smoothly interpolate camera position
            camera.position.lerp(newPosition, 0.05);
            
            // Look at the target
            controls.target.copy(cameraTargetPosition);
        }
    }

    controls.update();
    renderer.render(scene, camera);
}
animate();