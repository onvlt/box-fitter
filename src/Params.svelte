<script lang="ts">
  import {
    containerDimensions,
    fit,
    itemDimensions,
    repeatBoxes,
    totalFit,
  } from "./store";

  function displayFit(n: number) {
    if (Number.isFinite(n)) {
      return Math.floor(n);
    }
    return "N/A";
  }
</script>

<div class="params">
  <h1>Box fit visualiser</h1>
  <fieldset class="dim-inputs">
    <legend>Container</legend>
    <label>
      Width: <input
        type="number"
        bind:value={$containerDimensions.width}
        min="0"
        step="0.5"
      />
    </label>
    <label>
      Height: <input
        type="number"
        bind:value={$containerDimensions.height}
        min="0"
        step="0.5"
      />
    </label>
    <label>
      Depth: <input
        type="number"
        bind:value={$containerDimensions.depth}
        min="0"
        step="0.5"
      />
    </label>
  </fieldset>
  <fieldset class="dim-inputs">
    <legend>Item</legend>
    <label>
      Width: <input
        type="number"
        bind:value={$itemDimensions.width}
        min="0"
        step="0.5"
      />
    </label>
    <label>
      Height: <input
        type="number"
        bind:value={$itemDimensions.height}
        min="0"
        step="0.5"
      />
    </label>
    <label>
      Depth: <input
        type="number"
        bind:value={$itemDimensions.depth}
        min="0"
        step="0.5"
      />
    </label>
  </fieldset>
  <div>
    Fits
    <dl>
      <dt>Width:</dt>
      <dd>{displayFit($fit.width)}</dd>
      <dt>Height:</dt>
      <dd>{displayFit($fit.height)}</dd>
      <dt>Depth:</dt>
      <dd>{displayFit($fit.depth)}</dd>
      <dt><strong>Total:</strong></dt>
      <dd>{$totalFit}</dd>
    </dl>
  </div>
  <div>
    <label>
      <input type="checkbox" bind:checked={$repeatBoxes} />
      Repeat
    </label>
  </div>
</div>

<style>
  h1 {
    font: inherit;
  }

  .params {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    max-width: 300;
    background-color: #222;
    padding: 1rem;
    color: white;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow-y: auto;
  }

  fieldset {
    border: 1px solid #999;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1.25rem 1rem 1rem;
  }

  .dim-inputs label {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
  }

  dl {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.5rem;
  }

  dd {
    margin: 0;
  }
</style>