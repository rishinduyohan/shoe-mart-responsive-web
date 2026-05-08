(function () {
    'use strict';

    const container = document.getElementById('shoe-canvas-container');
    if (!container) return;

    let scene, camera, renderer, shoeModel;
    let mouseX = 0, mouseY = 0;
    let targetRotationX = 0, targetRotationY = 0;

    const MODEL_PATH = 'assets/images/3D/a9a7dac7-19ce-4b3e-abaf-d7dbb6e6e289(1).glb';

    function init() {
        // Scene setup
        scene = new THREE.Scene();

        // Camera setup
        const aspect = container.clientWidth / container.clientHeight;
        camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
        camera.position.z = 4;

        // Renderer setup
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.outputEncoding = THREE.sRGBEncoding;
        container.appendChild(renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
        hemiLight.position.set(0, 20, 0);
        scene.add(hemiLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
        directionalLight.position.set(5, 10, 7.5);
        directionalLight.castShadow = true;
        scene.add(directionalLight);

        const pointLight = new THREE.PointLight(0xffffff, 0.5);
        pointLight.position.set(-5, -5, -5);
        scene.add(pointLight);

        // Load Model
        const loader = new THREE.GLTFLoader();
        loader.load(MODEL_PATH, (gltf) => {
            shoeModel = gltf.scene;
            
            const box = new THREE.Box3().setFromObject(shoeModel);
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 2.8 / maxDim; // Adjust scale to fit column
            shoeModel.scale.set(scale, scale, scale);

            const center = box.getCenter(new THREE.Vector3());
            shoeModel.position.x = -center.x * scale;
            shoeModel.position.y = -center.y * scale;
            shoeModel.position.z = -center.z * scale;

            // Group for rotation
            const group = new THREE.Group();
            group.add(shoeModel);
            
            // Mobile specific scaling/positioning in scene
            if (window.innerWidth < 768) {
                group.scale.set(0.85, 0.85, 0.85);
            }
            
            scene.add(group);
            shoeModel = group;

            // Initial rotation
            shoeModel.rotation.y = Math.PI / 4;
            
            // Entry animation
            shoeModel.scale.set(0, 0, 0);
            animateEntry();
        }, undefined, (error) => {
            console.error('Error loading 3D model:', error);
            container.innerHTML = '<p style="color: white; text-align: center; padding-top: 50px;">Failed to load 3D model.</p>';
        });

        window.addEventListener('resize', onWindowResize);
        document.addEventListener('mousemove', onMouseMove);
    }

    function onWindowResize() {
        const aspect = container.clientWidth / container.clientHeight;
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }

    function onMouseMove(event) {
        // Normalize mouse coordinates for the container area specifically if needed, 
        // but global tracking works fine for hero parallax
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = (event.clientY / window.innerHeight) * 2 - 1;
    }

    function animateEntry() {
        let progress = 0;
        const duration = 60;
        function step() {
            if (progress < 1) {
                progress += 1 / duration;
                const ease = 1 - Math.pow(1 - progress, 3);
                shoeModel.scale.set(ease, ease, ease);
                shoeModel.rotation.y = (Math.PI / 4) + (1 - ease) * 0.5;
                requestAnimationFrame(step);
            }
        }
        step();
    }

    function animate() {
        requestAnimationFrame(animate);

        if (shoeModel) {
            targetRotationY = mouseX * 0.3;
            targetRotationX = mouseY * 0.2;

            shoeModel.rotation.y += (targetRotationY + Math.PI / 4 - shoeModel.rotation.y) * 0.05;
            shoeModel.rotation.x += (targetRotationX - shoeModel.rotation.x) * 0.05;

            // Subtle floating
            shoeModel.position.y = Math.sin(Date.now() * 0.0015) * 0.12;
        }

        renderer.render(scene, camera);
    }

    init();
    animate();

})();
