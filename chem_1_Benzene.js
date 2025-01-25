import { GLTFLoader } from './applications/libs/three.js-r132/examples/jsm/loaders/GLTFLoader.js';

const THREE = window.MINDAR?.IMAGE?.THREE;

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

            loader.load(
                './applications/assets/models/chemistry_benzene/scene.gltf',
                (gltf) => {
                    // Create a group to act as the pivot
                    const pivot = new THREE.Group();
                    anchor.group.add(pivot);

                    // Add the model to the pivot
                    const model = gltf.scene;

                    // Calculate the bounding box of the model
                    const box = new THREE.Box3().setFromObject(model);
                    const center = box.getCenter(new THREE.Vector3());

                    // Offset the model so its center aligns with the pivot
                    model.position.set(-center.x, -center.y, -center.z);

                    model.scale.set(2, 2, 2); // Adjust the scale as needed

                    // Add the model to the pivot group
                    pivot.add(model);

                    // Save the pivot reference for rotation
                    loadedModel = pivot;
                },
                undefined,
                (error) => {
                    console.error('Error loading model:', error);
                }
            );

            await mindarThree.start();
            renderer.setAnimationLoop(() => {
                if (loadedModel) {
                    loadedModel.rotation.y += 0.02; // Rotate around its corrected axis
                }
                renderer.render(scene, camera);
            });
        };

        start();
    });
}
