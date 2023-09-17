<script lang="ts">
  import * as THREE from "three";
  import { OrbitControls } from "three/addons/controls/OrbitControls.js";

  interface Dimensions {
    width: number;
    height: number;
    depth: number;
  }

  // Data

  let containerDimensions: Dimensions = {
    width: 120,
    height: 60,
    depth: 40,
  };
  let itemDimensions: Dimensions = {
    width: 20,
    height: 50,
    depth: 30,
  };
  $: fit = {
    width: containerDimensions.width / itemDimensions.width,
    height: containerDimensions.height / itemDimensions.height,
    depth: containerDimensions.depth / itemDimensions.depth,
  };

  // Scene, camera, controls, renderer setup

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 100;

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.maxPolarAngle = Math.PI / 2;

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Build shapes

  const containerBox = new THREE.LineSegments();
  containerBox.material = new THREE.LineBasicMaterial({ color: 0x00ff00 });

  const itemBox = new THREE.LineSegments();
  itemBox.material = new THREE.LineBasicMaterial({ color: 0xff0000 });

  const repeatedItemBoxMaterial = new THREE.LineDashedMaterial({
    color: 0x990000,
    dashSize: 1,
    gapSize: 2,
    opacity: 50,
  });

  let repeatedBoxes: Array<THREE.Object3D> = [];

  const group = new THREE.Group();
  group.add(containerBox);
  group.add(itemBox);

  scene.add(group);

  $: {
    const containerBoxGeometry = new THREE.EdgesGeometry(
      new THREE.BoxGeometry(
        containerDimensions.width,
        containerDimensions.height,
        containerDimensions.depth
      )
    );

    const itemBoxGeometry = new THREE.EdgesGeometry(
      new THREE.BoxGeometry(
        itemDimensions.width,
        itemDimensions.height,
        itemDimensions.depth
      )
    );

    containerBox.geometry.dispose();
    containerBox.geometry = containerBoxGeometry;

    itemBox.geometry.dispose();
    itemBox.geometry = itemBoxGeometry;

    containerBox.position.set(
      containerDimensions.width / 2,
      containerDimensions.height / 2,
      containerDimensions.depth / 2
    );

    itemBox.position.set(
      itemDimensions.width / 2,
      itemDimensions.height / 2,
      itemDimensions.depth / 2
    );

    group.position.set(
      containerDimensions.width / -2,
      containerDimensions.height / -2,
      containerDimensions.depth / -2
    );

    for (const box of repeatedBoxes) {
      group.remove(box);
    }

    const REPEAT_LIMIT = 100;

    if (Object.values(fit).every((n) => Number.isFinite(n))) {
      for (let x = 0; x < Math.floor(fit.width) && x < REPEAT_LIMIT; x++) {
        for (let y = 0; y < Math.floor(fit.height) && y < REPEAT_LIMIT; y++) {
          for (let z = 0; z < Math.floor(fit.depth) && z < REPEAT_LIMIT; z++) {
            const extraBoxItem = new THREE.LineSegments(
              itemBoxGeometry,
              repeatedItemBoxMaterial
            );
            extraBoxItem.position.set(
              itemBox.position.x + x * itemDimensions.width,
              itemBox.position.y + y * itemDimensions.height,
              itemBox.position.z + z * itemDimensions.depth
            );
            extraBoxItem.computeLineDistances();
            repeatedBoxes.push(extraBoxItem);
            group.add(extraBoxItem);
            console.log(x, y, z);
          }
        }
      }
    }
  }

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  animate();

  function displayFit(n: number) {
    if (Number.isFinite(n)) {
      return Math.floor(n);
    }
    return "N/A";
  }
</script>

<main>
  <form class="params">
    <fieldset>
      <legend>Container</legend>
      <label>
        Width: <input
          type="number"
          bind:value={containerDimensions.width}
          min="0"
          step="0.5"
        />
      </label>
      <label>
        Height: <input
          type="number"
          bind:value={containerDimensions.height}
          min="0"
          step="0.5"
        />
      </label>
      <label>
        Depth: <input
          type="number"
          bind:value={containerDimensions.depth}
          min="0"
          step="0.5"
        />
      </label>
    </fieldset>
    <fieldset>
      <legend>Item</legend>
      <label>
        Width: <input
          type="number"
          bind:value={itemDimensions.width}
          min="0"
          step="0.5"
        />
      </label>
      <label>
        Height: <input
          type="number"
          bind:value={itemDimensions.height}
          min="0"
          step="0.5"
        />
      </label>
      <label>
        Depth: <input
          type="number"
          bind:value={itemDimensions.depth}
          min="0"
          step="0.5"
        />
      </label>
    </fieldset>
    <div>
      Fits
      <dl>
        <dt>Width:</dt>
        <dd>{displayFit(fit.width)}</dd>
        <dt>Height:</dt>
        <dd>{displayFit(fit.height)}</dd>
        <dt>Depth:</dt>
        <dd>{displayFit(fit.depth)}</dd>
      </dl>
    </div>
  </form>
</main>

<style>
  .params {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background-color: #222;
    padding: 1rem;
    color: white;
    display: flex;
    gap: 0.5rem;
  }

  fieldset {
    border: 1px solid #999;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1.25rem 1rem 1rem;
  }

  label {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
  }
</style>
