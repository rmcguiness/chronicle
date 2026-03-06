/**
 * exportCanvas.ts — Capture the react-flow network view as a PNG image.
 *
 * Uses html2canvas-pro to render the `.react-flow__viewport` element at high
 * resolution and triggers a browser download of the resulting PNG.
 */

import html2canvas from 'html2canvas-pro';

/** Render scale factor for sharp output on high-DPI displays. */
const EXPORT_SCALE = 2;

/**
 * Capture the visible react-flow canvas and download it as a PNG file.
 *
 * @param filename - Optional filename (without extension). Defaults to
 *   `chronicle-network-{timestamp}`.
 * @throws If the react-flow viewport element cannot be found.
 */
export async function exportNetworkAsImage(filename?: string): Promise<void> {
  const viewport = document.querySelector<HTMLElement>('.react-flow__viewport');
  if (!viewport) {
    throw new Error('Could not find .react-flow__viewport element');
  }

  const canvas = await html2canvas(viewport, {
    scale: EXPORT_SCALE,
    backgroundColor: '#070e22',
    useCORS: true,
    logging: false,
  });

  const dataUrl = canvas.toDataURL('image/png');
  const name = filename ?? `chronicle-network-${Date.now()}`;

  const link = document.createElement('a');
  link.download = `${name}.png`;
  link.href = dataUrl;
  link.click();
}
