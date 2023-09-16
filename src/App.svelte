<script lang="ts">
  import * as THREE from "three";
  import { MapControls } from "three/addons/controls/MapControls.js";

  interface Dimensions {
    width: number;
    height: number;
    depth: number;
  }

  // Data

  let zoom = 5;
  let rotation = {
    x: 0.3,
    y: 0.6,
    z: -Math.PI,
  };
  let containerDimensions: Dimensions = {
    width: 3,
    height: 1,
    depth: 2,
  };
  let itemDimensions: Dimensions = {
    width: 0.8,
    height: 1.5,
    depth: 1,
  };

  // Scene

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const containerBox = new THREE.LineSegments();
  containerBox.material = new THREE.LineBasicMaterial({ color: 0x00ff00 });

  const itemBox = new THREE.LineSegments();
  itemBox.material = new THREE.LineBasicMaterial({ color: 0xff0000 });

  const group = new THREE.Group();
  group.add(containerBox);
  group.add(itemBox);

  scene.add(group);

  const controls = new MapControls(camera, renderer.domElement);
  controls.enableDamping = true;

  $: {
    camera.position.z = zoom;
    group.rotation.x = rotation.x;
    group.rotation.y = rotation.y;
    group.rotation.z = rotation.z;

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
      containerDimensions.width / -2,
      containerDimensions.height / -2,
      containerDimensions.depth / -2
    );

    itemBox.position.set(
      itemDimensions.width / -2,
      itemDimensions.height / -2,
      itemDimensions.depth / -2
    );
  }

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  });
</script>

<main>
  <form class="params">
    <fieldset>
      <legend>Camera</legend>
      <label>
        Zoom
        <input bind:value={zoom} type="range" min="1.5" max="50" step="0.1" />
      </label>
      <label>
        Rotation x:
        <input
          bind:value={rotation.x}
          type="range"
          min={-Math.PI}
          max={Math.PI}
          step="0.01"
        />
      </label>
      <label>
        Rotation y:
        <input
          bind:value={rotation.y}
          type="range"
          min={-Math.PI}
          max={Math.PI}
          step="0.01"
        />
      </label>
      <label>
        Rotation z:
        <input
          bind:value={rotation.z}
          type="range"
          min={-Math.PI}
          max={Math.PI}
          step="0.01"
        />
      </label>
    </fieldset>
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
