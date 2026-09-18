const loadingManager = new THREE.LoadingManager();
const loadingScreen = document.getElementById('loading-screen');
const loadingProgress = document.getElementById('loading-progress');
const infoCard = document.getElementById('info-card');
const bodyRailList = document.getElementById('body-rail-list');
const speedSlider = document.getElementById('speed-slider');
const speedValue = document.getElementById('speed-value');
const pauseButton = document.getElementById('pause-orbits');

loadingManager.onProgress = (_, loaded, total) => { loadingProgress.style.width = `${Math.round((loaded / total) * 100)}%`; };
loadingManager.onLoad = () => {
    loadingProgress.style.width = '100%';
    loadingScreen.style.opacity = '0';
    window.setTimeout(() => { loadingScreen.style.display = 'none'; }, 380);
};

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x01050b);
const camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
renderer.physicallyCorrectLights = true;
document.body.appendChild(renderer.domElement);

const HOME_POSITION = new THREE.Vector3(0, 34, 112);
const HOME_TARGET = new THREE.Vector3(0, 0, 0);
camera.position.copy(HOME_POSITION);
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.07;
controls.maxDistance = 190;
controls.minDistance = 7;
controls.panSpeed = 0.7;
controls.rotateSpeed = 0.65;
controls.screenSpacePanning = true;
controls.target.copy(HOME_TARGET);
controls.zoomSpeed = 0.85;

const textureLoader = new THREE.TextureLoader(loadingManager);
textureLoader.setPath('assets/textures/');
const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
function loadTexture(name, onError) {
    return textureLoader.load(name, texture => {
        texture.encoding = THREE.sRGBEncoding;
        texture.anisotropy = Math.min(8, maxAnisotropy);
    }, undefined, () => { if (onError) onError(); });
}

scene.add(new THREE.PointLight(0xfff1ce, 2100, 240, 2));
scene.add(new THREE.AmbientLight(0x23324a, 0.28));
const starField = new THREE.Mesh(
    new THREE.SphereGeometry(450, 48, 48),
    new THREE.MeshBasicMaterial({ map: loadTexture('stars.jpg'), side: THREE.BackSide })
);
scene.add(starField);

const SUN = {
    name: 'Sun', category: 'G-type main-sequence star', color: '#ffe071',
    summary: 'The Sun is the star at the center of the Solar System. Its gravity holds the planets in orbit and its light powers conditions on Earth.',
    facts: [['Type', 'G-type star'], ['Diameter', '1.39 million km'], ['Surface', 'About 5,500 C'], ['System mass', 'About 99.8%']],
    factUrl: 'https://science.nasa.gov/sun/'
};

