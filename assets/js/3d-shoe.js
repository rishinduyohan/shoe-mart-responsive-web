(function () {
    'use strict';

    const container = document.getElementById('shoe-canvas-container');
    if (!container) return;

    let scene, camera, renderer, shoeModel, shadowPlane;
    let mouseX = 0, mouseY = 0;
    let targetRotationX = 0, targetRotationY = 0;

    const MODEL_PATH = 'assets/images/3D/a9a7dac7-19ce-4b3e-abaf-d7dbb6e6e289(1).glb';

    function init() {
        scene = new THREE.Scene();

        const aspect = container.clientWidth / container.clientHeight;
        camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
        updateCamera();

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.outputEncoding = THREE.sRGBEncoding;
        container.appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
        hemiLight.position.set(0, 20, 0);
        scene.add(hemiLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
        directionalLight.position.set(5, 10, 7.5);
        scene.add(directionalLight);

        const shadowCanvas = document.createElement('canvas');
        shadowCanvas.width = 128;
        shadowCanvas.height = 128;
        const context = shadowCanvas.getContext('2d');
        const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
        gradient.addColorStop(0.1, 'rgba(0,0,0,0.6)');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        context.fillStyle = gradient;
        context.fillRect(0, 0, 128, 128);

        const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
        const shadowGeo = new THREE.PlaneGeometry(2, 2);
        const shadowMat = new THREE.MeshBasicMaterial({
            map: shadowTexture,
            transparent: true,
            depthWrite: false
        });
        shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
        shadowPlane.rotation.x = -Math.PI / 2;
        shadowPlane.position.y = -1.2;
        scene.add(shadowPlane);

        const loader = new THREE.GLTFLoader();
        loader.load(MODEL_PATH, (gltf) => {
            shoeModel = gltf.scene;
            
            const box = new THREE.Box3().setFromObject(shoeModel);
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 2.8 / maxDim;
            shoeModel.scale.set(scale, scale, scale);

            const center = box.getCenter(new THREE.Vector3());
            shoeModel.position.x = -center.x * scale;
            shoeModel.position.y = -center.y * scale;
            shoeModel.position.z = -center.z * scale;

            const group = new THREE.Group();
            group.add(shoeModel);
            
            scene.add(group);
            shoeModel = group;
            shoeModel.rotation.y = Math.PI / 4;
            shoeModel.scale.set(0, 0, 0);
            animateEntry();
        }, undefined, (error) => {
            console.error('Error loading 3D model:', error);
            container.innerHTML = '<p style="color: white; text-align: center; padding-top: 50px;">Failed to load 3D model.</p>';
        });

        window.addEventListener('resize', onWindowResize);
        document.addEventListener('mousemove', onMouseMove);
    }

    function updateCamera() {
        const width = window.innerWidth;
        const aspect = container.clientWidth / container.clientHeight;
        camera.aspect = aspect;
        if (width < 576) {
            camera.position.z = 4.2;
            camera.fov = 55;
        } else if (width < 992) {
            camera.position.z = 4.5;
            camera.fov = 50;
        } else {
            camera.position.z = 4;
            camera.fov = 45;
        }
        camera.updateProjectionMatrix();
    }

    function onWindowResize() {
        updateCamera();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }

    function onMouseMove(event) {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = (event.clientY / window.innerHeight) * 2 - 1;
    }

    function animateEntry() {
        let progress = 0;
        const duration = 60;
        const width = window.innerWidth;
        const targetScale = width < 576 ? 1.0 : (width < 992 ? 1.2 : 1.0);
        function step() {
            if (progress < 1) {
                progress += 1 / duration;
                const ease = 1 - Math.pow(1 - progress, 3);
                shoeModel.scale.set(ease * targetScale, ease * targetScale, ease * targetScale);
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

            const floatY = Math.sin(Date.now() * 0.0015) * 0.12;
            shoeModel.position.y = floatY;

            if (shadowPlane) {
                const shadowIntensity = 1 - (floatY + 0.12) / 0.5;
                shadowPlane.material.opacity = Math.max(0.1, shadowIntensity * 0.4);
                const s = 1 + floatY * 0.5;
                shadowPlane.scale.set(s, s, s);
            }
        }

        renderer.render(scene, camera);
    }

    init();
    animate();

})();
