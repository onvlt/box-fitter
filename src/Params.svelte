<script lang="ts">
  import { get, type Writable } from "svelte/store";
  import {
    containerDimensions,
    fit,
    itemDimensions,
    repeatBoxes,
    totalFit,
  } from "./store";
  import type { Dim } from "./types";

  function displayFit(n: number) {
    if (Number.isFinite(n)) {
      return Math.floor(n);
    }
    return "N/A";
  }

  function swap(dim: Writable<Dim>, a: keyof Dim, b: keyof Dim) {
    dim.update((d) => ({
      ...d,
      [a]: d[b],
      [b]: d[a],
    }));
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
    <button on:click={() => swap(itemDimensions, "width", "height")}>
      Swap width ↔ height
    </button>
    <button on:click={() => swap(itemDimensions, "height", "depth")}>
      Swap height ↔ depth
    </button>
    <button on:click={() => swap(itemDimensions, "depth", "width")}>
      Swap depth ↔ width
    </button>
  </fieldset>
  <fieldset>
    <legend>Display options</legend>
    <label>
      <input type="checkbox" bind:checked={$repeatBoxes} />
      Repeat items
    </label>
  </fieldset>
  <div>
    <p class="par-space">Fits:</p>
    <dl class="par-space">
      <dt>Width:</dt>
      <dd>{displayFit($fit.width)}</dd>
      <dt>Height:</dt>
      <dd>{displayFit($fit.height)}</dd>
      <dt>Depth:</dt>
      <dd>{displayFit($fit.depth)}</dd>
      <dt><strong>Total:</strong></dt>
      <dd>{$totalFit}</dd>
    </dl>
    {#if $totalFit === 0}
      <div class="warning">
        <p class="par-space-half">
          <strong>⚠️ Item doesn't fit the container.</strong>
        </p>
        <p>Try rotating the box.</p>
      </div>
    {:else if $totalFit === 1}
      <strong class="success">Item fits the container once.</strong>
    {:else if $totalFit === 2}
      <strong class="success">Item fits the container twice.</strong>
    {:else}
      <strong class="success">Item fits the container {$totalFit} times</strong>
    {/if}
  </div>
</div>

<style>
  h1 {
    font-weight: bold;
  }

  .params {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: var(--sidebar-size);
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

  .success {
    color: #00ff00;
  }

  .warning {
    color: #ffff00;
  }

  .par-space {
    margin-bottom: 1em;
  }

  .par-space-half {
    margin-bottom: 0.5rem;
  }
</style>
