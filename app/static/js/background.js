// Three.js Background Animation
let scene, camera, renderer, particles;

function initBackground() {
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ 
        canvas: document.getElementById('background'),
        alpha: true 
    });
    
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.z = 30;

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 50;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.1,
        color: '#4F46E5',
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    // Rotate particles
    particles.rotation.x += 0.0003;
    particles.rotation.y += 0.0005;

    // Mouse interaction
    if (window.mouseX) {
        particles.rotation.x += window.mouseX * 0.00001;
        particles.rotation.y += window.mouseY * 0.00001;
    }

    renderer.render(scene, camera);
}

// Mouse movement tracking
document.addEventListener('mousemove', (event) => {
    window.mouseX = event.clientX - window.innerWidth / 2;
    window.mouseY = event.clientY - window.innerHeight / 2;
});

// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    initBackground();
    animate();
});