// Scene distances and radii are deliberately compressed. Fact-card values remain physical NASA data.
const PLANETS = [
    { name: 'Mercury', category: 'Terrestrial planet', sceneRadius: 0.56, sceneDistance: 11, orbitDays: 88.0, texture: 'mercury.jpg', color: '#c8b5a2', distance: '57.9 million km', diameter: '4,879 km', day: '4,222.6 h', temperature: '167 C', summary: 'The smallest planet and the closest to the Sun. Its cratered surface sits beneath an extremely thin exosphere.', factUrl: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/' },
    { name: 'Venus', category: 'Terrestrial planet', sceneRadius: 0.94, sceneDistance: 16, orbitDays: 224.7, texture: 'venus.jpg', atmosphereTexture: 'venus_atmosphere.jpg', color: '#e6bc72', distance: '108.2 million km', diameter: '12,104 km', day: '2,802.0 h', temperature: '464 C', summary: 'A rocky world with a dense carbon-dioxide atmosphere. Its greenhouse effect makes Venus the hottest planet.', factUrl: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/' },
    { name: 'Earth', category: 'Terrestrial planet', sceneRadius: 1.02, sceneDistance: 22, orbitDays: 365.2, texture: 'earth.jpg', cloudsTexture: 'earth_clouds.jpg', color: '#70b7ff', distance: '149.6 million km', diameter: '12,756 km', day: '24.0 h', temperature: '15 C', summary: 'Our ocean world is the third planet from the Sun and the only place known to host life.', factUrl: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/' },
    { name: 'Mars', category: 'Terrestrial planet', sceneRadius: 0.75, sceneDistance: 28, orbitDays: 687.0, texture: 'mars.jpg', color: '#ec7651', distance: '228.0 million km', diameter: '6,792 km', day: '24.7 h', temperature: '-65 C', summary: 'The Red Planet has polar ice caps, giant volcanoes, and the largest canyon system in the Solar System.', factUrl: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/' },
    { name: 'Jupiter', category: 'Gas giant', sceneRadius: 3.25, sceneDistance: 43, orbitDays: 4331, texture: 'jupiter.jpg', color: '#d8a46d', distance: '778.5 million km', diameter: '142,984 km', day: '9.9 h', temperature: '-110 C', summary: 'The largest planet is a gas giant with cloud bands and the Great Red Spot, a long-lived storm.', factUrl: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/' },
    { name: 'Saturn', category: 'Gas giant', sceneRadius: 2.72, sceneDistance: 62, orbitDays: 10747, texture: 'saturn.jpg', ringsTexture: 'saturn_rings.jpg', color: '#ead6b8', distance: '1,432.0 million km', diameter: '120,536 km', day: '10.7 h', temperature: '-140 C', summary: 'Saturn is the second-largest planet. Its bright rings are made largely of water-ice particles.', factUrl: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/' },
    { name: 'Uranus', category: 'Ice giant', sceneRadius: 2.08, sceneDistance: 82, orbitDays: 30589, texture: 'uranus.jpg', color: '#a7e8eb', distance: '2,867.0 million km', diameter: '51,118 km', day: '17.2 h', temperature: '-195 C', summary: 'An ice giant that rotates with an extreme tilt. Its methane-rich atmosphere gives it a blue-green appearance.', factUrl: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/' },
    { name: 'Neptune', category: 'Ice giant', sceneRadius: 2.02, sceneDistance: 103, orbitDays: 59800, texture: 'neptune.jpg', color: '#5c8dff', distance: '4,515.0 million km', diameter: '49,528 km', day: '16.1 h', temperature: '-200 C', summary: 'The most distant planet is an ice giant with dark storms and the fastest winds measured in the Solar System.', factUrl: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/' }
];
const MOON = {
    name: 'Moon', category: 'Natural satellite', color: '#e9edf5',
    summary: 'Earth\'s only natural satellite. It is locked so that the same hemisphere faces Earth as it orbits.',
    facts: [['Orbits', 'Earth'], ['Diameter', '3,475 km'], ['Orbit', '27.3 days'], ['Day', '708.7 h']],
    factUrl: 'https://science.nasa.gov/moon/'
};

function createOrbit(distance, color) {
    const points = [];
    for (let index = 0; index <= 192; index += 1) {
        const angle = (index / 192) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(angle) * distance, 0, Math.sin(angle) * distance));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    scene.add(new THREE.Line(geometry, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.3 })));
}

const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffe071 });
sunMaterial.map = loadTexture('sun.jpg', () => { sunMaterial.map = null; sunMaterial.needsUpdate = true; });
const sun = new THREE.Mesh(new THREE.SphereGeometry(5.25, 64, 64), sunMaterial);
sun.name = SUN.name;
sun.userData.record = SUN;
scene.add(sun);
const sunGlow = new THREE.Mesh(
    new THREE.SphereGeometry(6.2, 48, 48),
    new THREE.MeshBasicMaterial({ color: 0xffbd5e, transparent: true, opacity: 0.14, blending: THREE.AdditiveBlending, side: THREE.BackSide })
);
scene.add(sunGlow);

const selectableMeshes = [sun];
const bodiesByName = new Map([[SUN.name, sun]]);
const planetMeshes = [];
PLANETS.forEach((planet, index) => {
    createOrbit(planet.sceneDistance, planet.color);
    const material = new THREE.MeshStandardMaterial({ color: new THREE.Color(planet.color), metalness: 0, roughness: 0.9 });
    material.map = loadTexture(planet.texture, () => { material.map = null; material.needsUpdate = true; });
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(planet.sceneRadius, 64, 64), material);
    mesh.name = planet.name;
    mesh.userData = { record: planet, orbitOffset: index * 0.74, spinRate: 0.25 + index * 0.025 };
    scene.add(mesh);
    selectableMeshes.push(mesh);
    bodiesByName.set(planet.name, mesh);
    planetMeshes.push(mesh);
    if (planet.cloudsTexture) {
        const cloudMaterial = new THREE.MeshStandardMaterial({ transparent: true, opacity: 0.58, depthWrite: false, roughness: 1 });
        cloudMaterial.map = loadTexture(planet.cloudsTexture, () => { cloudMaterial.map = null; cloudMaterial.needsUpdate = true; });
        const clouds = new THREE.Mesh(new THREE.SphereGeometry(planet.sceneRadius + 0.036, 64, 64), cloudMaterial);
        mesh.add(clouds);
        mesh.userData.clouds = clouds;
    }
    if (planet.atmosphereTexture) {
        const atmosphereMaterial = new THREE.MeshStandardMaterial({ transparent: true, opacity: 0.24, depthWrite: false, roughness: 1 });
        atmosphereMaterial.map = loadTexture(planet.atmosphereTexture, () => { atmosphereMaterial.map = null; atmosphereMaterial.needsUpdate = true; });
        const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(planet.sceneRadius + 0.06, 64, 64), atmosphereMaterial);
        mesh.add(atmosphere);
        mesh.userData.atmosphere = atmosphere;
    }
    if (planet.ringsTexture) {
        const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.86 });
        ringMaterial.map = loadTexture(planet.ringsTexture, () => { ringMaterial.map = null; ringMaterial.color.set(0xd5b782); ringMaterial.needsUpdate = true; });
        const rings = new THREE.Mesh(new THREE.RingGeometry(planet.sceneRadius * 1.4, planet.sceneRadius * 2.24, 96), ringMaterial);
        rings.rotation.x = Math.PI / 2.45;
        mesh.add(rings);
    }
});

