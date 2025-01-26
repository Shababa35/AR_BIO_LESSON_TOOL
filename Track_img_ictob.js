import { loadGLTF } from './applications/libs/loader.js';

const THREE = window.MINDAR?.IMAGE?.THREE; // Check if IMAGE is defined

document.addEventListener('DOMContentLoaded', () => {
        const start = async () => {
            const mindarThree = new window.MINDAR.IMAGE.MindARThree({
                container: document.body,
                imageTargetSrc: './applications/assets/targets/ICT_demo.mind',
            });

            const { renderer, scene, camera } = mindarThree;
            const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
            scene.add(light);
             
            const robo = await loadGLTF("./applications/assets/models/robot_playground/scene.gltf");
            robo.scene.scale.set(1, 1, 1);
            robo.scene.position.set(0, -0.4, 0);
            robo.scene.rotation.set(0, Math.PI /2, 0);

            const dugu = await loadGLTF("./applications/assets/models/doggy_meme_dog_ps1/scene.gltf");
            dugu.scene.scale.set(1, 1, 1);
            dugu.scene.position.set(0, -0.4, 0);
            dugu.scene.rotation.set(0, Math.PI /-5, 0);

            const roboAnchor = mindarThree.addAnchor (0);
            roboAnchor.group.add(robo.scene);

            const duguAnchor = mindarThree.addAnchor (1);
            duguAnchor.group.add(dugu.scene);

            await mindarThree.start();
            renderer.setAnimationLoop(() => {
                renderer.render(scene, camera);
            });
        };

        start();
    });

