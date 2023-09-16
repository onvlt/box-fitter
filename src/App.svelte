<script lang="ts">
  import * as THREE from "three";

  // Data

  let zoom = 2;
  let rotation = {
    x: 0,
    y: 0,
    z: 0,
  };
  let containerDimensions = {
    width: 3,
    height: 1,
    depth: 2,
  };

  let itemDimensions = {
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

  function makeGeometry(w, h, d) {
    return new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d));
  }

  const material = new THREE.LineBasicMaterial({
    color: 0x00ff00,
  });

  const container = new THREE.LineSegments(
    makeGeometry(
      containerDimensions.width,
      containerDimensions.height,
      containerDimensions.depth
    ),
    material
  );

  scene.add(container);

  $: {
    camera.position.z = zoom;
    container.rotation.x = rotation.x;
    container.rotation.y = rotation.y;
    container.rotation.z = rotation.z;

    container.geometry.dispose();
    container.geometry = makeGeometry(
      containerDimensions.width,
      containerDimensions.height,
      containerDimensions.depth
    );

    renderer.render(scene, camera);
  }
</script>

<main>
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
        min="-1"
        max="1"
        step="0.01"
      />
    </label>
    <label>
      Rotation y:
      <input
        bind:value={rotation.y}
        type="range"
        min="-1"
        max="1"
        step="0.01"
      />
    </label>
    <label>
      Rotation z:
      <input
        bind:value={rotation.z}
        type="range"
        min="-1"
        max="1"
        step="0.01"
      />
    </label>
  </fieldset>
  <fieldset>
    <legend>Container</legend>
    <label
      >Width: <input
        type="number"
        bind:value={containerDimensions.width}
      /></label
    >
    <label
      >Height: <input
        type="number"
        bind:value={containerDimensions.height}
      /></label
    >
    <label
      >Depth: <input
        type="number"
        bind:value={containerDimensions.depth}
      /></label
    >
  </fieldset>
  <fieldset>
    <legend>Item</legend>
    <label
      >Width: <input type="number" bind:value={itemDimensions.width} /></label
    >
    <label
      >Height: <input type="number" bind:value={itemDimensions.height} /></label
    >
    <label
      >Depth: <input type="number" bind:value={itemDimensions.depth} /></label
    >
  </fieldset>
</main>
