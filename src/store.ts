import { derived, writable } from "svelte/store";
import type { Dim } from "./types";

export const containerDimensions = writable<Dim>({
  width: 120,
  height: 60,
  depth: 40,
});

export const itemDimensions = writable<Dim>({
  width: 20,
  height: 50,
  depth: 30,
});

export const repeatBoxes = writable(true);

export const fit = derived(
  [containerDimensions, itemDimensions],
  ([$container, $item]) => ({
    width: $container.width / $item.width,
    height: $container.height / $item.height,
    depth: $container.depth / $item.depth,
  })
);

export const totalFit = derived(fit, ($fit) =>
  Object.values($fit)
    .filter(Number.isFinite)
    .map(Math.floor)
    .reduce((a, b) => a * b, 1)
);
