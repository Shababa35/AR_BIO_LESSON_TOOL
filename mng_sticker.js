import { GLTFLoader } from './applications/libs/three.js-r132/examples/jsm/loaders/GLTFLoader.js';

const THREE = window.MINDAR?.IMAGE?.THREE; // Check if IMAGE is defined

if (!THREE) {
    console.error('MINDAR.IMAGE.THREE is undefined. Check if MindAR is properly included.');
} else {
    document.addEventListener('DOMContentLoaded', () => {
        const start = async () => {
            try {
                const mindarThree = new window.MINDAR.IMAGE.MindARThree({
                    container: document.body,
                    imageTargetSrc: './applications/assets/targets/LOGO.mind',
                    uiScanning: "#scanning",
                    uiLoading: "no"
                });

                const { renderer, scene, camera } = mindarThree;

                // Add lighting to the scene
                const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
                scene.add(light);

                // Add an anchor for the target
                const anchor = mindarThree.addAnchor(0);

                // Load the GLTF model
                const loader = new GLTFLoader();
                loader.load(
                    './applications/assets/models/robot_playground/scene.gltf',
                    (gltf) => {
                        // Set model position and scale
                        gltf.scene.scale.set(0.5, 0.5, 0.5);
                        gltf.scene.position.set(0, -0.4, 0);

                        // Add model to the anchor group
                        anchor.group.add(gltf.scene);

                        // Handle animations if available
                        if (gltf.animations && gltf.animations.length > 0) {
                            const mixer = new THREE.AnimationMixer(gltf.scene);
                            const action = mixer.clipAction(gltf.animations[0]);
                            action.play();

                            // Use clock to update animations
                            const clock = new THREE.Clock();
                            renderer.setAnimationLoop(() => {
                                const delta = clock.getDelta();
                                mixer.update(delta);
                                renderer.render(scene, camera);
                            });
                        } else {
                            console.warn('No animations found in the GLTF model.');
                        }
                    },
                    undefined,
                    (error) => {
                        console.error('An error occurred while loading the GLTF model:', error);
                    }
                );

                await mindarThree.start(); // Start MindAR
            } catch (error) {
                console.error('An error occurred while initializing MindAR:', error);
            }
        };

        start();
    });
}
