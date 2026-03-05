# Timeline View Archive

These files are the original canvas-based timeline view for Chronicle, archived on 2026-03-05.

The network view (`NetworkView.tsx`) was chosen as the primary display for historical events,
making these files unused. They are preserved here in case we want to revisit the concept.

## Archived files

| File | Original location |
|------|-------------------|
| `Canvas.tsx` | `src/components/Canvas.tsx` |
| `CanvasEventLayer.tsx` | `src/components/CanvasEventLayer.tsx` |
| `WebGLEventLayer.tsx` | `src/components/WebGLEventLayer.tsx` |
| `ViewToggle.tsx` | `src/components/ViewToggle.tsx` |
| `useCollapsedBands.ts` | `src/hooks/useCollapsedBands.ts` |
| `bandDensity.ts` | `src/utils/bandDensity.ts` |
| `clustering.ts` | `src/utils/clustering.ts` |
| `collisionResolution.ts` | `src/utils/collisionResolution.ts` |
| `ClusterNode.tsx` | `src/components/ClusterNode.tsx` |

## What this view did

The timeline view was a 2D geographic canvas showing events plotted by time (X axis)
and geographic latitude (Y axis). It supported pan/zoom, region swim-lanes, clustering,
and WebGL acceleration for large event sets.

To restore it, move these files back to their original locations and re-add the
`Canvas`, `ViewToggle`, and related imports in `App.tsx`.