const earthMesh = bodiesByName.get('Earth');
const moonMaterial = new THREE.MeshStandardMaterial({ color: 0xe9edf5, roughness: 1 });
moonMaterial.map = loadTexture('moon.jpg', () => { moonMaterial.map = null; moonMaterial.needsUpdate = true; });
const moon = new THREE.Mesh(new THREE.SphereGeometry(0.28, 40, 40), moonMaterial);
moon.name = MOON.name;
moon.userData.record = MOON;
earthMesh.add(moon);
selectableMeshes.push(moon);
bodiesByName.set(MOON.name, moon);

function renderRail() {
    [SUN, ...PLANETS, MOON].forEach(record => {
        const item = document.createElement('li');
        const button = document.createElement('button');
        button.className = 'body-button';
        button.type = 'button';
        button.dataset.body = record.name;
        button.innerHTML = `<span class="body-dot" style="--body-color: ${record.color}"></span><span>${record.name}</span>`;
        button.addEventListener('click', () => focusBody(bodiesByName.get(record.name)));
        item.appendChild(button);
        bodyRailList.appendChild(item);
    });
}

function factsFor(record) {
    if (record.facts) return record.facts;
    return [['Solar distance', record.distance], ['Diameter', record.diameter], ['Year', `${record.orbitDays.toLocaleString()} days`], ['Day', record.day], ['Mean temp.', record.temperature], ['Class', record.category]];
}
function renderInfo(record) {
    const facts = factsFor(record).map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join('');
    const sourceLink = record.factUrl ? `<a href="${record.factUrl}" target="_blank" rel="noreferrer">NASA source</a>` : '<a href="SOURCE_NOTES.md" target="_blank">Source notes</a>';
    infoCard.innerHTML = `<p class="eyebrow">Selected body</p><div class="card-heading"><h2>${record.name}</h2><span class="body-type">${record.category}</span></div><p class="summary">${record.summary}</p><dl class="fact-grid">${facts}</dl><p class="source-note">Physical values: ${sourceLink}. The 3D display uses a compressed, non-linear scale for exploration.</p>`;
}
function setActiveBody(name) {
    bodyRailList.querySelectorAll('.body-button').forEach(button => { button.setAttribute('aria-current', String(button.dataset.body === name)); });
}

function focusTargetFor(body) {
    const target = new THREE.Vector3();
    body.getWorldPosition(target);
    if (window.innerWidth <= 640) target.y -= 1.25;
    return target;
}

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let pointerStart = null;
function selectableAncestor(object) {
    let candidate = object;
    while (candidate) {
        if (candidate.userData && candidate.userData.record) return candidate;
        candidate = candidate.parent;
    }
    return null;
}
renderer.domElement.addEventListener('pointerdown', event => { pointerStart = { x: event.clientX, y: event.clientY }; });
renderer.domElement.addEventListener('pointerup', event => {
    if (!pointerStart || Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y) > 7) return;
    const bounds = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(selectableMeshes, true)[0];
    const body = hit && selectableAncestor(hit.object);
    if (body) focusBody(body);
});

