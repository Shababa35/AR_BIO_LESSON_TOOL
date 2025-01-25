import { loadGLTF } from './applications/libs/loader.js';

const THREE = window.MINDAR?.IMAGE?.THREE; // Check if IMAGE is defined

document.addEventListener('DOMContentLoaded', () => {
    const start = async () => {
        const mindarThree = new window.MINDAR.IMAGE.MindARThree({
            container: document.body,
            imageTargetSrc: './applications/assets/targets/Che_targets.mind',
        });

        const { renderer, scene, camera } = mindarThree;
        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        scene.add(light);
        
        // Load 3D models
        const ben = await loadGLTF("./applications/assets/models/chemistry_benzene/scene.gltf");
        ben.scene.scale.set(1, 1, 1);
        ben.scene.position.set(0, -0.4, 0);
        ben.scene.rotation.set(0, Math.PI / 2, 0);

        const nacl = await loadGLTF("./applications/assets/models/Nacl_writing/nacl.gltf");
        nacl.scene.scale.set(0.1, 0.1, 0.1);
        nacl.scene.position.set(0, -0.4, 0);
        nacl.scene.rotation.set(0, Math.PI / -5, 0);

        const h2o = await loadGLTF("./applications/assets/models/h2o_molecule/H2O.gltf");
        h2o.scene.scale.set(0.8, 0.8, 0.8);
        h2o.scene.position.set(0, -0.4, 0);
        h2o.scene.rotation.set(0, Math.PI / -5, 0);

        // Create anchors for each model
        const benAnchor = mindarThree.addAnchor(0);
        const naclAnchor = mindarThree.addAnchor(1);
        const h2oAnchor = mindarThree.addAnchor(2);

        // Create a pivot for each model and ensure they rotate around their own center
        const benPivot = new THREE.Group();
        benAnchor.group.add(benPivot);
        const naclPivot = new THREE.Group();
        naclAnchor.group.add(naclPivot);
        const h2oPivot = new THREE.Group();
        h2oAnchor.group.add(h2oPivot);

        // Add the models to their pivots
        benPivot.add(ben.scene);
        naclPivot.add(nacl.scene);
        h2oPivot.add(h2o.scene);

        // Adjust model position for centering (optional, if needed)
        const benBox = new THREE.Box3().setFromObject(ben.scene);
        const benCenter = benBox.getCenter(new THREE.Vector3());
        ben.scene.position.sub(benCenter);

        const naclBox = new THREE.Box3().setFromObject(nacl.scene);
        const naclCenter = naclBox.getCenter(new THREE.Vector3());
        nacl.scene.position.sub(naclCenter);

        const h2oBox = new THREE.Box3().setFromObject(h2o.scene);
        const h2oCenter = h2oBox.getCenter(new THREE.Vector3());
        h2o.scene.position.sub(h2oCenter);

        // Start MindAR and animation loop
        await mindarThree.start();
        renderer.setAnimationLoop(() => {
            // Rotate models around their respective pivots
            benPivot.rotation.y += 0.02; // Rotate ben around its own axis
            naclPivot.rotation.y += 0.02; // Rotate nacl around its own axis
            h2oPivot.rotation.y += 0.02; // Rotate h2o around its own axis

            // Render the scene
            renderer.render(scene, camera);
        });
    };

    start();
});
