<script lang="ts">
  import * as THREE from "three";
  import { OrbitControls } from "three/addons/controls/OrbitControls.js";

  interface Dim {
    width: number;
    height: number;
    depth: number;
  }

  type DimTuple = [x: number, y: number, z: number];

  // Data

  let containerDimensions: Dim = {
    width: 120,
    height: 60,
    depth: 40,
  };
  let itemDimensions: Dim = {
    width: 20,
    height: 50,
    depth: 30,
  };
  let repeat = true;
  $: fit = {
    width: containerDimensions.width / itemDimensions.width,
    height: containerDimensions.height / itemDimensions.height,
    depth: containerDimensions.depth / itemDimensions.depth,
  };
  $: totalFit = Object.values(fit)
    .filter(Number.isFinite)
    .map(Math.floor)
    .reduce((a, b) => a * b, 1);

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
      new THREE.BoxGeometry(...Object.values(containerDimensions))
    );
    const containerBox = new THREE.LineSegments(
      containerBoxGeometry,
      containerBoxMaterial
    );
    containerBox.position.set(
      ...(Object.values(containerDimensions).map((dim) => dim / 2) as DimTuple)
    );
    group.add(containerBox);
    objects.push(containerBox);

    // Items
    const itemBoxGeometry = new THREE.EdgesGeometry(
      new THREE.BoxGeometry(...Object.values(itemDimensions))
    );

    const repeatLimit = repeat ? 100 : 1;

    if (Object.values(fit).every((n) => Number.isFinite(n))) {
      for (let x = 0; x < Math.floor(fit.width) && x < repeatLimit; x++) {
        for (let y = 0; y < Math.floor(fit.height) && y < repeatLimit; y++) {
          for (let z = 0; z < Math.floor(fit.depth) && z < repeatLimit; z++) {
            const itemBox = new THREE.LineSegments(
              itemBoxGeometry,
              x === 0 && y === 0 && z === 0
                ? itemBoxMaterial
                : repeatedItemBoxMaterial
            );
            itemBox.position.set(
              itemDimensions.width / 2 + x * itemDimensions.width,
              itemDimensions.height / 2 + y * itemDimensions.height,
              itemDimensions.depth / 2 + z * itemDimensions.depth
            );
            itemBox.computeLineDistances();
            group.add(itemBox);
            objects.push(itemBox);
          }
        }
      }

      group.position.set(
        containerDimensions.width / -2,
        containerDimensions.height / -2,
        containerDimensions.depth / -2
      );
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
        <dt>Total:</dt>
        <dd>{totalFit}</dd>
      </dl>
    </div>
    <div>
      <label>
        <input type="checkbox" bind:checked={repeat} />
        Repeat
      </label>
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

  dl {
    display: grid;
    grid-template-columns: auto auto;
  }
</style>