let activeBody = sun;
let isPaused = false;
let orbitalRate = Number(speedSlider.value);
let transition = null;
let elapsedSeconds = 0;
const clock = new THREE.Clock();
function focusBody(body) {
    if (!body) return;
    activeBody = body;
    const record = body.userData.record;
    const position = focusTargetFor(body);
    const scale = body.geometry && body.geometry.parameters ? body.geometry.parameters.radius : 1;
    const distance = body === sun ? 17 : Math.max(5.7, Math.min(24, scale * 5.8 + 3.5));
    const direction = camera.position.clone().sub(controls.target).normalize();
    transition = { elapsed: 0, fromPosition: camera.position.clone(), fromTarget: controls.target.clone(), toPosition: position.clone().add(direction.multiplyScalar(distance)), toTarget: position.clone() };
    renderInfo(record);
    setActiveBody(record.name);
}
function resetView() {
    activeBody = null;
    transition = { elapsed: 0, fromPosition: camera.position.clone(), fromTarget: controls.target.clone(), toPosition: HOME_POSITION.clone(), toTarget: HOME_TARGET.clone() };
    renderInfo(SUN);
    setActiveBody('Sun');
}
function updateSpeed() {
    orbitalRate = Number(speedSlider.value);
    speedValue.value = `${orbitalRate.toFixed(2)}x`;
    speedValue.textContent = speedValue.value;
}
speedSlider.addEventListener('input', updateSpeed);
pauseButton.addEventListener('click', () => {
    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? 'Resume' : 'Pause';
    pauseButton.setAttribute('aria-pressed', String(isPaused));
    pauseButton.title = isPaused ? 'Resume planetary motion' : 'Pause planetary motion';
});
document.getElementById('home-view').addEventListener('click', resetView);
function updateTransition(delta) {
    if (!transition) return;
    transition.elapsed = Math.min(1, transition.elapsed + delta / 0.9);
    const eased = 1 - Math.pow(1 - transition.elapsed, 3);
    camera.position.lerpVectors(transition.fromPosition, transition.toPosition, eased);
    controls.target.lerpVectors(transition.fromTarget, transition.toTarget, eased);
    if (transition.elapsed === 1) transition = null;
}
function updateBodies(delta) {
    if (!isPaused) elapsedSeconds += delta * orbitalRate;
    planetMeshes.forEach(mesh => {
        const record = mesh.userData.record;
        const cycleSeconds = 7.5 + (record.orbitDays / 59800) * 90;
        const angle = elapsedSeconds / cycleSeconds * Math.PI * 2 + mesh.userData.orbitOffset;
        mesh.position.set(Math.cos(angle) * record.sceneDistance, 0, Math.sin(angle) * record.sceneDistance);
        mesh.rotation.y += delta * mesh.userData.spinRate * Math.max(orbitalRate, 0.15);
        if (mesh.userData.clouds) mesh.userData.clouds.rotation.y += delta * 0.14 * Math.max(orbitalRate, 0.15);
        if (mesh.userData.atmosphere) mesh.userData.atmosphere.rotation.y += delta * 0.06 * Math.max(orbitalRate, 0.15);
    });
    const moonAngle = elapsedSeconds * 1.8;
    moon.position.set(Math.cos(moonAngle) * 2.05, 0.13, Math.sin(moonAngle) * 2.05);
    moon.rotation.y += delta * 0.3;
    sun.rotation.y += delta * 0.055;
    sunGlow.scale.setScalar(1 + Math.sin(elapsedSeconds * 1.8) * 0.025);
    if (activeBody && !transition) {
        const trackedPosition = focusTargetFor(activeBody);
        const offset = camera.position.clone().sub(controls.target);
        // Keep the selected body centered even while its orbit is moving.
        controls.target.copy(trackedPosition);
        camera.position.copy(controls.target).add(offset);
    }
}
function updateForViewport() {
    const isMobile = window.innerWidth <= 640;
    controls.rotateSpeed = isMobile ? 0.5 : 0.65;
    controls.zoomSpeed = isMobile ? 0.62 : 0.85;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', updateForViewport);
function animate() {
    requestAnimationFrame(animate);
    const delta = Math.min(clock.getDelta(), 0.05);
    updateBodies(delta);
    updateTransition(delta);
    controls.update();
    renderer.render(scene, camera);
}
renderRail();
renderInfo(SUN);
setActiveBody('Sun');
updateSpeed();
updateForViewport();
animate();
