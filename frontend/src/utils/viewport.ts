/**
 * viewport.ts — Viewport culling utilities for react-flow canvas.
 * Owns: computing which canvas nodes fall within the visible screen area.
 * Does NOT own: node layout, event data fetching, or zoom clustering.
 */

/** Extra pixels beyond screen edge to keep rendered (prevents pop-in during fast pan) */
export const VIEWPORT_BUFFER_PX = 300;

/**
 * Returns true if a node at canvas X position falls within the current viewport.
 *
 * Converts canvas coordinates to screen coordinates using the ReactFlow viewport
 * transform, then checks whether the resulting screen X falls within the buffered
 * visible area. Only X-axis culling is applied — swim-lane bands span the full
 * screen height, so Y culling would incorrectly hide events.
 *
 * @param nodeX      - Node X position in canvas (flow) coordinates.
 * @param rfX        - ReactFlow viewport X translation (from useViewport / onMoveEnd).
 * @param rfZoom     - ReactFlow viewport zoom level (from useViewport / onMoveEnd).
 * @param screenWidth - Window width in pixels (typically window.innerWidth).
 * @returns `true` if the node's screen X falls within [-VIEWPORT_BUFFER_PX, screenWidth + VIEWPORT_BUFFER_PX].
 */
export function isNodeInViewport(
  nodeX: number,
  rfX: number,
  rfZoom: number,
  screenWidth: number,
): boolean {
  // ReactFlow transform: screenX = nodeX * zoom + offsetX
  const screenX = nodeX * rfZoom + rfX;
  return screenX > -VIEWPORT_BUFFER_PX && screenX < screenWidth + VIEWPORT_BUFFER_PX;
}
