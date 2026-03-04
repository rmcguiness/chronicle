/**
 * useViewportCulling.ts
 *
 * Viewport culling hook for React Flow canvas.
 *
 * Responsibility: Given a full list of React Flow nodes, return only the
 * subset that intersects the current viewport (plus a configurable pixel
 * buffer). This prevents off-screen nodes from consuming render cycles.
 *
 * Does NOT: modify node data, interact with the store, build or update
 * nodes, or handle edges (React Flow culls edges automatically when their
 * source/target nodes are absent from the rendered list).
 *
 * Must be called from inside a <ReactFlowProvider> / <ReactFlow> subtree so
 * that `useViewport()` can access the shared React Flow context.
 */

import { useMemo } from 'react';
import { useViewport, type Node } from '@xyflow/react';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Extra pixels added to each edge of the visible viewport before culling.
 * Nodes within this buffer distance of the screen edge are kept so they pop
 * in smoothly as the user pans rather than appearing abruptly.
 */
const CULL_BUFFER_PX = 200;

/**
 * Fallback node width used when React Flow has not yet measured the node and
 * no explicit `width` is set. Chronicle's EventNode ranges 16–48 px; using
 * the maximum avoids clipping nodes that are near the viewport edge.
 */
const FALLBACK_NODE_WIDTH_PX = 48;

/**
 * Fallback node height used when dimensions are not yet measured.
 * EventNode is roughly square, so the same value as width is appropriate.
 */
const FALLBACK_NODE_HEIGHT_PX = 48;

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Filters a React Flow node array to only those that intersect the current
 * viewport (plus {@link CULL_BUFFER_PX} on each side).
 *
 * Nodes with `hidden: true` are excluded regardless of position — they are
 * already suppressed by the LOD/importance system and should not be rendered.
 *
 * The result is memoized and only recomputed when `nodes`, or the viewport
 * transform (`x`, `y`, `zoom`) changes.
 *
 * @param nodes - The full list of React Flow nodes (source of truth). This
 *   array is **not** mutated; a new filtered array is returned.
 * @returns A subset of `nodes` that are within the padded viewport bounds and
 *   not marked hidden — safe to pass directly to `<ReactFlow nodes={...} />`.
 *
 * @example
 * ```tsx
 * function CanvasInner() {
 *   const [nodes, setNodes] = useNodesState([]);
 *   const visibleNodes = useViewportCulling(nodes);
 *   return <ReactFlow nodes={visibleNodes} ... />;
 * }
 * ```
 */
export function useViewportCulling(nodes: Node[]): Node[] {
  // useViewport() re-renders this hook on every pan/zoom frame — intentional,
  // because culling must track the viewport in real time.
  const { x, y, zoom } = useViewport();

  return useMemo(() => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Convert the buffered screen rectangle to canvas (flow) coordinates.
    //
    // React Flow's transform: screenPx = canvasPx * zoom + offset
    // Therefore:              canvasPx = (screenPx - offset) / zoom
    //
    // Buffered screen rect: [-BUFFER, W+BUFFER] × [-BUFFER, H+BUFFER]
    const minCanvasX = (-CULL_BUFFER_PX - x) / zoom;
    const maxCanvasX = (viewportWidth + CULL_BUFFER_PX - x) / zoom;
    const minCanvasY = (-CULL_BUFFER_PX - y) / zoom;
    const maxCanvasY = (viewportHeight + CULL_BUFFER_PX - y) / zoom;

    return nodes.filter((node) => {
      // Respect existing hidden flag set by the LOD/importance system.
      if (node.hidden) return false;

      const nx = node.position.x;
      const ny = node.position.y;

      // Prefer React Flow's post-layout measured size; fall back to the
      // explicit width/height props; then fall back to our safe estimates.
      const nw = node.measured?.width ?? node.width ?? FALLBACK_NODE_WIDTH_PX;
      const nh = node.measured?.height ?? node.height ?? FALLBACK_NODE_HEIGHT_PX;

      // AABB intersection: node rect [nx, nx+nw] × [ny, ny+nh] vs canvas rect.
      return (
        nx + nw >= minCanvasX &&
        nx <= maxCanvasX &&
        ny + nh >= minCanvasY &&
        ny <= maxCanvasY
      );
    });
  }, [nodes, x, y, zoom]);
}
