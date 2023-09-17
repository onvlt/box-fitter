<script lang="ts">
  import * as THREE from "three";
  import { OrbitControls } from "three/addons/controls/OrbitControls.js";
  import {
    containerDimensions,
    itemDimensions,
    fit,
    repeatBoxes,
  } from "./store";
  import type { DimTuple } from "./types";
  import Params from "./Params.svelte";

  // Scene, camera, controls, renderer setup

  const SIDEBAR_OFFSET = 380;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera();
  camera.fov = 75;
  camera.near = 0.1;
  camera.far = 1000;
  camera.position.z = 100;

  const renderer = new THREE.WebGLRenderer();
  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.maxPolarAngle = Math.PI / 2;

  function onResize() {
    const width = window.innerWidth - SIDEBAR_OFFSET;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  onResize();
  window.addEventListener("resize", onResize);

  // Build shapes

  const containerBoxMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
  const itemBoxMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });

  const repeatedItemBoxMaterial = new THREE.LineDashedMaterial({
    color: 0x990000,
    dashSize: 1,
    gapSize: 2,
    opacity: 50,
  });

  const group = new THREE.Group();
  scene.add(group);

  let objects: Array<THREE.Object3D> = [];

  // Build shapes initially and rebuild them when input changes
  $: {
    for (const object of objects) {
      group.remove(object);
      objects = [];
    }

    // Container
    const containerBoxGeometry = new THREE.EdgesGeometry(
      new THREE.BoxGeometry(...Object.values($containerDimensions))
    );
    const containerBox = new THREE.LineSegments(
      containerBoxGeometry,
      containerBoxMaterial
    );
    containerBox.position.set(
      ...(Object.values($containerDimensions).map((dim) => dim / 2) as DimTuple)
    );
    group.add(containerBox);
    objects.push(containerBox);

    // Items
    const itemBoxGeometry = new THREE.EdgesGeometry(
      new THREE.BoxGeometry(...Object.values($itemDimensions))
    );

    const firstItemBox = new THREE.LineSegments(
      itemBoxGeometry,
      itemBoxMaterial
    );
    firstItemBox.position.set(
      $itemDimensions.width / 2,
      $itemDimensions.height / 2,
      $itemDimensions.depth / 2
    );
    group.add(firstItemBox);
    objects.push(firstItemBox);

    const repeatLimit = $repeatBoxes ? 100 : 1;

    if (Object.values($fit).every((n) => Number.isFinite(n))) {
      for (let x = 0; x < Math.floor($fit.width) && x < repeatLimit; x++) {
        for (let y = 0; y < Math.floor($fit.height) && y < repeatLimit; y++) {
          for (let z = 0; z < Math.floor($fit.depth) && z < repeatLimit; z++) {
            if (x === 0 && y === 0 && z == 0) {
              continue;
            }
            const itemBox = new THREE.LineSegments(
              itemBoxGeometry,
              repeatedItemBoxMaterial
            );
            itemBox.position.set(
              firstItemBox.position.x + x * $itemDimensions.width,
              firstItemBox.position.y + y * $itemDimensions.height,
              firstItemBox.position.z + z * $itemDimensions.depth
            );
            itemBox.computeLineDistances();
            group.add(itemBox);
            objects.push(itemBox);
          }
        }
      }

      group.position.set(
        $containerDimensions.width / -2,
        $containerDimensions.height / -2,
        $containerDimensions.depth / -2
      );
    }
  }

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  animate();
</script>

<main style="--sidebar-size: {SIDEBAR_OFFSET}px">
  <Params />
</main>
