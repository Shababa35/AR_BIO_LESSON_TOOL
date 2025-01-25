import { GLTFLoader } from './applications/libs/three.js-r132/examples/jsm/loaders/GLTFLoader.js';

const THREE = window.MINDAR?.IMAGE?.THREE; // Check if IMAGE is defined

if (!THREE) {
    console.error('MINDAR.IMAGE.THREE is undefined. Check if MindAR is properly included.');
} else {
    document.addEventListener('DOMContentLoaded', () => {
        const start = async () => {
            const mindarThree = new window.MINDAR.IMAGE.MindARThree({
                container: document.body,
                imageTargetSrc: './applications/assets/targets/LOGO.mind',
            });

            const { renderer, scene, camera } = mindarThree;
            const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
            scene.add(light);

            const anchor = mindarThree.addAnchor(0);

            const loader = new GLTFLoader();
            let loadedModel = null;

            loader.load('./applications/assets/models/nacl/scene.gltf', (gltf) => {
                // Adjusting the scale (increase size)
                gltf.scene.scale.set(0.3, 0.3, 0.3); // Set a larger size for the robot
                
                // Adjusting the position
                gltf.scene.position.set(0, -0.3, 0); // Position the robot slightly above the image target
                
                // Optional: Adjusting the rotation (if needed)
                gltf.scene.rotation.set(0, 0, 0); // Initial rotation
                
                // Add the model to the anchor
                anchor.group.add(gltf.scene);

                // Save a reference to the loaded model for rotation
                loadedModel = gltf.scene;
            });

            await mindarThree.start();
            renderer.setAnimationLoop(() => {
                // Rotate the model if it is loaded
                if (loadedModel) {
                    loadedModel.rotation.y += 0.03; // Adjust rotation speed here
                }

                renderer.render(scene, camera);
            });
        };

        start();
    });
}
